const ORDER = 3;

let dictionary;
let model;

let startTime;
let elapsedTime;

function buildModel() {
    const files = document.getElementById("training-text-file").files;
    if (files.length === 0) {
        alert("You need to choose a text file!");
        return;
    }
    const reader = new FileReader();
    reader.onload = () => {
        const text = reader.result;
        startTime = performance.now();
        const tokens = preProcessText(text);
        elapsedTime = performance.now() - startTime;
        console.log("Pre-processing: " + elapsedTime + " ms");
        console.log("Training text tokens length: " + tokens.length);
        model = new NGramModel(ORDER);
        startTime = performance.now();
        model.buildModelFromTokens(tokens);
        elapsedTime = performance.now() - startTime;
        console.log("Build model: " + elapsedTime + " ms");
    }
    reader.readAsText(files[0]);
}

function preProcessText(text) {
    const tokens = tokenize(text);
    dictionary = new Dictionary();
    for (const token of tokens) {
        dictionary.addToken(token);
    }
    return convertTokensToNumbers(tokens);
}

function tokenize(text) {
    // regex: \s => whitespace (including tab, newline), + => one or more
    return text.split(/\s+/);
}

function convertTokensToNumbers(tokens) {
    const numbers = new Array(tokens.length);
    for (let i = 0; i < numbers.length; i++) {
        numbers[i] = dictionary.getIDOfToken(tokens[i]);
    }
    return numbers;
}

function generateText() {
    if (!model) {
        alert("You need to build the model first!");
        return;
    }

    const startText = document.getElementById("start-text").value;
    const startHistory = tokenize(startText);
    if (startHistory.length !== 2) {
        alert("You need to specify a start text of exactly 2 words!");
        return;
    }

    const length = document.getElementById("text-length").value;
    if (!length) {
        alert("Please specify a valid number for the text length!");
        return;
    }

    const startHistoryAsNumbers = convertTokensToNumbers(startHistory);

    startTime = performance.now();
    const tokens = model.generateTokens(startHistoryAsNumbers, length);
    elapsedTime = performance.now() - startTime;
    console.log("Generate tokens: " + elapsedTime + " ms");
    console.log("Generated tokens length: " + tokens.length);
    startTime = performance.now();
    const text = postProcessTokens(tokens);
    elapsedTime = performance.now () - startTime;
    console.log("Post-processing: " + elapsedTime + " ms");
    document.getElementById("generated-text").innerText = text;
}

function postProcessTokens(tokensAsNumbers) {
    const tokens = new Array(tokensAsNumbers.length);
    for (let i = 0; i < tokens.length; i++) {
        tokens[i] = dictionary.getTokenByID(tokensAsNumbers[i]);
    }
    return tokens.join(" ");
}
