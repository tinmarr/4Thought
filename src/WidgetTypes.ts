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

export class YoutubeWidget extends Widget {
    url: string;

    constructor(term: string, icon: string) {
        super("", icon); // TODO actually use youtube api
        this.url = term;
    }
}

export class CommentWidget extends Widget {
    constructor(icon: string) {
        let div = "<h5 class='p-0 m-0 noselect'>Note</h5> <div contenteditable='true' class='m-1 border border-0'></div>";
        super(div, icon);

        document.addEventListener("savingDocument", (e) => {
            console.log("event recieved");
            super.content = super.element.querySelector("div.widgetContent")?.innerHTML!;
        });
    }
}
