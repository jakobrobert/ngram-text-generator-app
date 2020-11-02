// TODO: Only test code, integrate and remove later
const BASE_URL = "https://jack0042.uber.space/ngram-text-generator-api";

async function runAPITest() {
    await testBuildModel();
    await testGenerateText();
}

async function testBuildModel() {
    const url = BASE_URL + "/build-model";
    const data = {
        order: 3,
        training_text: "Hello, what is going on?"
    };
    const response = await postData(url, data);
    console.log("test build-model");
    console.log(response);
}

async function testGenerateText() {
    const url = BASE_URL + "/generate-text";
    const data = {
        start_text: "All I",
        text_length: "100",
        model: {
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
        }
    };
    const response = await postData(url, data);
    console.log("test generate-text");
    console.log(response);
}

async function postData(url, data) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error("Request failed: " +  response.statusText);
    }
    return response.json();
}
