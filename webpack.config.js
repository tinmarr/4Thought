const path = require("path");

module.exports = [
    {
        mode: "production",
        watch: true,
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
