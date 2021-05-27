const path = require("path");

module.exports = [
    {
        mode: "production",
        watch: false,
        entry: {
            editor: "./dist/src/editor.js",
            dragManager: "./dist/src/dragManager.js",
        },
        output: {
            filename: "[name].bundle.js",
            path: path.join(__dirname, "./dist/src"),
            library: ["window", "[name]"],
            libraryTarget: "var",
        },
        // devtool: "source-map"
    },
];
