const BASE_URL = "https://jack0042.uber.space/ngram-text-generator-api";
const MODEL_ORDER = 3;

let api;
let model;
let dictionary;
let buildModelFinished = false;

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
        const startTime = performance.now();
        const response = await api.buildModel(MODEL_ORDER, text);
        const elapsedTime = performance.now() - startTime;
        console.log("Build model: " + elapsedTime + " ms");
        console.log("Training text token count: " + response["token_count"]);
        model = response["model"];
        dictionary = response["dictionary"];
        buildModelFinished = true;
    }
    reader.readAsText(files[0]);
}

async function generateText() {
    if (!buildModelFinished) {
        alert("You need to build the model first!");
        return;
    }

    const lengthStr = document.getElementById("text-length").value;
    if (lengthStr === undefined) {
        alert("Invalid text length!");
        return;
    }
    const length = Number.parseInt(lengthStr);

    let startText = document.getElementById("start-text").value;
    if (startText === "") {
        startText = undefined;
    }

    const startTime = performance.now();
    const response = await api.generateText(model, dictionary, length, startText);
    const elapsedTime = performance.now() - startTime;
    console.log("Generate text: " + elapsedTime + " ms");
    console.log("Generated text token count: " + response["token_count"]);

    document.getElementById("generated-text").innerText = response["text"];
}
