// TODO: Only test code, remove later

async function runAPITest() {
    const api = new APIClient("https://jack0042.uber.space/ngram-text-generator-api");
    await testBuildModel(api);
    await testGenerateText(api);
}

async function testBuildModel(api) {
    console.log("testBuildModel");

    const order = 3;
    const trainingText = "Hello, what is going on?";

    const response = await api.buildModel(order, trainingText);
    console.log(response);
}

async function testGenerateText(api) {
    console.log("testGenerateText");

    const startText = "All I";
    const textLength = 100;
    const model = {
        order: 3,
            ngrams: [{
        history: [0, 1],
        predictions: [{
            token: 2,
            probability: 0.1111111111111111
        }, {
            token: 5,
            probability: 0.8888888888888888
        }]
        }, {
            history: [1, 2],
            predictions: [{
                token: 3,
                probability: 1
            }]
        }]
    };

    const response = await api.generateText(startText, textLength, model);
    console.log(response);
}
