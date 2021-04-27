/// <reference types="jquery" />

function send(loc: string, content: object, handler: Function): void {
    fetch(loc, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(content),
    }).then((res) => {
        res.json().then((val) => handler(val));
    });
}

let numOfDocs: number;

function deleteDoc(id: string): void {
    send("/document", { id: id }, (res: any) => {
        console.log(res);
        $("#" + id).fadeOut(400, () => {
            document.getElementById(id)?.remove();
        });
        $("#bar" + id).fadeOut(400, () => {
            document.getElementById("bar" + id)?.remove();
            numOfDocs--;
            if (numOfDocs == 0) {
                document.getElementById("noneLeft")?.classList.remove("invisible");
                $("#noneLeft").fadeIn(400);
            }
        });
    });
}

interface Window {
    numOfDocs: number;
}
