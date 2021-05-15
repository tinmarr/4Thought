class GeneralD {
    public dictionary: { [key: string]: string } = { key: "txting", val: "texting" };
    constructor() {}
    addPair(key: string, val: string) {
        this.dictionary[key] = val;
    }
    removeKey(key: string) {
        delete this.dictionary[key];
    }
}
class BigD extends GeneralD {
    constructor() {
        super();
    }
    loadsmallDs(l: smallD[]) {
        let necessaryVotes = 1;
        interface vote {
            key: string;
            val: string;
        }
        let votes: { [key: string]: number } = {};
        votes[JSON.stringify({ txting: "texting" })] = 1;

        l.forEach((dict) => {
            Object.keys(dict.dictionary).forEach((key) => {
                let keyval: vote = { key: key, val: dict.dictionary[key] };
                votes[JSON.stringify(keyval)] = 0 || votes[JSON.stringify(keyval)] + 1;
            });
        });
        Object.keys(votes).forEach((element) => {
            let keyval: vote = JSON.parse(element);
            if (votes[keyval.key] > necessaryVotes) {
                this.addPair(keyval.key, keyval.val);
            }
        });
    }
}
class smallD extends GeneralD {}
// unfinished please no touchy.
