import express from "express";
import fs from "fs";

import { save, User } from "./dbHandler";

export const router = express.Router();

let rawData = fs.readFileSync("./data.json");
export let data = JSON.parse(rawData.toString());
setInterval(() => { save(data) }, 30 * 1000);

function exitHandler(options: string, exitCode: any) {
    if (options == "exit") save(data);
    else process.exit();
}

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
    process.on(eventType, exitHandler.bind(null, eventType));
});

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
        if (req.body.newUser == "on") {
            req.flash("error", "User already exists");
            return res.redirect(req.url);
        }
        
        if (user.password == password) {
            if (req.session != null) req.session.userEmail = email;
            return res.redirect("/home");
        }
        
        req.flash("error", "Incorrect username or password");
        return res.redirect(req.url);
    } else {
        if (req.body.newUser == "on") {
            name = req.body.name;
            data[email] = {
                name: name,
                password: password,

                documents: {},

            };
            return res.redirect("/home");
        }
    }
});

router.get("/logout", (req, res) => {
    if (req.session?.userEmail != null) req.session.userEmail = null;
    return res.redirect("/");
});

router.post("/save", (req, res) => {
    let user: string = req.session?.userEmail;
    data[user].documents[req.body.id] = {
        name: req.body.name,
        delta: req.body.delta,
        postion: Object.keys(data[user].documents).length,
    };
    return res.json("synced");
});

router.post("/update-order", (req, res) => {
    let user: string = req.session?.userEmail;
    return res.json("Did it! (but not really)");
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
        id = Object.keys(data[user].documents).length.toString();
    } else {
        id = req.query.id as string;
        documentData = data[user].documents[id];
    }
    return res.render("editor", { title: "Editor", error_messages: req.flash("error"), documentData: documentData, identifier: id });
});

router.post("/document", (req, res) => {
    let user: string = req.session?.userEmail;
    delete data[user].documents[req.body.id];
    return res.json("deleted");
});
