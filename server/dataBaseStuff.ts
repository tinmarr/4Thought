import fs from "fs";

export interface User {
    password: string;
    name: string;
}

// Delay is in seconds
export function saveDB(data: object, delay: number = 5, fileName: string = "data.json") {
    setInterval(() => {
        fs.writeFileSync(fileName, JSON.stringify(data));
        saveDB(data, delay, fileName);
    }, delay * 1000);
}

export function send(loc: string, content: object, handler: Function): void {
    fetch(loc, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(content),
    }).then((res) => {
        res.json().then((val) => handler(val));
    });
}
