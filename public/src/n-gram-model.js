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

            // find corresponding ngram for current history to add the prediction
            // create new one if it does not exist
            const ngram = this.findNGramByHistory(history);
            if (ngram === undefined) {
                this.ngrams.push(new NGram(history, prediction));
            } else {
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
            const ngram = this.findNGramByHistory(currHistory);
            if (ngram === undefined) {
                // ngram with current history not found
                // may occur if current history only appeared at the end of the training text
                // or if it did not appear at all
                return tokens;
            }

            // add random prediction to tokens
            const prediction = ngram.getRandomPrediction();
            tokens.push(prediction);

            // update history -> use last (order - 1) tokens
            currHistory = tokens.slice(tokens.length - (this.order - 1), tokens.length);
        }

        return tokens;
    }

    findNGramByHistory(history) {
        for (const ngram of this.ngrams) {
            if (ngram.matchesHistory(history)) {
                return ngram;
            }
        }
        return undefined;
    }
}
