import Quill from "quill";
// import { send } from "../server/dataBaseStuff";

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
        const noteName = (<HTMLInputElement>document.getElementById("notename")).value || "New Note";
        let data = { id: identifier, name: noteName, delta: quill.getContents() };
        send("/data-save", data, (res: any) => {
            console.log(res);
        });
    };
};

function send(loc: string, content: object, handler: Function): void {
    fetch(loc, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(content),
    }).then((res) => {
        res.json().then((val) => handler(val));
    });
}

declare global {
    interface Window {
        quill: Quill;
    }
}

window.quill = quill;
