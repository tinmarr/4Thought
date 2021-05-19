export class DefWidget extends Widget {
    word: string;
    def: string;

    constructor(word: string, definition: string, icon: string, partOfSpeech: string = "") {
        let text: string = `<h5 class='p-0 m-0 noselect'>${word} ${
            partOfSpeech != "" ? `(${partOfSpeech})` : ""
        }</h5><hr class='mb-2 mt-1'>${definition}`;
        super(text, icon);
        this.word = word;
        this.def = definition;
    }
}
