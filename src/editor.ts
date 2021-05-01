import Quill from "quill";
import QuillMarkdown from "quilljs-markdown";
/// <reference path="./documentManager.ts"/>

const quill: Quill = new Quill("#editor", {
    modules: {
        toolbar: "#toolbar",
        formula: true,
    },
    placeholder: "start typing...",
    theme: "snow",
});
const markdownShortcuts = new QuillMarkdown(quill, {});

declare function mathquill4quill(): any;
var enableMathQuillFormulaAuthoring = mathquill4quill();
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

quill.setContents(data.delta);

if (data.name != null && data.name != "untitled note") (document.getElementById("notename") as HTMLInputElement).value = data.name;

// const textingBtn = document.getElementById("add-texting-shortcuts")!;
// let textshortcuts: object = {};
// textingBtn.onclick = function () {
//     // pull up a place to add shortcuts
//     // var range = quill.getSelection();
//     // if (range) {
//     //     quill.insertText(range.index, "┼");
//     // }
//     console.log("yet to be implemented. Should create popup where you can add shortcuts");
//     const shortucts = "nothing"; // added texting shortcuts || {}
// };
// const textingToggle = document.getElementById("texting-toggle")!;
// let textingToggleState: boolean = false;
// textingToggle.onchange = function () {
//     const inpt = document.getElementsByName("input-texting-toggle")[0]! as HTMLInputElement;
//     textingToggleState = inpt.checked;
//     console.log(`toggled to ${textingToggleState.valueOf()}`);
// };

let noteName: string;
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

const syncBtn = document.getElementById("sync-btn")!;
syncBtn.onclick = save;

const closeBtn: HTMLLinkElement = <HTMLLinkElement>document.getElementById("close")!;
closeBtn.onclick = (e) => {
    e.preventDefault();
    save();
    window.location.href = closeBtn.href;
};

function save(): void {
    if (!syncBtn.children[0].classList.contains("rotating")) {
        syncBtn.children[0].classList.add("rotating");
        setTimeout(() => {
            syncBtn.children[0].classList.remove("rotating");
        }, 1000);
    }

    let data = {
        id: identifier,
        name: noteName,
        delta: quill.getContents(),
        // txtshortcuts: textshortcuts,
    };
    send("/save", data, (res: any) => {
        console.log(res);
    });
}

const downloadButton = document.getElementById("downloadPDF")!;
downloadButton.onclick = () => {
    let content: string = document.getElementsByClassName("ql-editor")[0]?.innerHTML!;
    let worker = window
        .html2pdf()
        .set({ margin: 15 })
        .from(content)
        .save(noteName + ".pdf");
};

declare global {
    interface Window {
        quill: Quill;
        bootstrap: any;
        html2pdf: any;
    }
}

window.quill = quill;

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
