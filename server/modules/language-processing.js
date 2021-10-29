import natural from "natural";
import { toString } from "nlcst-to-string";
import { retext } from "retext";
import { blockList } from "./block-list.js";
import retextPos from "retext-pos";
import retextKeywords from "retext-keywords";

function tagger(input, setting) {
  let tags = [];

  if (typeof input === "string") {
    retext()
      .use(retextPos) // Make sure to use `retext-pos` before `retext-keywords`.
      .use(retextKeywords)
      .process(input)
      .then((file) => {
        file.data.keyphrases.forEach((phrase) => {
          let doc = phrase.matches[0].nodes
            .map((d) => toString(d).toLowerCase())
            .join("")
            .split(" ");

          doc.map((word) => {
            for (let i = 0; i < tags.length; i++) {
              if (tags[i].includes(word) || blockList.includes(word)) {
                doc = null;
                break;
              }
            }
          });

          if (doc !== null) {
            // Replacing & hypenating
            doc = doc.join("-");
            doc = doc.replace(/[.,\/#!$%\^&\*;:{}=_`'~()]/g, "");
            doc = doc.replace(/\n/g, "-");
            tags.push(doc);
          }
        });
      });
    tags = tags.slice(0, 4);
    return tags;
  } else {
    throw "Tagger input is not a string.";
  }
}

function tokenize(input) {
  const tokenizer = new natural.WordTokenizer();
  if (typeof input === "string") {
    let tokens = tokenizer.tokenize(input);
    return tokens;
  } else {
    throw "Tagger input is not a string.";
  }
}

function sentimentAnalysis(tokens) {
  const Analyzer = natural.SentimentAnalyzer;
  const stemmer = natural.PorterStemmer;
  const analyzer = new Analyzer("English", stemmer, "afinn");
  const sentiment = analyzer.getSentiment(tokens);
  return sentiment;
}

function sentimentTag(sentiment) {
  if (-0.1 < sentiment && sentiment < 0.1) {
    return { word: null, color: null };
  } else if (0.1 >= sentiment) {
    return { word: "negative", color: "red" };
  } else if (0.1 <= sentiment) {
    return { word: "positive", color: "green" };
  }
}

export { tagger, tokenize, sentimentAnalysis, sentimentTag };
