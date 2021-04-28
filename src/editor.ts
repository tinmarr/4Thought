import Quill from "quill";
import QuillMarkdown from "quilljs-markdown";
/// <reference path="./documentManager.ts"/>

const quill: Quill = new Quill("#editor", {
    modules: {
        toolbar: "#toolbar",
    },
    placeholder: "start typing...",
    theme: "snow",
});
const markdownShortcuts = new QuillMarkdown(quill, {});

const identifier: string = document.currentScript?.getAttribute("note-id")!;
const data = JSON.parse(document.currentScript?.getAttribute("doc-data")!);

quill.setContents(data.delta);

if (data.name != null && data.name != "untitled note") (document.getElementById("notename") as HTMLInputElement).value = data.name;

const syncBtn = document.getElementById("sync-btn")!;
syncBtn.onclick = function () {
    if (!syncBtn.classList.contains("rotating")) {
        syncBtn.classList.add("rotating");
        setTimeout(() => {
            syncBtn.classList.remove("rotating");
        }, 1000);
    }

    const noteName = (<HTMLInputElement>document.getElementById("notename")).value || "untitled note";
    let data = { id: identifier, name: noteName, delta: quill.getContents() };
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
