import Quill from "quill";
import QuillMarkdown from "quilljs-markdown";
import BlotFormatter, { ResizeAction, DeleteAction, ImageSpec } from "quill-blot-formatter";
import ImageCompress from "quill-image-compress";
import MagicUrl from "quill-magic-url";

/*** Quill Imports ***/
Quill.register("modules/blotFormatter", BlotFormatter);
Quill.register("modules/imageCompress", ImageCompress);
Quill.register("modules/magicUrl", MagicUrl);

// Image handler
class CustomImageSpec extends ImageSpec {
    getActions() {
        return [ResizeAction, DeleteAction];
    }
}

export const quill: Quill = new Quill("#editor", {
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
new QuillMarkdown(quill, {}); // Live Markdown Support

// Function Input Support for Quill
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

// Get saved data
const identifier: string = document.currentScript?.getAttribute("note-id")!;
export const data = JSON.parse(document.currentScript?.getAttribute("doc-data")!);

quill.setContents(data.delta);

// Initial Processing of Saved Data
if (data.name != null && data.name != "untitled note") (document.getElementById("notename") as HTMLInputElement).value = data.name;

if (data.widgets != undefined) for (let widget of data.widgets) Widget.generate(widget);

// JSON.stringify forgets that textshortcuts is a SmallD and just gives all variables (how to fix)?
export let textshortcuts: SmallD = new SmallD();
if ("textshortcuts" in data) {
    textshortcuts.dictionary = data["textshortcuts"].dictionary;
}

/*** Save Handler ***/
let lastSavedOn: Date = new Date();

document.addEventListener("keydown", handleKeyPress);
window.onbeforeunload = save;

function handleKeyPress(e) {
    if ((e.ctrlKey || e.metaKey) && e.code == "KeyS") {
        e.preventDefault();
        save();
    }
}

function updateSaveTime(): void {
    if (lastSavedOn.toDateString() != new Date().toDateString())
        document.getElementById("save-time")!.innerHTML = "last saved on " + lastSavedOn.toDateString();
    else document.getElementById("save-time")!.innerHTML = "last saved on " + lastSavedOn.toTimeString();
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

function save(): void {
    // Update before save
    lastSavedOn = new Date();
    updateSaveTime();

    nameNote();

    // Start the icon animation
    if (!syncBtn.children[0].classList.contains("rotating")) {
        syncBtn.children[0].classList.add("rotating");
        setTimeout(() => {
            syncBtn.children[0].classList.remove("rotating");
        }, 1000);
    }

    // Generate List of Widgets
    let widgetList: object[] = Widget.widgets.map((widg: Widget) => {
        return widg.toObj();
    });

    // Generate Object and Send to Backend
    let data = {
        id: identifier,
        name: noteName,
        delta: quill.getContents(),
        widgets: widgetList,
        txtshortcuts: textshortcuts,
    };
    sendNoCB("/save", data);
}

export function parseAndMatchDictionary() {
    let index = quill.getSelection()?.index;
    let editorcontents = quill.getContents();
    for (let i = 0; i < editorcontents.ops.length; i++) {
        let element = editorcontents.ops[i];
        // element is a so called child of the editor
        // we check if it has an insert and it is a string
        if (element.insert && typeof element.insert == typeof " ") {
            let words: string[] = (element.insert as string).split(" ");
            // split the string into words and process
            for (let i = 0; i < words.length; i++) {
                let wordsmightcontainbackslash = words[i].split("\n");
                // split along the \ns and process
                for (let j = 0; j < wordsmightcontainbackslash.length; j++) {
                    let word = wordsmightcontainbackslash[j];
                    // if the dictionary contains said word than we shall input it to list
                    if (textshortcuts.match(word) != null) {
                        if (index)
                            index! -= word.length;
                        wordsmightcontainbackslash[j] = textshortcuts.match(word)![0];
                        if (index)
                            index! += wordsmightcontainbackslash[j].length;
                    }
                }
                words[i] = wordsmightcontainbackslash.join("\n");
            }
            let line = words.join(" ");
            // our insert is refilled with the corrected words from dictionary
            element.insert = line;
        }
    }
    quill.setContents(editorcontents);
    quill.setSelection(index || 0, 0);
}

/*** Button Handlers ***/
// Texting Shortcuts Button
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
let textingToggleState: boolean = false;

dictionaryBtn.addEventListener("shown.bs.popover", (e) => {
    const textingsubmitBtn = <HTMLAnchorElement>document.querySelector("div.popover-body > #SubmitNewDefinition")!;
    textingsubmitBtn.onclick = function () {
        // // get whats in the in
        let stuffin: string = (<HTMLTextAreaElement>document.querySelector("div.popover-body > #in")).value;
        // // get whats in the out
        let stuffout: string = (<HTMLTextAreaElement>document.querySelector("div.popover-body > #out")).value;
        textshortcuts.addPair(stuffin, stuffout);
    };
    const textingToggle = <HTMLAnchorElement>document.querySelector("div.popover-body > #txtModeToggle")!;
    textingToggle.onclick = function () {
        textingToggleState = !textingToggleState;
        if (textingToggleState) parseAndMatchDictionary();
    };
});


document.addEventListener("keyup", function (event) {
    let eventsForCheck: string[] = ["Enter", "Space", "Period", "Slash"];
    eventsForCheck.forEach((eventType) => {
        if (event.code == eventType) {
            if(quill.getSelection())
                parseAndMatchDictionary();
        }
        
    });
});

export enum Format {
    list,
    raw,
    stringWithNoN,
}

function getText(format: Format): string[] | string {
    let thing: HTMLDivElement = <HTMLDivElement>document.getElementsByClassName("ql-editor")[0];
    let text: string = thing.innerText;
    // let text: string = quill.getContents().ops[0].insert;
    // quill.setText
    if (format === Format.list) {
        return text.split("\n");
    }
    if (format === Format.stringWithNoN) {
        return text.replace(/(\r\n|\n|\r)/gm, " ");
    }
    return text;
}

let noteName: string = (<HTMLInputElement>document.getElementById("notename")).value;

// Info tooltip
const infoBtn = document.getElementById("info-btn")!,
    infoTTip = document.getElementById("infottip")!;
let infoToggle = true;
infoBtn.onclick = function () {
    updateSaveTime();

    if (infoToggle) infoTTip.classList.remove("d-none");
    else infoTTip.classList.add("d-none");
    infoToggle = !infoToggle;
};

// Save the document
const syncBtn = document.getElementById("sync-btn")!;
syncBtn.onclick = save;

// Close the document
const closeBtn: HTMLLinkElement = <HTMLLinkElement>document.getElementById("close")!;
closeBtn.onclick = (e) => {
    e.preventDefault();
    save();
    window.location.href = closeBtn.href;
};

// Download the document
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

// Text to Speech
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

// Wikipedia Search
document.getElementById("searchWiki")!.onclick = () => {
    if (quill.getSelection() != null) {
        searchWikipedia(quill.getText(quill.getSelection()?.index, quill.getSelection()?.length));
    }
};

// Dictionary Search
document.getElementById("searchDic")!.onclick = () => {
    if (quill.getSelection() != null) {
        searchDictionary(quill.getText(quill.getSelection()?.index, quill.getSelection()?.length), "en_US");
    }
};

// Add Comment Widget
document.getElementById("newComment")!.onclick = () => {
    new CommentWidget();
};

// Add Youtube Widget
document.getElementById("newYoutube")!.onclick = () => {
    new YoutubeWidget();
};

// Add Recording Widget
document.getElementById("newRecording")!.onclick = () => {
    new RecordWidget();
};

/*** API Calls ***/
// Wikipedia Search Manager
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

// Dictionary Search Manager
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

// Nicer Alert
function alert(text: string) {
    let element = document.createElement("div");
    element.classList.add("alert", "alert-warning", "alert-dismissible", "fade", "show", "m-0");
    element.setAttribute("role", "alert");
    element.innerHTML = `<strong>Oh Noes!</strong> ${text} <button class="btn-close" data-bs-dismiss="alert" />`;

    document.body.insertBefore(element, document.body.firstChild);
}
window.alert = alert;

declare global {
    interface Window {
        bootstrap: any;
        html2pdf: any;
        streamReference: any;
    }
}
