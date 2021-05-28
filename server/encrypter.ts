import crypto from "crypto";
import * as dotenv from "dotenv";

if (process.env.KEY == undefined) dotenv.config();

export class Encrypter {
    private algoritm: string = "aes-256-cbc";
    private key: string = crypto.createHash("sha256").update(process.env.KEY!).digest("base64").substr(0, 32);

    static genID(length: number): string {
        return crypto.randomBytes(length).toString("hex").substr(0, length);
    }

    encryptText(text: string): { iv: string; encryptedData: string } {
        let iv: string = crypto.createHash("sha256").update(Math.random().toString()).digest("base64").substr(0, 16);
        let cipher = crypto.createCipheriv(this.algoritm, Buffer.from(this.key), Buffer.from(iv));
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return { iv: iv, encryptedData: encrypted.toString("hex") };
    }

    decrypt(text: { iv: string; encryptedData: string }): string {
        let encryptedText = Buffer.from(text.encryptedData, "hex");
        let decipher = crypto.createDecipheriv(this.algoritm, Buffer.from(this.key), Buffer.from(text.iv));
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }

    getKey(): string {
        return this.key;
    }
}
