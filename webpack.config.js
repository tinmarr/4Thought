const path = require("path");

module.exports = [
    {
        mode: "production",
        watch: true,
        watchOptions: {
            ignored: ["**/node_modules", "**/**/*.ts"],
        },
        entry: "./dist/quill.js",
        output: {
            filename: "quill.bundle.js",
            path: path.join(__dirname, "./dist"),
        },
    },
];
