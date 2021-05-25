import Quill from "quill";
import QuillMarkdown from "quilljs-markdown";
import BlotFormatter, { ResizeAction, DeleteAction, ImageSpec } from "quill-blot-formatter";
import ImageCompress from "quill-image-compress";
import MagicUrl from "quill-magic-url";

Quill.register("modules/blotFormatter", BlotFormatter);
Quill.register("modules/imageCompress", ImageCompress);
Quill.register("modules/magicUrl", MagicUrl);

class CustomImageSpec extends ImageSpec {
    getActions() {
        return [ResizeAction, DeleteAction];
    }
}

const quill: Quill = new Quill("#editor", {
    modules: {
        toolbar: "#toolbar",
        formula: true,
        blotFormatter: {
            specs: [CustomImageSpec],
        },
        imageCompress: {
            quality: 0.5, // default
            maxWidth: 500, // default
            maxHeight: 500, // default
            imageType: "image/jpeg", // default
            debug: false,
        },
        magicUrl: true,
    },
    placeholder: "start typing...",
    theme: "snow",
});
new QuillMarkdown(quill, {});

let lastSavedOn: Date = new Date();

document.addEventListener("keydown", handleKeyPress);
function handleKeyPress(e) {
    if ((e.ctrlKey || e.metaKey) && e.code == "KeyS") {
        e.preventDefault();
        save();
    }
}

enum Format {
    list,
    raw,
    stringWithNoN,
}
function getText(format: Format): string[] | string {
    let thing: HTMLDivElement = <HTMLDivElement>document.getElementsByClassName("ql-editor")[0];
    let text: string = thing.innerText;
    if (format === Format.list) {
        return text.split("\n");
    }
    if (format === Format.stringWithNoN) {
        return text.replace(/(\r\n|\n|\r)/gm, " ");
    }
    return text;
}

declare function mathquill4quill(): any;
let enableMathQuillFormulaAuthoring = mathquill4quill();
enableMathQuillFormulaAuthoring(quill, {
    operators: [
        ["\\frac{x}{y}", "\\frac"],
        ["\\sqrt[n]{x}", "\\nthroot"],
        ["\\int_{a}^{b}", "\\int"],
        ["\\sum^{a}_{b}", "\\sum"],
        ["\\infty", "\\infty"],
    ],
});

const identifier: string = document.currentScript?.getAttribute("note-id")!;
const data = JSON.parse(document.currentScript?.getAttribute("doc-data")!);
console.log(data);

quill.setContents(data.delta);

if (data.name != null && data.name != "untitled note") (document.getElementById("notename") as HTMLInputElement).value = data.name;

if (data.widgets != undefined) for (let widget of data.widgets) Widget.generate(widget);

if (!("txtshortcuts" in Object.keys(data))) {
    data["txtshortcuts"] = new SmallD();
}
export let textshortcuts: SmallD = data["txtshortcuts"];

const dictionaryBtn = document.getElementById("add-texting-shortcuts")!;
let content = document.getElementById("text-shortcuts-popover")?.innerHTML;
let options = {
    container: "body",
    sanitize: false,
    html: true,
    placement: "bottom",
    content: content,
    trigger: "click",
};
let ppover = new window.bootstrap.Popover(dictionaryBtn, options);
dictionaryBtn.onclick = () => {
    ppover.toggle();
};
dictionaryBtn.addEventListener("shown.bs.popover", (e) => {
    const textingsubmitBtn = <HTMLAnchorElement>document.querySelector("div.popover-body > #SubmitNewDefinition")!;
    //console.log(textingsubmitBtn);
    textingsubmitBtn.onclick = function () {
        // // get whats in the in
        let stuffin: string = (<HTMLTextAreaElement>document.querySelector("div.popover-body > #in")).value;
        // // get whats in the out
        let stuffout: string = (<HTMLTextAreaElement>document.querySelector("div.popover-body > #out")).value;
        //console.log(stuffin, " ", stuffout);
        textshortcuts.addPair(stuffin, stuffout);
        //console.log(textshortcuts);
    };
});

const textingToggle = document.getElementById("txtModeToggle")!;
let textingToggleState: boolean = false;
textingToggle.onchange = function () {
    const inpt = document.getElementsByName("input-texting-toggle")[0]! as HTMLInputElement;
    textingToggleState = inpt.checked;
    //console.log(textingToggle);
    //console.log(`toggled to ${textingToggleState.valueOf()}`);
};

let noteName: string = (<HTMLInputElement>document.getElementById("notename")).value;

const infoBtn = document.getElementById("info-btn")!,
    infoTTip = document.getElementById("infottip")!;
let infoToggle = true;
infoBtn.onclick = function () {
    updateSaveTime();

    if (infoToggle) infoTTip.classList.remove("d-none");
    else infoTTip.classList.add("d-none");
    infoToggle = !infoToggle;
};

const syncBtn = document.getElementById("sync-btn")!;
syncBtn.onclick = save;

const closeBtn: HTMLLinkElement = <HTMLLinkElement>document.getElementById("close")!;
closeBtn.onclick = (e) => {
    e.preventDefault();
    save();
    window.location.href = closeBtn.href;
};

