
export function dothething(){
    let editor: HTMLDivElement = <HTMLDivElement>document.getElementsByClassName("ql-editor")[0];
    function compareOrRecall(children: HTMLCollection){
        for (let i = 0; i < children.length; i++){
            try{
                if(!children[i].innerText){
                    continue;
                }
                let words: string[] = children[i].innerText.split(" ");
                for (let i = 0; i < words.length; i++) {
                    let element = words[i];
                    if (textshortcuts.match(element) !== null) {
                        console.log(element, textshortcuts.match(element)[0]);
                        words[i] = textshortcuts.match(element)[0];
                    }
                }
                let line = words.join(" ");
            } catch (error){
                console.error(error);
            }
            if (children[i].children){
                compareOrRecall(children[i].children);
            }
             
        }
    }
    let children = editor.children;
    compareOrRecall(children);
}

// recursively call the children of the editor until  all we have is the text, then each individual text check on the dictionary