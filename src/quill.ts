import Quill from 'quill';
// Add a 'custom-color' option to the the color tool
let tools : any[][]= [
	['bold', 'italic', 'underline', 'strike'],
  [{'color': ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466", 'custom-color']}]
];

let quill : Quill = new Quill("#editor", {
  placeholder: 'Start typing...',
	modules: {
  	toolbar: tools
  },
  theme: 'bubble',
});

// // customize the color tool handler
quill.getModule('toolbar').addHandler('color', (value : string) => {

    // if the user clicked the custom-color option, show a prompt window to get the color
    if (value == 'custom-color') {
        value = prompt('Enter Hex/RGB/RGBA') || "";
    }

    quill.format('color', value);
});
