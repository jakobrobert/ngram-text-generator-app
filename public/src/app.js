const ORDER = 3;

const BASE_URL = "https://jack0042.uber.space/ngram-text-generator-api";

// special chars which are concatenated to the previous with a separation by space
const SPECIAL_CHARS_WITH_SEPARATION = ["(", "[", "{", "\""];

// special chars which are directly concatenated to the previous token without any separation
const SPECIAL_CHARS_WITHOUT_SEPARATION = [".", "?", "!", ",", ";", ":", ")", "]", "}", "\n"];

// all special chars, no distinction necessary for building the model
const SPECIAL_CHARS = SPECIAL_CHARS_WITH_SEPARATION.concat(SPECIAL_CHARS_WITHOUT_SEPARATION)

let model;
let dictionary;
let buildModelFinished = false;

let startTime;
let elapsedTime;

let api;

function init() {
    api = new APIClient(BASE_URL);
}

async function buildModel() {
    const files = document.getElementById("training-text-file").files;
    if (files.length === 0) {
        alert("You need to choose a text file!");
        return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
        const text = reader.result;
        buildModelFinished = false;
        startTime = performance.now();
        model = await api.buildModel(ORDER, text);
        buildModelFinished = true;
        elapsedTime = performance.now() - startTime;
        console.log("Build model: " + elapsedTime + " ms");
        console.log(model);
    }
    reader.readAsText(files[0]);
}

// TODO: Remove later
async function buildModelFromText(text) {
    buildModelFinished = false;

    // pre-process text
    startTime = performance.now();
    const tokens = preProcessText(text);
    elapsedTime = performance.now() - startTime;
    console.log("Pre-processing: " + elapsedTime + " ms");
    console.log("Training text tokens length: " + tokens.length);

    // build model
    model = new NGramModel(ORDER);
    startTime = performance.now();
    model.buildModelFromTokens(tokens);
    elapsedTime = performance.now() - startTime;
    console.log("Build model: " + elapsedTime + " ms");

    buildModelFinished = true;

    console.log(model);
}

function preProcessText(text) {
    const filteredText = filterText(text);
    const tokens = tokenize(filteredText);
    buildDictionary(tokens);
    return convertTokensFromStringToID(tokens);
}

function filterText(text) {
    // remove all "\r" (carriage return)
    return text.replace(/\r/g, "");
}

function tokenize(text) {
    const tokens = [];
    let current = 0;
    let tokenStart = 0;
    while (current < text.length) {
        if (text[current] === " ") {
            // found space
            // take string before space as token (only if not empty)
            if (tokenStart < current) {
                const token = text.substring(tokenStart, current);
                tokens.push(token);
            }
            current++;
            tokenStart = current;
        } else if (SPECIAL_CHARS.includes(text[current])) {
            // found special char
            // take string before special char as token (only if not empty)
            if (tokenStart < current) {
                const token = text.substring(tokenStart, current);
                tokens.push(token);
            }
            // add special char as separate token
            const specialChar = text[current];
            tokens.push(specialChar);
            current++;
            tokenStart = current;
        } else {
            // found nothing, just go to next char
            current++;
        }
    }
    // add the remaining part as last token (only if not empty)
    if (tokenStart < text.length) {
        const token = text.substring(tokenStart, text.length);
        tokens.push(token);
    }
    return tokens;
}

function buildDictionary(tokens) {
    dictionary = new Dictionary();
    for (const token of tokens) {
        dictionary.addToken(token);
    }
}

function convertTokensFromStringToID(tokens) {
    const ids = new Array(tokens.length);
    for (let i = 0; i < ids.length; i++) {
        const id = dictionary.getIDOfToken(tokens[i]);
        if (id === undefined) {
            return undefined;
        }
        ids[i] = dictionary.getIDOfToken(tokens[i]);
    }
    return ids;
}

async function generateText() {
    if (!buildModelFinished) {
        alert("You need to build the model first!");
        return;
    }

    const startText = document.getElementById("start-text").value;

    // TODO: Remove later
    /*
    const startHistory = tokenize(startText);
    if (startHistory.length !== 2) {
        alert("Invalid start text!\n" +
            "It must include exactly 2 tokens.\n" +
            "Punctuation / special characters count separately.");
        return;
    }

    const startHistoryAsIDs = convertTokensFromStringToID(startHistory);
    if (!isStartHistoryValid(startHistoryAsIDs)) {
        alert("Invalid start text!\nIt must appear somewhere in the training text.");
        return;
    }
     */

    const lengthStr = document.getElementById("text-length").value;
    if (lengthStr === undefined) {
        alert("Invalid text length!");
        return;
    }
    const length = Number.parseInt(lengthStr);

    startTime = performance.now();
    const generatedText = await api.generateText(startText, length, model);
    elapsedTime = performance.now() - startTime;
    console.log("Generate text: " + elapsedTime + " ms");
    console.log(generatedText);
}

function isStartHistoryValid(startHistory) {
    if (startHistory === undefined) {
        return false;
    }
    return model.findNGramByHistory(startHistory) !== undefined;
}

// TODO: Remove later
function generateTextFromStartHistory(startHistory, length) {
    // generate tokens
    startTime = performance.now();
    const tokensAsIDs = model.generateTokens(startHistory, length);
    elapsedTime = performance.now() - startTime;
    console.log("Generate tokens: " + elapsedTime + " ms");
    console.log("Generated tokens length: " + tokensAsIDs.length);
    startTime = performance.now();

    // post-process tokens to create text
    const text = postProcessTokens(tokensAsIDs);
    elapsedTime = performance.now () - startTime;
    console.log("Post-processing: " + elapsedTime + " ms");

    // show text
    document.getElementById("generated-text").innerText = text;
}

function postProcessTokens(tokensAsIDs) {
    const tokens = convertTokensFromIDToString(tokensAsIDs);
    return concatenateTokens(tokens);
}

function convertTokensFromIDToString(tokensAsIDs) {
    const tokens = new Array(tokensAsIDs.length);
    for (let i = 0; i < tokens.length; i++) {
        tokens[i] = dictionary.getTokenByID(tokensAsIDs[i]);
    }
    return tokens;
}

function concatenateTokens(tokens) {
    if (tokens.length === 0) {
        return;
    }

    // first token without leading space
    let text = tokens[0] // assigning is safe, strings are always copied

    // concatenate all tokens except first one
    for (let i = 1; i < tokens.length; i++) {
        const currToken = tokens[i];
        const prevToken = tokens[i - 1];
        if (SPECIAL_CHARS_WITHOUT_SEPARATION.includes(currToken)) {
            // concatenate token without any separation
            text += currToken; // += is efficient for concatenation
        } else {
            // both cases: special chars with separation and normal words
            // concatenate token with separation by space
            // but only if previous token was not a special char with separation
            // example: "bla (hello)". should separate "(" by space, but not "hello"
            if (!SPECIAL_CHARS_WITH_SEPARATION.includes(prevToken)) {
                text += " ";
            }
            text += currToken;
        }
    }

    return text;
}
