class NGramPrediction {
    constructor(token) {
        this.token = token;
        this.frequency = 1;
        this.probability = 0.0;
        this.probabilityThreshold = 0.0;
    }

    matchesToken(token) {
        return this.token === token;
    }

    incrementFrequency() {
        this.frequency++;
    }
}
