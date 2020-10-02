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

            // find corresponding ngram for current history, create if it does not exist
            const ngramIndex = this.findNGramByHistory(history);
            if (ngramIndex === -1) {
                const ngram = new NGram(history, prediction);
                this.ngrams.push(ngram);
            } else {
                const ngram = this.ngrams[ngramIndex];
                ngram.addPrediction(prediction);
            }
        }

        for (const ngram of this.ngrams) {
            ngram.calculateProbabilities();
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
                // may occur if current history only appeared at the end of the training text
                // or if start history did not appear at all
                return tokens;
            }
            const ngram = this.ngrams[ngramIndex];

            // add random prediction to tokens
            const prediction = ngram.getRandomPrediction();
            tokens.push(prediction);

            // update history -> use last (order - 1) tokens
            currHistory = tokens.slice(tokens.length - (this.order - 1), tokens.length);
        }

        return tokens;
    }

    findNGramByHistory(history) {
        for (let i = 0; i < this.ngrams.length; i++) {
            if (this.ngrams[i].matchesHistory(history)) {
                return i;
            }
        }
        return -1;
    }
}
