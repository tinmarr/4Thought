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

        // todo: sync the note to firebase
        console.log("synced");
    }
}

declare global {
    interface Window {
        quill: Quill;
    }
}

window.quill = quill;
