class NGramModel {
    constructor(order) {
        this.order = order;
        this.ngrams = [];
    }

    buildModelFromTokens(tokens) {
        this.ngrams = [];

        for (let i = 0; i < tokens.length - (this.order - 1); i++) {
            // get current ngram and split into history and prediction
            const history = [];
            for (let j = 0; j < this.order - 1; j++) {
                history.push(tokens[i + j]);
            }
            const prediction = tokens[i + this.order - 1];

            // find corresponding ngram for current history
            const ngramIndex = this.findNGramByHistory(history);
            if (ngramIndex === -1) {
                // if ngram does not exist, create new ngram
                const ngram = {
                    history: history,
                    predictions: [prediction]
                };
                this.ngrams.push(ngram);
            } else {
                // if ngram already exists, add prediction
                this.ngrams[ngramIndex].predictions.push(prediction);
            }
        }
    }

    generateTokens(startHistory, length) {
        const tokens = startHistory.slice(0); // copy

        let currHistory = startHistory;

        while (tokens.length < length) {
            // find ngram starting with the current history
            const ngramIndex = this.findNGramByHistory(currHistory);
            if (ngramIndex === -1) {
                // ngram with current history not found
                // may occur if current history appeared at the end of the training text
                // or if start history did not appear at all
                return tokens;
            }
            const ngram = this.ngrams[ngramIndex];

            // pick random prediction and add it to the tokens
            const predictions = ngram.predictions;
            const predictionIndex = Math.floor(Math.random() * predictions.length);
            const prediction = predictions[predictionIndex];
            tokens.push(prediction);

            // update history -> use last (order - 1) tokens
            currHistory = tokens.slice(tokens.length - (this.order - 1), tokens.length);
        }

        return tokens;
    }

    findNGramByHistory(history) {
        for (let j = 0; j < this.ngrams.length; j++) {
            if (this.arraysEqual(this.ngrams[j].history, history)) {
                return j;
            }
        }
        return -1;
    }

    arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    }
}
