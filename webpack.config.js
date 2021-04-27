const path = require("path");

let watch = true;

module.exports = [
    {
        mode: "production",
        watch: watch,
        devtool: "inline-source-map",
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"],
        },

        watchOptions: {
            ignored: ["**/node_modules", "**/**/*.ts"],
        },
        entry: "./src/quill.ts",
        output: {
            filename: "quill.bundle.js",
            path: path.join(__dirname, "./dist/src"),
        },
    },
];
