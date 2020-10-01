const trainingText = "n-gram models are widely used in statistical natural language processing. In speech recognition, phonemes and sequences of phonemes are modeled using a n-gram distribution. For parsing, words are modeled such that each n-gram is composed of n words. For language identification, sequences of characters/graphemes (e.g., letters of the alphabet) are modeled for different languages.[4] For sequences of characters, the 3-grams (sometimes referred to as \"trigrams\") that can be generated from \"good morning\" are \"goo\", \"ood\", \"od \", \"d m\", \" mo\", \"mor\" and so forth, counting the space character as a gram (sometimes the beginning and end of a text are modeled explicitly, adding \"_ ⁠_g\", \"_go\", \"ng_\", and \"g_ ⁠_\"). For sequences of words, the trigrams (shingles) that can be generated from \"the dog smelled like a skunk\" are \"# the dog\", \"the dog smelled\", \"dog smelled like\", \"smelled like a\", \"like a skunk\" and \"a skunk #\".\n" +
    "\n" +
    "Practitioners[who?] more interested in multiple word terms might preprocess strings to remove spaces.[who?] Many simply collapse whitespace to a single space while preserving paragraph marks, because the whitespace is frequently either an element of writing style or introduces layout or presentation not required by the prediction and deduction methodology. Punctuation is also commonly reduced or removed by preprocessing and is frequently used to trigger functionality.\n" +
    "\n" +
    "n-grams can also be used for sequences of words or almost any type of data. For example, they have been used for extracting features for clustering large sets of satellite earth images and for determining what part of the Earth a particular image came from.[5] They have also been very successful as the first pass in genetic sequence search and in the identification of the species from which short sequences of DNA originated.[6]\n" +
    "\n" +
    "n-gram models are often criticized because they lack any explicit representation of long range dependency. This is because the only explicit dependency range is (n − 1) tokens for an n-gram model, and since natural languages incorporate many cases of unbounded dependencies (such as wh-movement), this means that an n-gram model cannot in principle distinguish unbounded dependencies from noise (since long range correlations drop exponentially with distance for any Markov model). For this reason, n-gram models have not made much impact on linguistic theory, where part of the explicit goal is to model such dependencies.\n" +
    "\n" +
    "Another criticism that has been made is that Markov models of language, including n-gram models, do not explicitly capture the performance/competence distinction. This is because n-gram models are not designed to model linguistic knowledge as such, and make no claims to being (even potentially) complete models of linguistic knowledge; instead, they are used in practical applications.\n" +
    "\n" +
    "In practice, n-gram models have been shown to be extremely effective in modeling language data, which is a core component in modern statistical language applications.\n" +
    "\n" +
    "Most modern applications that rely on n-gram based models, such as machine translation applications, do not rely exclusively on such models; instead, they typically also incorporate Bayesian inference. Modern statistical models are typically made up of two parts, a prior distribution describing the inherent likelihood of a possible result and a likelihood function used to assess the compatibility of a possible result with observed data. When a language model is used, it is used as part of the prior distribution (e.g. to gauge the inherent \"goodness\" of a possible translation), and even then it is often not the only component in this distribution.\n" +
    "\n" +
    "Handcrafted features of various sorts are also used, for example variables that represent the position of a word in a sentence or the general topic of discourse. In addition, features based on the structure of the potential result, such as syntactic considerations, are often used. Such features are also used as part of the likelihood function, which makes use of the observed data. Conventional linguistic theory can be incorporated in these features (although in practice, it is rare that features specific to generative or other particular theories of grammar are incorporated, as computational linguists tend to be \"agnostic\" towards individual theories of grammar[citation needed]). ";

const order = 3;
let model;

function buildModel() {
    const files = document.getElementById("training-text-file").files;
    if (files.length === 0) {
        alert("You need to choose a text file!");
        return;
    }
    const reader = new FileReader();
    reader.onload = () => {
        const text = reader.result;
        const tokens = tokenize(text);
        model = buildModelFromTokens(tokens);
        console.log(model);
    }
    reader.readAsText(files[0]);
}

function generateText() {
    if (!model) {
        alert("You need to build the model first!");
        return;
    }
    const generatedTokens = generateTokensFromModel(model, ["All", "I"], 100);
    const generatedText = generatedTokens.join(" ");
    document.getElementById("generated-text").innerText = generatedText;
}

function tokenize(text) {
    // split text into tokens
    // regex: \s => whitespace (including tab, newline), + => one or more
    return text.split(/\s+/);
}

function buildModelFromTokens(tokens) {
    const ngrams = [];
    for (let i = 0; i < tokens.length - (order - 1); i++) {
        // get current ngram and split into history and follower
        const history = [];
        for (let j = 0; j < order - 1; j++) {
            history.push(tokens[i + j]);
        }
        const follower = tokens[i + order - 1];
        // find corresponding ngram to current history
        const ngramIndex = findNGramByHistory(ngrams, history);
        if (ngramIndex === -1) {
            // if ngram does not exist, create new ngram
            const ngram = {
                history: history,
                followers: [follower]
            };
            ngrams.push(ngram);
        } else {
            // if ngram already exists, add follower
            ngrams[ngramIndex].followers.push(follower);
        }
    }
    return ngrams;
}

function findNGramByHistory(ngrams, history) {
    for (let j = 0; j < ngrams.length; j++) {
        if (arraysEqual(history, ngrams[j].history)) {
            return j;
        }
    }
    return -1;
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}

function generateTokensFromModel(ngrams, startHistory, length) {
    const tokens = startHistory.slice(0); // copy

    let currHistory = startHistory;

    while (tokens.length < length) {
        // find ngram starting with the current history
        const ngramIndex = findNGramByHistory(ngrams, currHistory);
        if (ngramIndex === -1) {
            // ngram with current history not found
            // may occur if start history is invalid,
            // or if it current history appeared at the end of the training text
            return tokens;
        }
        const ngram = ngrams[ngramIndex];

        // pick random follower and add it to the tokens
        const followers = ngram.followers;
        const followerIndex = Math.floor(Math.random() * followers.length);
        const follower = followers[followerIndex];
        tokens.push(follower);

        // update history -> use last (order - 1) tokens
        currHistory = tokens.slice(tokens.length - (order - 1), tokens.length);
    }

    return tokens;
}
