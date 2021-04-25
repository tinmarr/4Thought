import Quill from "quill";

let quill: Quill = new Quill("#editor", {
    modules: { toolbar: "#toolbar" },
    placeholder: "start typing...",
    theme: "snow",
});

// This is how you can reference variables outside of the bundled script
declare global {
    interface Window {
        quill: Quill;
    }
}

window.quill = quill;
