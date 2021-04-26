import express from "express";
import fs from "fs";

import { saveDB, User } from "./server/dataBaseStuff";

export const router = express.Router();

let rawData = fs.readFileSync("./data.json");
export let data = JSON.parse(rawData.toString());
saveDB(data);

router.get("/", (req, res) => {
    res.render("index", { title: "Home", error_messages: req.flash("error") });
});

router.get("/editor", (req, res) => {
    if (req.session?.userEmail == null) {
        res.redirect("/user?new=false");
    } else {
        res.render("editor", { title: "Editor", name: data[req.session.userEmail].name, error_messages: req.flash("error"), identifier: 12345 });
    }
});

router.get("/user", (req, res) => {
    res.render("authPage", { title: "Login", newUser: req.query.new == "true", error_messages: req.flash("error") });
});

router.post("/user", (req, res, next) => {
    let email: string = req.body.email;
    let password: string = req.body.password;
    let name: string | null = null;
    let user: User | null = data[email];
    if (user != null) {
        if (user.password == password) {
            if (req.session != null) req.session.userEmail = email;
            return res.redirect("/editor");
        } else {
            req.flash("error", "Incorrect username or password");
            return res.redirect(req.url);
        }
    } else {
        if (req.body.newUser == "on") {
            name = req.body.name;
            data[email] = {
                name: name,
                password: password,
            };
            return res.redirect("/editor");
        }
    }
});

router.get("/logout", (req, res) => {
    if (req.session?.userEmail != null) req.session.userEmail = null;
    return res.redirect("/");
});

router.post("/data-save", (req, res) => {
    console.log(req.body);
    // todo: actually save stuff
    return res.json("synced");
});
