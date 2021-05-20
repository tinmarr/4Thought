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
            let div = "<h5 class='p-0 m-0 noselect'>Comment</h5><hr class='mb-2 mt-1'><div contenteditable='plaintext-only' class='my-1 outline-0 border-0' />";
            super({ content: div, icon: config.icon });
        }
        
        let ele = this.element.querySelector("div.widgetContent > div[contenteditable='plaintext-only']")!;

        if (ele.innerHTML == "") (ele.classList.add('editable-div'));

        ele.addEventListener("input", (e) => {
            const value = ele.innerHTML;
            if (value == "" || value == "<br>") ele.classList.add('editable-div');
            else ele.classList.remove('editable-div');
        });
    }
}

class YoutubeWidget extends Widget {
    constructor(config: { url?: string; icon: string } | GeneralConfig) {
        if (isGeneralConfig(config)) {
            super(config);
        } else {
            if (config.url != undefined) {
                let width = 300 - 16,
                    params = new URLSearchParams(config.url.substring(config.url.indexOf("?")));

                let content = `<iframe width="${width}" height="${width * (9 / 16)}" src="https://www.youtube.com/embed/${params.get(
                    "v"
                )}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                super({ content: content, icon: config.icon });
            } else {
                let content = ` <div class="form-group">
                                    <label for="utubeurl">Youtube URL</label>
                                    <input type="text" class="form-control" id="utubeurl" placeholder="https://www.youtube.com/watch?v=...">
                                </div>
                                <button role="button" class="btn btn-primary" id="getUtube">Get</button>`;
                super({ content: content, icon: config.icon });
            }
        }
        if (this.element.querySelector("button#getUtube") != null) {
            console.log("listener made");
            (<HTMLButtonElement>this.element.querySelector("button#getUtube")!).onclick = (e) => {
                console.log("we are in");
                e.preventDefault();
                let url = (<HTMLInputElement>this.element.querySelector("div.form-group > input#utubeurl")!).value;
                new YoutubeWidget({ url: url, icon: config.icon });
                this.delete();
            };
        }
    }
}

function isGeneralConfig(config: object | GeneralConfig): config is GeneralConfig {
    return (config as GeneralConfig).content != undefined;
}
