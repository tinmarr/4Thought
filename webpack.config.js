const path = require("path");

let watch = false;

module.exports = [
    {
        mode: "production",
        watch: watch,
        watchOptions: {
            ignored: ["**/node_modules", "**/**/*.ts"],
        },
        entry: "./dist/src/quill.js",
        output: {
            filename: "quill.bundle.js",
            path: path.join(__dirname, "./dist/src"),
        },
    },
];
