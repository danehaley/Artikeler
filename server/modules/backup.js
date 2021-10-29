import natural from "natural";
import { toString } from "nlcst-to-string";
import { retext } from "retext";
import retextPos from "retext-pos";
import retextKeywords from "retext-keywords";
import rake from "node-rake";

function tagger(input, setting) {
  let tags = [];
  if (typeof input === "string") {
    retext()
      .use(retextPos) // Make sure to use `retext-pos` before `retext-keywords`.
      .use(retextKeywords)
      .process(input)
      .then((file) => {
        file.data.keyphrases.forEach((phrase) => {
          let tag = phrase.matches[0].nodes.map((d) => toString(d)).join("");
          tag = tag.replace(/[.,\/#!$%\^&\*;:{}=_`'~()]/g, "");
          tag = tag.replace(/\s{2,}/g, " ");
          tag = tag.replace(/\s+/g, "-").toLowerCase();
          tags.push(tag);
        });
      });
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

export { tagger, tokenize, sentimentAnalysis };
