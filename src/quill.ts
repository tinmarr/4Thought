import Quill from "quill";

let quill: Quill = new Quill("#editor", {
    modules: { toolbar: "#toolbar" },
    placeholder: "start typing...",
    theme: "snow",
});

window.onload = () => {
    const syncBtn = document.getElementById("sync-btn")!;
    syncBtn.onclick = function() {
        if (!syncBtn.classList.contains("rotating")) {
            syncBtn.classList.add("rotating");
            setTimeout(() => {
                syncBtn.classList.remove("rotating");
            },1500);
        }

        const noteName = (<HTMLInputElement>document.getElementById("notename")).value;
        send("/data-save", { noteName:noteName }, (res: any) => {
            console.log(res);
        });
    }
}

function send(loc: string, content: object, handler: Function) {
    fetch(loc, {
        method: "POST",
        headers: { "Content-type" : "application/json" },
        body: JSON.stringify(content)
    }).then(res => {
        res.json().then(val => handler(val))
    });
}

declare global {
    interface Window {
        quill: Quill;
    }
}

window.quill = quill;
