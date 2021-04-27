const path = require("path");

let mode = "production",
    watch = true,
    pth = path.join(__dirname, "./dist/src");

module.exports = [
    {
        mode: mode,
        watch: watch,
        entry: "./dist/src/quill.js",
        output: {
            filename: "quill.bundle.js",
            path: pth,
        },
    },
];
