// TODO: Only test code, integrate and remove later
const BASE_URL = "https://jack0042.uber.space/ngram-text-generator-api";

async function runAPITest() {
    await testBuildModel();
}

async function testBuildModel() {
    const url = BASE_URL + "/build-model";
    const data = {
        order: 3,
        training_text: "Hello, what is going on?"
    };
    const response = await postData(url, data);
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
    return response.json();
}
