class Dictionary {
    constructor() {
        this.tokenIDs = {};
        this.tokens = [];
        this.count = 0;
    }

    addToken(token) {
        if (token in this.tokenIDs) {
            return;
        }
        this.tokenIDs[token] = this.count;
        this.tokens[this.count] = token;
        this.count++;
    }

    getIDOfToken(token) {
        return this.tokenIDs[token];
    }

    getTokenByID(id) {
        return this.tokens[id];
    }
}
