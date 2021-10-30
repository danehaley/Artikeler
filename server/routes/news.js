// Package imports
import express from "express";
import axios from "axios";
import logger from "morgan";
import AWS from "aws-sdk";
import redis from "redis";

// API Keychain import
import { keychain } from "../keychain.js";

// Module import
import { s3Add } from "../modules/s3.js";

import {
  tagger,
  tokenize,
  sentimentAnalysis,
  sentimentTag,
} from "../modules/language-processing.js";

// Redis setup
const redisClient = redis.createClient();

redisClient.on("error", (err) => {
  console.log("Error " + err);
});

// Globals
const ONE_HOUR = 60 * 60 * 1000; /* ms */
const bucketName = "n9951831-artikeler";

const router = express.Router();
router.use(logger("dev"));

// GET Top News Route
router.get("/headlines/:country?", (req, res) => {
  let promises = [];
  const s3Key = `news-headlines-${req.params.country}`
    .replace(/\s+/g, "-")
    .toLowerCase();
  const params = { Bucket: bucketName, Key: s3Key };
  const redisKey = `search:${req.params.query}`;
  let news = { articles: [] };
  const gnewsSetting = {
    lang: "en",
    query: req.params.query,
    country: req.params.country,
  };

  return redisClient.get(redisKey, (err, result) => {
    if (result) {
      const resultJSON = JSON.parse(result);
      return res.status(200).json(resultJSON);
    } else {
      return new AWS.S3({ apiVersion: "2006-03-01" }).getObject(
        params,
        (err, result) => {
          // If S3 less than 0.5 hours old
          if (result && new Date() - result.LastModified < ONE_HOUR) {
            const resultJSON = JSON.parse(result.Body);
            redisClient.setex(
              redisKey,
              3600,
              JSON.stringify({ source: "Redis Cache", ...resultJSON })
            );
            return res.status(200).json(resultJSON);
          } else {
            promises.push(
              axios
                .get(
                  `https://gnews.io/api/v4/top-headlines?lang=${gnewsSetting.lang}&country=${gnewsSetting.country}&token=${keychain.gnews}`
                )
                .then((response) => {
                  return response.data;
                })
                .then((rsp) => {
                  news.articles = news.articles.concat(rsp.articles);
                  news.articles = news.articles.map((article) => ({
                    ...article,
                    tags: tagger(article.title + " " + article.description),
                    sentiment: sentimentTag(
                      sentimentAnalysis(tokenize(article.title))
                    ),
                  }));
                  //news.articles = news.articles.map(({title, description, content, url, image, publishedAt, source, ...rest}) => rest);
                })
            );

            return Promise.all(promises).then(() => {
              res.json({
                source: "API",
                ...news,
              });
              redisClient.setex(
                redisKey,
                3600,
                JSON.stringify({ source: "Redis Cache", ...news })
              );
              s3Add(`headlines${"-" + req.params.country}`, news);
            });
          }
        }
      );
    }
  });
});

// GET News Route
router.get("/search/:query/:dateFrom?/:dateTo?", (req, res) => {
  const s3Key = `news-search-${req.params.query}`;
  const redisKey = `search:${req.params.query}`;
  const params = { Bucket: bucketName, Key: s3Key };
  let promises = [];

  let news = { articles: [] };
  const gnewsSetting = {
    lang: "en",
    query: req.params.query,
    sortBy: "relevance",
  };
  const newsSetting = {
    query: req.params.query,
    sortBy: "popularity",
  };
  const currentsSetting = {
    query: req.params.query,
    pages: "50",
  };

  if (req.params.query === null) {
    return null;
  } else {
    return redisClient.get(redisKey, (err, result) => {
      if (result) {
        const resultJSON = JSON.parse(result);
        redisClient.setex(
          redisKey,
          3600,
          JSON.stringify({ source: "Redis Cache", ...resultJSON })
        );
        return res.status(200).json(resultJSON);
      } else {
        // Tried to add this to s3 module as "S3Get(query, func)" but ran into issues
        return new AWS.S3({ apiVersion: "2006-03-01" }).getObject(
          params,
          (err, result) => {
            // If S3 over a hour old
            if (result && new Date() - result.LastModified < ONE_HOUR) {
              const resultJSON = JSON.parse(result.Body);
              return res.status(200).json(resultJSON);
            } else {
              promises.push(
                /*      NEWS API CALL       */
                axios
                  .get(
                    `https://newsapi.org/v2/everything?q=${newsSetting.query}&sortBy=${newsSetting.sortBy}&apiKey=${keychain.news}`
                  )
                  .then((response) => {
                    return response.data;
                  })
                  .then((rsp) => {
                    rsp.articles = rsp.articles.map((article) => {
                      article.image = article.urlToImage;
                      delete article.urlToImage;
                      return article;
                    });
                    news.articles = news.articles.concat(rsp.articles);
                    news.articles = news.articles.map(
                      ({ content, ...rest }) => rest
                    );
                  })
              );

              // This API is dreadfully slow & unstable - in some cases causing GET speeds to react upwards of 10 seconds... even a minute.
              /*promises.push(
            /*      CURRENTS API CALL       */
              /*axios
              .get(
                `https://api.currentsapi.services/v1/search?keywords=${currentsSetting.query}&limit=10&apiKey=${keychain.currents}`
              )
              .then((response) => {
                return response.data;
              })
              .then((rsp) => {
                news.articles = news.articles.concat(rsp.news);
                console.log("currents is done");
              })
          );*/

              return Promise.all(promises)
                .then(() => {
                  news.articles = news.articles.map((article) => ({
                    ...article,
                    tags: tagger(article.title + " " + article.description),
                    sentiment: sentimentTag(
                      sentimentAnalysis(
                        tokenize(article.title + " " + article.description)
                      )
                    ),
                  }));
                })
                .then(() => {
                  redisClient.setex(
                    redisKey,
                    3600,
                    JSON.stringify({ source: "Redis Cache", ...news })
                  );
                  res.json({
                    source: "API",
                    ...news,
                  });
                  s3Add(news, s3Key.replace(/\s+/g, "-").toLowerCase());
                });
            }
          }
        );
      }
    });
  }
});
export { router };
