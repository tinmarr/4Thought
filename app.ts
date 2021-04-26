import express from "express";
import path from "path";
import session from "cookie-session";
import flash from "express-flash";
import cookieParser from "cookie-parser";
import { router } from "./routes";

const app = express();
const port = process.env.PORT || 8000;
const d = new Date();

app.use([
    express.static(path.join(__dirname, "../node_modules/quill/dist")),
    express.static(path.join(__dirname, "../dist/src")),
    express.static(path.join(__dirname, "../css")),
    session({ keys: [process.env.SECRET || "thisisasecret"], maxAge: 60 * 60 * 1000 }),
    express.json(),
    express.urlencoded({ extended: true }),
    cookieParser(),
    flash(),
]);

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

app.use("/", router);

app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
});

app.listen(port, () => {
    console.log(`server is listening on ${port} at ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`);
});
