import Quill from "quill";
const { deltaToMarkdown } = require("quill-delta-to-markdown");
import { MarkdownToQuill } from "md-to-quill-delta";

let tools: any[][] = [
    [{ header: [] }, { align: [] }],
    ["bold", "italic", "underline", "strike", "link"],
    [{ color: [] }, { background: [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ["image"],
    ['blockquote', 'code-block'],
];

let quill: Quill = new Quill("#editor", {
    modules: { toolbar: { container: tools } },
    placeholder: "start typing...",
    theme: "snow",
});

// customize the color tool handler
quill.getModule("toolbar").addHandler("color", (value: string) => {
    // if the user clicked the custom-color option, show a prompt window to get the color
    if (value == "custom-color") {
        value = prompt("Enter Hex/RGB/RGBA") || "";
    }
    quill.format("color", value);
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
