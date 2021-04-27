const path = require("path");

let watch = true;

module.exports = [
    {
        mode: "production",
        watch: watch,
        devtool: "inline-source-map",
        entry: "./dist/src/quill.js",
        output: {
            filename: "quill.bundle.js",
            path: path.join(__dirname, "./dist/src"),
        },
    },
];
