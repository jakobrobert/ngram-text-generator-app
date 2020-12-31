const BASE_URL = "https://jack0042.uber.space/ngram-text-generator-api";
const MODEL_ORDER = 3;

let api;
let modelID;
let buildModelFinished = false;

function init() {
    api = new APIClient(BASE_URL);
}

async function buildModel() {
    buildModelFinished = false;

    const files = document.getElementById("training-text-file").files;
    if (files.length === 0) {
        alert("You need to choose a text file!");
        return;
    }

    const statusLabel = document.getElementById("build-model-status");
    statusLabel.textContent = "Processing..."

    const reader = new FileReader();
    reader.onload = async () => {
        const text = reader.result;
        const startTime = performance.now();
        const response = await api.buildModel(MODEL_ORDER, text);
        const elapsedTime = performance.now() - startTime;
        modelID = response["model_id"];
        buildModelFinished = true;
        statusLabel.textContent = "Finished!"
        console.log("Build model: " + elapsedTime + " ms");
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

    const statusLabel = document.getElementById("generate-text-status");
    statusLabel.textContent = "Processing..."

    const startTime = performance.now();
    const response = await api.generateText(modelID, length, startText);
    const elapsedTime = performance.now() - startTime;
    console.log("Generate text: " + elapsedTime + " ms");

    document.getElementById("generated-text").innerText = response["text"];

    statusLabel.textContent = "Finished!"
}
