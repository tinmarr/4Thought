import express from "express";

export const router = express.Router();

router.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

router.get("/editor", (req, res) => {
    res.render("editor", { title: "Editor", identifier: 12345 });
});

router.get("/user", (req, res) => {
    res.render("authPage", { title: "Login", newUser: true });
});

router.post("/user", (req, res) => {
    let email: string = req.body.email;
    let password: string = req.body.password;
    let name: string | null = null;
    if (req.body.newUser == "on") {
        name = req.body.name;
    }
    return res.send(`name:${name} ------ email:${email} ------ password:${password}`);
});

router.post("/data-save", (req, res) => {
    console.log(req.body);
    // todo: actually save stuff
    return res.json("synced");
});

router.post("/data-login", (req, res) => {
    console.log(req.body);
    // todo: do login stuff using data.json
    return res.json("beep bop boop");
});
