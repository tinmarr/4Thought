import express from "express";
import path from "path";
import session from "express-session";
import flash from "express-flash";
import cookieParser from "cookie-parser";

import { router } from "./src/routes";

const app = express();
const port = 8000;
const d = new Date();

app.use(express.json());

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

const middlewares: any[] = [
    express.static(path.join(__dirname, "../node_modules/quill/dist")),
    express.static(path.join(__dirname, "../dist/src")),
    express.static(path.join(__dirname, "../css")),
    session({ secret: "thisisasecret", resave: false, saveUninitialized: false, cookie: { maxAge: 60000 } }),
    express.json(),
    express.urlencoded({ extended: true }),
    cookieParser(),
    flash(),
];

app.post("/data-save", (req, res) => {
    console.log(req.body);
    // todo: actually save stuff
    return res.json('synced');
});

app.post("/data-login", (req, res) => {
    console.log(req.body);
    // todo: do login stuff using data.json
    return res.json('beep bop boop');
});

app.use(middlewares);

app.use("/", router);

app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
});

app.listen(port, () => {
    console.log(`server is listening on ${port} at ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`);
});
