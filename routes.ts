import express from "express";
import fs from "fs";

import { saveDB, User } from "./server/dataBaseStuff";

export const router = express.Router();

let rawData = fs.readFileSync("./data.json");
export let data = JSON.parse(rawData.toString());
saveDB(data);

router.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

router.get("/editor", (req, res) => {
    res.render("editor", { title: "Editor" });
});

router.get("/user", (req, res) => {
    res.render("authPage", { title: "Login", newUser: false });
});

router.post("/user", (req, res) => {
    let email: string = req.body.email;
    let password: string = req.body.password;
    let name: string | null = null;
    let user: User | null = data[email];
    if (user != null) {
        if (user.password == password) {
            return res.send(`${user.name} is logged in!`);
        } else {
            return res.send("Login Failed");
        }
    } else {
        if (req.body.newUser == "on") {
            name = req.body.name;
            data[email] = {
                name: name,
                password: password,
            };
            return res.send("User Saved");
        }
    }
});

router.post("/data-save", (req, res) => {
    console.log(req.body);
    // todo: actually save stuff
    return res.json("synced");
});
