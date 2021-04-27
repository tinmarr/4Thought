import express from "express";
import fs from "fs";

import { saveDB, User } from "./dataBaseStuff";

export const router = express.Router();

let rawData = fs.readFileSync("./data.json");
export let data = JSON.parse(rawData.toString());
saveDB(data);

router.get("/", (req, res) => {
    res.render("index", { title: "Home", error_messages: req.flash("error") });
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
            return res.redirect("/home");
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
                maxId: 0,
            };
            return res.redirect("/home");
        }
    }
});

router.get("/logout", (req, res) => {
    if (req.session?.userEmail != null) req.session.userEmail = null;
    return res.redirect("/");
});

router.post("/data-save", (req, res) => {
    let user: string = req.session?.userEmail;
    if (data[user].documents == undefined) {
        data[user].documents = {};
    }
    data[user].documents[req.body.id] = {
        name: req.body.name,
        delta: req.body.delta,
    };
    return res.json("synced");
});

router.get("/home", (req, res) => {
    if (req.session?.userEmail == null) {
        res.redirect("/user?new=false");
    } else {
        return res.render("userHome", { title: "Editor", userData: data[req.session.userEmail], error_messages: req.flash("error") });
    }
});

router.get("/document", (req, res) => {
    let id: string;
    let user: string = req.session?.userEmail;
    let documentData: object = { ops: [] };
    if (req.query.id == null) {
        id = (data[user].maxId++).toString();
    } else {
        id = req.query.id as string;
        documentData = data[user].documents[id];
    }
    if (req.query.del == "true") {
        delete data[user].documents[id];
    } else {
        return res.render("editor", { title: "Editor", error_messages: req.flash("error"), documentData: documentData, identifier: id });
    }
});
