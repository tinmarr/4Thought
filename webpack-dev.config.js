const path = require("path");

module.exports = [
    {
        mode: "development",
        watch: true,
        entry: {
            editor: "./dist/src/editor.js",
            dragManager: "./dist/src/dragManager.js",
        },
        output: {
            filename: "[name].bundle.js",
            path: path.join(__dirname, "./dist/src"),
            library: "[name]",
            libraryTarget: "var",
        },
        // devtool: "source-map"
    },
];
