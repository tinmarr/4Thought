import Quill from "quill";
const { deltaToMarkdown } = require("quill-delta-to-markdown");
import { MarkdownToQuill } from "md-to-quill-delta";

// Add a 'custom-color' option to the the color tool
let tools: any[][] = [
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }, { header: [1, 2, 3, 4, 5, 6, false] }],
];

let quill: Quill = new Quill("#editor", {
    modules: {
        toolbar: tools,
    },
    placeholder: "Start typing...",
    theme: "bubble",
});

// // customize the color tool handler
quill.getModule("toolbar").addHandler("color", (value: string) => {
    // if the user clicked the custom-color option, show a prompt window to get the color
    if (value == "custom-color") {
        value = prompt("Enter Hex/RGB/RGBA") || "";
    }
    quill.format("color", value);
});

export function toMarkdown(): void {
    console.log(quill.getContents());
    console.log(deltaToMarkdown(quill.getContents()));
}
