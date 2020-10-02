class NGram {
    constructor(history, prediction) {
        this.history = history;
        this.predictions = [];
        this.predictions.push(new NGramPrediction(prediction));
    }

    addPrediction(token) {
        const predictionIndex = this.findPredictionByToken(token);
        if (predictionIndex === -1) {
            const prediction = new NGramPrediction(token);
            this.predictions.push(prediction);
        } else {
            const prediction = this.predictions[predictionIndex];
            prediction.incrementFrequency();
        }
    }

    getRandomPrediction() {
        const random = Math.random();
        for (const prediction of this.predictions) {
            if (random < prediction.probabilityThreshold) {
                return prediction.token;
            }
        }
    }

    matchesHistory(history) {
        if (this.history.length !== history.length) {
            return false;
        }
        for (let i = 0; i < this.history.length; i++) {
            if (this.history[i] !== history[i]) {
                return false;
            }
        }
        return true;
    }

    findPredictionByToken(token) {
        for (let i = 0; i < this.predictions.length; i++) {
            if (this.predictions[i].matchesToken(token)) {
                return i;
            }
        }
        return -1;
    }

    calculateProbabilities() {
        let totalPredictionCount = 0;
        for (const prediction of this.predictions) {
            totalPredictionCount += prediction.frequency;
        }

        let probabilityThreshold = 0.0;
        for (const prediction of this.predictions) {
            const probability = prediction.frequency / totalPredictionCount;
            probabilityThreshold += probability;
            prediction.probability = probability;
            prediction.probabilityThreshold = probabilityThreshold;
        }
    }
}
