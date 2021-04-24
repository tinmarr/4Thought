const path = require('path');
const mode = 'production'; // development or production
const watch = true; // boolean

module.exports = [
    {
        mode: mode,
        watch: watch,
        watchOptions: {
            ignored: ['**/node_modules', '**/**/*.ts'],
        },
        entry: './dist/quill.js',
        output: {
            filename: 'quill.bundle.js',
            path: path.join(__dirname, './dist'),
        },
    },
];
