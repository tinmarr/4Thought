import fs from "fs";
const d = new Date();

export interface User {
    password: string;
    name: string;
}

export function save(data: object, fileName: string = "data.json") {
    fs.writeFileSync(fileName, JSON.stringify(data));
    console.log(`save on ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.`);
}