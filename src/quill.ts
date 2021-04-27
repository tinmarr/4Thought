import Quill from "quill";
/// <reference path="./documentManager.ts"/>

let identifier: string;

const quill: Quill = new Quill("#editor", {
    modules: { toolbar: "#toolbar" },
    placeholder: "start typing...",
    theme: "snow",
});

window.onload = () => {
    identifier = document.getElementById("identifier")!.innerText;

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
