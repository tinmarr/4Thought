import Quill from "quill";
const { deltaToMarkdown } = require("quill-delta-to-markdown");
import { MarkdownToQuill } from "md-to-quill-delta";

let quill: Quill = new Quill("#editor", {
    modules: { toolbar: "#toolbar" },
    placeholder: "start typing...",
    theme: "snow",
});

function toMarkdown(): void {
    console.log(quill.getContents());
    console.log(deltaToMarkdown(quill.getContents()));
}

// This is how you can reference variables outside of the bundled script
declare global {
    interface Window {
        toMarkdown: any;
        quill: Quill;
    }
}

window.quill = quill;
window.toMarkdown = toMarkdown;