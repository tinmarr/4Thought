interface GeneralConfig {
    content: string;
    icon: string;
}

class DefWidget extends Widget {
    constructor(config: { word: string; definition: string; icon: string; partOfSpeech?: string } | GeneralConfig) {
        if (isGeneralConfig(config)) {
            super(config);
        } else {
            let text: string = `<h5 class='p-0 m-0 noselect'>${config.word} ${
                config.partOfSpeech != undefined ? `(${config.partOfSpeech})` : ""
            }</h5><hr class='mb-2 mt-1'>${config.definition}`;
            super({ content: text, icon: config.icon });
        }
    }
}

class CommentWidget extends Widget {
    constructor(config: { icon: string } | GeneralConfig) {
        if (isGeneralConfig(config)) {
            super(config);
        } else {
            let div = "<h5 class='p-0 m-0 noselect'>Note</h5> <div contenteditable='true' class='my-1'></div>";
            super({ content: div, icon: config.icon });
        }
        let ele = this.element.querySelector("div.widgetContent > div[contenteditable='true']")!;

        ele.innerHTML === "" && (ele.innerHTML = "Write here...");

        ele.addEventListener("focus", (e) => {
            const value = ele.innerHTML;
            value === "Write here..." && (ele.innerHTML = "");
        });

        ele.addEventListener("blur", (e) => {
            const value = ele.innerHTML;
            value === "" && (ele.innerHTML = "Write here...");
        });
    }
}

function isGeneralConfig(config: object | GeneralConfig): config is GeneralConfig {
    return (config as GeneralConfig).content != undefined;
}
