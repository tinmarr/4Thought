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
        entry: "./dist/src/editor.js",
        output: {
            filename: "editor.bundle.js",
            path: pth,
        },
        optimization: optimization,
    },
    {
        mode: mode,
        watch: watch,
        entry: "./dist/src/dragManager.js",
        output: {
            filename: "dragManager.bundle.js",
            path: pth,
        },
        optimization: optimization,
    },
];
