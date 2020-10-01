const ORDER = 3;
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
        model = new NGramModel(ORDER);
        model.buildModelFromTokens(tokens);
    }
    reader.readAsText(files[0]);
}

function generateText() {
    if (!model) {
        alert("You need to build the model first!");
        return;
    }
    const generatedTokens = model.generateTokens(["Yes", "I"], 100);
    const generatedText = generatedTokens.join(" ");
    document.getElementById("generated-text").innerText = generatedText;
}

function tokenize(text) {
    // split text into tokens
    // regex: \s => whitespace (including tab, newline), + => one or more
    return text.split(/\s+/);
}
