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
        const response = await this.postData(url, data);
        return response["model_id"];
    }

    async generateText(modelID, length, startText) {
        const url = this.baseURL + "/generate-text";
        const data = {
            "model_id": modelID,
            "length": length
        };
        if (startText) {
            // start text is optional
            data["start_text"] = startText;
        }
        const response = await this.postData(url, data);
        return response["text"];
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
            const message = "Request failed: " +  response.statusText;
            alert(message);
            throw new Error(message);
        }
        return response.json();
    }
}
