import express, { json, response } from "express";
import fs from "fs";
import { Client } from "pg";

import { Queue } from "./queue";
import { Encrypter } from "./encrypter";

export const router = express.Router();
export const queue = new Queue();

let data = {};
let time = 0;

// Local/Offline Mode
export let localMode: boolean = false; // MUST BE SET TO TRUE BEFORE EVERY COMMIT

const crypt = new Encrypter();

let client: Client;
if (!localMode) {
    client = new Client({
        connectionString:
            process.env.DATABASE_URL ||
            "postgres://kjethxogdlxabu:eeb579ff1fe220ede3a281f087957edf64cd80c306c4ffd485f8a28bc42e0a00@ec2-34-193-113-223.compute-1.amazonaws.com:5432/dcv25gr2rc6e7f",
        host: process.env.PGHOST,
        user: "postgres",
        ssl: {
            rejectUnauthorized: false,
        },
    });

    client.connect((err) => {
        err != null && console.log(err);
    });

    // Get Data
    const d = new Date();
    client
        .query("SELECT * FROM main")
        .then((res) => {
            data = JSON.parse(res.rows[0].data) || {};
            console.log(`successfully get data on ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.`);
            time = parseInt(res.rows[0].time);
        })
        .catch((err) => {
            client
                .query("CREATE TABLE main ( data varchar, time varchar )")
                .then((res) => {
                    client
                        .query(`INSERT INTO main(data, time) VALUES ('{}', ${d.getTime()})`)
                        .then((res) => {
                            console.log(res);
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    client.end();
                });
        });
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

if (localMode) {
    data = JSON.parse(fs.readFileSync("./data.json").toString());
}

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
                req.session!.userEmail = email;
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
                    order: [],
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
            widgets: req.body.widgets,
            textshortcuts: req.body.txtshortcuts,
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
        data[user].order.splice(data[user].order.indexOf("" + req.body.id), 1);
        return res.json("deleted");
    });
});

// Settings Page
router.get("/settings", (req, res) => {
    return res.render("settings", {
        title: "Settings",
        userData: data[req.session?.userEmail],
        userEmail: req.session?.userEmail,
        error_messages: req.flash("error"),
        success_messages: req.flash("success"),
    });
});

router.post("/settings", (req, res) => {
    let user: string = req.session?.userEmail;
    if (req.body.type == "username&email") {
        data[user].name = req.body.name;
        if (req.body.email != user) {
            req.session!.userEmail = req.body.email;
            data[req.body.email] = data[user];
            delete data[user];
            user = req.session?.userEmail;
        }
    } else if (req.body.type == "pw") {
        data[user].password = crypt.encryptText(req.body.password);
    } else if (req.body.type == "delete") {
        delete data[user];
        req.session!.userEmail = null;
        return res.redirect("/");
    }
    req.flash("success", "Successfully updated!");
    return res.redirect(req.url);
});

// Save data
function save(data: object) {
    const d = new Date();
    if (localMode) {
        let local = fs.writeFileSync("./data.json", JSON.stringify(data)); // use this to load from file
        console.log(`LOCAL save on ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.`);
    } else {
        let toSave = JSON.stringify(data).replace(/'/g, '\\"');
        client.query("SELECT * from main").then((res) => {
            if (parseInt(res.rows[0].time) > time) {
                time = parseInt(res.rows[0].time);
                data = JSON.parse(res.rows[0].data);
                console.log(`data update on ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`);
            } else {
                time = d.getTime();
                client
                    .query(`UPDATE main SET data = '${toSave}', time=${d.getTime()} WHERE TRUE`)
                    .then((res) => {
                        console.log(`save on ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.`);
                    })
                    .catch((err) => console.error(err));
            }
        });
    }
}
