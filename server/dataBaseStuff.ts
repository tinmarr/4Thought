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
