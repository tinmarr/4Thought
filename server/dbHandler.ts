import fs from "fs";

export function save(data: object, fileName: string = "data.json") {
    fs.writeFileSync(fileName, JSON.stringify(data));
    const d = new Date();
    console.log(`save on ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.`);
}