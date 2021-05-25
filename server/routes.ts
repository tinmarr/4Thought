import express from "express";
import fs from "fs";

import { save } from "./dbHandler";
import { Queue } from "./queue";
import { Encrypter } from "./encrypter";

export const router = express.Router();
export const queue = new Queue();

const crypt = new Encrypter();

// Get Data
let rawData = fs.readFileSync("./data.json");
export let data;
try {
    data = JSON.parse(rawData.toString());
} catch (err) {
    data = {};
}

// Auto Save DB
const saveLoop = setInterval(() => {
    queue.add(() => {
        save(data);
    });
}, 60 * 1000); // DO NOT MAKE THE SAVE INTERVAL MORE FREQUENT THAN A MINUTE

function exitHandler(options: string, exitCode: any) {
    clearInterval(saveLoop);
    if (options == "exit") save(data);
    else process.exit();
}

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
    process.on(eventType, exitHandler.bind(null, eventType));
});

// Routes
// Index
router.get("/", (req, res) => {
    res.render("index", { title: "Home", error_messages: req.flash("error") });
});

// Login Manager
router.get("/user", (req, res) => {
    res.render("auth", { title: "Authentication", newUser: req.query.new == "true", error_messages: req.flash("error") });
});

router.post("/user", (req, res) => {
    queue.add(() => {
        let email: string = req.body.email;
        let password: string = req.body.password;
        let name: string | null = null;
        let user: { password: { iv: string; encryptedData: string } } = data[email];
        if (user != null) {
            if (req.body.newUser == "on") {
                req.flash("error", "User already exists");
                return res.redirect(req.url);
            }

            if (crypt.decrypt(user.password) == password) {
                if (req.session != null) req.session.userEmail = email;
                return res.redirect("/dashboard");
            }

            req.flash("error", "Incorrect username or password");
            return res.redirect(req.url);
        } else {
            if (req.body.newUser == "on") {
                name = req.body.name;
                data[email] = {
                    name: name,
                    password: crypt.encryptText(password),
                    documents: {},
                    order: []
                };
                return res.redirect("/dashboard");
            }
            req.flash("error", "Incorrect username or password");
            return res.redirect(req.url);
        }
    });
});

// Logout Manager
router.get("/logout", (req, res) => {
    if (req.session?.userEmail != null) req.session.userEmail = null;
    return res.redirect("/");
});

// Document Saver
router.post("/save", (req, res) => {
    queue.add(() => {
        let user: string = req.session?.userEmail;
        if (data[user].documents[req.body.id] == undefined) data[user].order.push(req.body.id);
        data[user].documents[req.body.id] = {
            name: req.body.name,
            delta: req.body.delta,
            widgets: req.body.widgets
        };
        return res.json("synced");
    });
});

// Update order of documents in dashboard
router.post("/update-order", (req, res) => {
    queue.add(() => {
        let user: string = req.session?.userEmail;
        data[user].order.splice(req.body.to!, 0, data[user].order.splice(req.body.from!, 1)[0]);
        return res.json("updated order");
    });
});

// User Dashboard
router.get("/dashboard", (req, res) => {
    if (req.session?.userEmail == null) {
        res.redirect("/user?new=false");
    } else {
        if (data[req.session.userEmail] == null) {
            return res.redirect("/logout");
        } else {
            return res.render("dashboard", {
                title: "Dashboard",
                userData: data[req.session.userEmail],
                error_messages: req.flash("error"),
            });
        }
    }
});

// Actual Editor
router.get("/document", (req, res) => {
    let id: string;
    let user: string = req.session?.userEmail;
    let documentData: object = { ops: [] };
    if (req.query.id == null) {
        id = Encrypter.genID(20);
    } else {
        id = req.query.id as string;
        documentData = data[user].documents[id];
    }
    return res.render("editor", { title: "Editor", error_messages: req.flash("error"), documentData: documentData, identifier: id });
});

router.post("/delete-doc", (req, res) => {
    queue.add(() => {
        let user: string = req.session?.userEmail;
        delete data[user].documents[req.body.id];
        data[user].order.splice(data[user].order.indexOf('' + req.body.id), 1);
        return res.json("deleted");
    });
});

// Settings Page
router.get("/settings", (req, res) => {
    return res.render("settings", { title: "Settings", userData: data[req.session?.userEmail], error_messages: req.flash("error") });
});
