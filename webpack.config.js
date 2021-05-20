const path = require("path");

let mode = "production",
    watch = true,
    pth = path.join(__dirname, "./dist/src"),
    optimization = {
        minimize: false,
        moduleIds: "named",
        mangleExports: false,
    };

module.exports = [
    {
        mode: mode,
        watch: watch,
        entry: { editor: "./dist/src/editor.js", dragManager: "./dist/src/dragManager.js" },
        output: {
            filename: "[name].bundle.js",
            path: pth,
            library: ["window", "[name]"],
            libraryTarget: "var",
        },
        optimization: optimization,
    },
];
