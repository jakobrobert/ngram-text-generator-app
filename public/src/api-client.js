class APIClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async buildModel(order, trainingText) {
        const url = this.baseURL + "/build-model";
        const data = {
            "order": order,
            "training_text": trainingText
        };
        return await this.postData(url, data);
    }

    async generateText(model, dictionary, length, startText) {
        const url = this.baseURL + "/generate-text";
        const data = {
            "model": model,
            "dictionary": dictionary,
            "length": length
        };
        if (startText) {
            // start text is optional
            data["start_text"] = startText;
        }
        return await this.postData(url, data);
    }

    async postData(url, data) {
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
}
