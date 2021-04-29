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

const textingBtn = document.getElementById("add-texting-shortcuts")!;
let textshortcuts: object = {};
textingBtn.onclick = function () {
    // pull up a place to add shortcuts
    // var range = quill.getSelection();
    // if (range) {
    //     quill.insertText(range.index, "┼");
    // }
    console.log("yet to be implemented. Should create popup where you can add shortcuts");
    const shortucts = "nothing"; // added texting shortcuts || {}
};
const textingToggle = document.getElementById("texting-toggle")!;
let textingToggleState: boolean = false;
textingToggle.onchange = function () {
    const inpt = document.getElementsByName("input-texting-toggle")[0]! as HTMLInputElement;
    textingToggleState = inpt.checked;
    console.log(`toggled to ${textingToggleState.valueOf()}`);
};

const syncBtn = document.getElementById("sync-btn")!;
syncBtn.onclick = function () {
    if (!syncBtn.classList.contains("rotating")) {
        syncBtn.classList.add("rotating");
        setTimeout(() => {
            syncBtn.classList.remove("rotating");
        }, 1000);
    }

    const noteName = (<HTMLInputElement>document.getElementById("notename")).value || "untitled note";
    let data = {
        id: identifier,
        name: noteName,
        delta: quill.getContents(),
        txtshortcuts: textshortcuts,
    };
    send("/save", data, (res: any) => {
        console.log(res);
    });
};

declare global {
    interface Window {
        quill: Quill;
    }
}

window.quill = quill;
