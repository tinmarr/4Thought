class GeneralD {
    private dictionary: { key: string; val: string }[] = [
        // here we can store the general dict
        { key: "txting", val: "texting" },
    ];
    constructor() {}
    addPair(key: string, val: string) {
        this.dictionary.push({ key, val });
    }
    removeKey(key: string) {
        this.dictionary.forEach((keyval) => {
            if (keyval.key == key) {
                this.dictionary = this.dictionary.filter(function (ele) {
                    return ele != keyval;
                });
                return;
            }
        });
    }
}
class BigD extends GeneralD {
    constructor() {
        super();
    }
    loadsmallDs(l: smallD[]) {
        l.forEach((dict) => {});
    }
}
class smallD extends GeneralD {}
