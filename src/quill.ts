import Quill from "quill";
/// <reference path="./documentManager.ts"/>

const quill: Quill = new Quill("#editor", {
    modules: { toolbar: "#toolbar" },
    placeholder: "start typing...",
    theme: "snow",
});

const identifier: string = document.currentScript?.getAttribute("note-id")!;
const data = JSON.parse(document.currentScript?.getAttribute("doc-data")!);

quill.setContents(data.delta);

window.onload = () => {
    if (data.name != null && data.name != "untitled note") (<HTMLInputElement>document.getElementById("notename")).value = data.name;

    const syncBtn = document.getElementById("sync-btn")!;
    syncBtn.onclick = function () {
        if (!syncBtn.classList.contains("rotating")) {
            syncBtn.classList.add("rotating");
            setTimeout(() => {
                syncBtn.classList.remove("rotating");
            }, 1500);
        }
        
        const noteName = (<HTMLInputElement>document.getElementById("notename")).value || "untitled note";
        let data = { id: identifier, name: noteName, delta: quill.getContents() };
        send("/save", data, (res: any) => { console.log(res) });
    };
};

declare global {
    interface Window {
        quill: Quill;
    }
}

window.quill = quill;
