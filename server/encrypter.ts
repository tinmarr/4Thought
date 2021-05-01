import crypto from "crypto";
import fs from "fs";

export class Encrypter {
    private algoritm: string = "aes-256-cbc";
    private key: Buffer = fs.readFileSync("./key.key");
    private iv: Buffer = crypto.randomBytes(16);

    encryptText(text: string): { iv: string; encryptedData: string } {
        let cipher = crypto.createCipheriv(this.algoritm, Buffer.from(this.key), this.iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return { iv: this.iv.toString("hex"), encryptedData: encrypted.toString("hex") };
    }

    decrypt(text: { iv: string; encryptedData: string }): string {
        let iv = Buffer.from(text.iv, "hex");
        let encryptedText = Buffer.from(text.encryptedData, "hex");
        let decipher = crypto.createDecipheriv(this.algoritm, Buffer.from(this.key), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }

    getKey(): Buffer {
        return this.key;
    }
}