function updateSaveTime(): void {
    if (lastSavedOn.toDateString() != new Date().toDateString())
        document.getElementById("save-time")!.innerHTML = "last saved on " + lastSavedOn.toDateString();
    else document.getElementById("save-time")!.innerHTML = "last saved on " + lastSavedOn.toTimeString();
}

function save(): void {
    lastSavedOn = new Date();
    updateSaveTime();

    nameNote();

    if (!syncBtn.children[0].classList.contains("rotating")) {
        syncBtn.children[0].classList.add("rotating");
        setTimeout(() => {
            syncBtn.children[0].classList.remove("rotating");
        }, 1000);
    }

    let widgetList: object[] = Widget.widgets.map((widg: Widget) => {
        return widg.toObj();
    });

    let data = {
        id: identifier,
        name: noteName,
        delta: quill.getContents(),
        widgets: widgetList,
        txtshortcuts: textshortcuts,
    };
    sendNoCB("/save", data);
}

function nameNote(): void {
    if ((<HTMLInputElement>document.getElementById("notename")).value == "") {
        if ((<HTMLElement>document.getElementsByClassName("ql-editor")[0]).innerText != "\n") {
            let list: string[] = (<HTMLElement>document.getElementsByClassName("ql-editor")[0]).innerText.split(" ");
            noteName = list.length > 5 ? list.splice(0, 5).join(" ") : list.join(" ");
        } else {
            noteName = "Untitled Note";
        }
    } else {
        noteName = (<HTMLInputElement>document.getElementById("notename")).value;
    }
}

const downloadButton = document.getElementById("downloadPDF")!;
downloadButton.onclick = () => {
    nameNote();
    let content: string = document.getElementsByClassName("ql-editor")[0]?.innerHTML!;
    let worker = window
        .html2pdf()
        .set({ margin: 15 })
        .from(content)
        .save(noteName + ".pdf");
};

const ttsButton = document.getElementById("speakSelection")!;
ttsButton.onclick = () => {
    if (quill.getSelection() != null && !window.speechSynthesis.speaking) {
        let selection = quill.getText(quill.getSelection()?.index, quill.getSelection()?.length),
            msg = new SpeechSynthesisUtterance();
        msg.text = selection;
        window.speechSynthesis.speak(msg);
    } else {
        window.speechSynthesis.cancel();
    }
};

const wikiLookup = document.getElementById("searchWiki")!;
wikiLookup.onclick = () => {
    if (quill.getSelection() != null) {
        searchWikipedia(quill.getText(quill.getSelection()?.index, quill.getSelection()?.length));
    }
};

const dicLookup = document.getElementById("searchDic")!;
dicLookup.onclick = () => {
    if (quill.getSelection() != null) {
        searchDictionary(quill.getText(quill.getSelection()?.index, quill.getSelection()?.length), "en_US");
    }
};

const newComment = document.getElementById("newComment")!;
newComment.onclick = () => {
    new CommentWidget();
};

const newYoutube = document.getElementById("newYoutube")!;
newYoutube.onclick = () => {
    new YoutubeWidget();
};

const newRecording = document.getElementById("newRecording")!;
newRecording.onclick = () => {
    new RecordWidget();
};

let popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]#add-texting-shortcuts'));
let popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    let content = document.getElementById("text-shortcuts-popover")?.innerHTML;
    let options = {
        container: "body",
        sanitize: false,
        html: true,
        placement: "bottom",
        content: content,
        trigger: "click",
    };
    return new window.bootstrap.Popover(popoverTriggerEl, options);
});

window.onbeforeunload = (e: BeforeUnloadEvent) => {
    save();
};

function searchWikipedia(keyWord: string) {
    let url = "https://en.wikipedia.org/w/api.php";
    let params = {
        action: "query",
        list: "search",
        srsearch: keyWord,
        format: "json",
    };
    url += "?origin=*";
    Object.keys(params).forEach((key) => {
        url += "&" + key + "=" + params[key];
    });
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            new DefWidget({
                word: keyWord,
                definition: `${response.query.search[0].snippet}<a target='_blank' href='https://en.wikipedia.org/wiki/${response.query.search[0].title}'>...</a>`,
            });
        })
        .catch((err) => {
            alert(`That selection is not in Wikipedia!`);
        });
}

function searchDictionary(word: string, language: "en_US" | "fr" | "es") {
    let url = "https://api.dictionaryapi.dev/api/v2/entries";

    fetch(`${url}/${language}/${word}`)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            new DefWidget({
                word: word,
                definition: response[0].meanings[0].definitions[0].definition,
                partOfSpeech: response[0].meanings[0].partOfSpeech,
            });
        })
        .catch((err) => {
            alert(`That word is not in our dictionary!`);
        });
}

function alert(text: string) {
    let element = document.createElement("div");
    element.classList.add("alert", "alert-warning", "alert-dismissible", "fade", "show", "m-0");
    element.setAttribute("role", "alert");
    element.innerHTML = `<strong>Oh Noes!</strong> ${text} <button class="btn-close" data-bs-dismiss="alert" />`;

    document.body.insertBefore(element, document.body.firstChild);
}

declare global {
    interface Window {
        bootstrap: any;
        html2pdf: any;
        streamReference: any;
    }
}
