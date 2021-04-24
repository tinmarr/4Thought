import express from "express";
import path from "path";

const app = express();
const port = 8000;

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

app.use("/quill_scripts", express.static(path.join(__dirname, "../node_modules/quill/dist")));
app.use("/scripts", express.static(path.join(__dirname, "../dist/src")));
app.use("/css", express.static(path.join(__dirname, "../public/css")));

app.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

app.get("/editor", (req, res) => {
    res.render("editor", { title: "Editor" });
});

app.listen(port, () => {
    console.log(`server is listening on ${port}`);
});
