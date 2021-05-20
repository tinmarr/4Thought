class GeneralD {
    public dictionary: { [key: string]: string[] } = { txting: ["texting"] };
    constructor() {}
    addPair(key: string, val: string) {
        this.dictionary[key] = [val];
    }
    removeKey(key: string) {
        delete this.dictionary[key];
    }
    match(inpt: string) {
        return this.dictionary[inpt];
    }
}
class BigD extends GeneralD {
    constructor() {
        super();
    }
    loadsmallDs(l: SmallD[]) {
        let necessaryVotes = 2;
        interface vote {
            key: string;
            val: string;
        }
        let votes: { [key: string]: number } = {};
        // votes[JSON.stringify({ txting: "texting" })] = 1;

        l.forEach((dict) => {
            // for each of the dictionary objects
            Object.keys(dict.dictionary).forEach((key) => {
                // for each key in our smallD's dictionary
                dict.dictionary[key].forEach((value) => {
                    // for each definition for the keyword
                    let keyval: vote = { key: key, val: value };
                    if (JSON.stringify(keyval) in votes) {
                        votes[JSON.stringify(keyval)] += 1;
                    } else {
                        votes[JSON.stringify(keyval)] = 1;
                    }
                    console.log(JSON.stringify(keyval), " ", votes[JSON.stringify(keyval)]);
                });
            });
        });
        console.log(votes);
        /*
        d = new SmallD();
        d2 = new SmallD();
        d.addPair("pp", "penis");
        d2.addPair("pp", "penis");
        d2.addPair("pp", "peni");
        d.addPair("hi", "hello");
        dmajor = new BigD();
        dmajor.loadSmallDs([d, d2]);
        dmajor
        */
        Object.keys(votes).forEach((element) => {
            console.log(votes[element]);
            if (votes[element] >= necessaryVotes) {
                let keyval: vote = JSON.parse(element);
                this.addPair(keyval.key, keyval.val);
            }
        });
    }
}
class SmallD extends GeneralD {
    constructor() {
        super();
    }
    addPair(key: string, val: string) {
        if (this.dictionary[key]) {
            console.log("warning");
            this.dictionary[key].push(val);
        } else {
            this.dictionary[key] = [val];
        }
    }
}
// unfinished please no touchy.
