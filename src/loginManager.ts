const newUser: boolean = document.currentScript?.getAttribute("new-user")! == "true";
const sumbitButton: HTMLButtonElement = <HTMLButtonElement>document.querySelector("button[type=submit]")!;

sumbitButton.classList.add("disabled");

document.getElementById("authForm")?.addEventListener("change", () => {
    let good: boolean = true;
    let alerts: string[] = [];
    let email: string = (<HTMLInputElement>document.getElementById("email"))?.value;
    let password: string = (<HTMLInputElement>document.getElementById("password"))?.value;

    good = good && isValidEmail(email);
    if (!isValidEmail(email)) alerts.push("Invalid Email");
    good = good && email != "";
    good = good && password != "";
    if (email == "") alerts.push("Must have email");
    if (password == "") alerts.push("Must have password");

    if (newUser) {
        let name: string = (<HTMLInputElement>document.getElementById("name"))?.value;
        let passwordConfirm: string = (<HTMLInputElement>document.getElementById("password-confirm"))?.value;
        good = good && name != "";
        if (name == "") alerts.push("Must have name");
        good = good && isStrongPassword(password);
        if (!isStrongPassword(password)) {
            alerts.push("Password must be at least 8 characters long");
            alerts.push(
                "Password must contain:<ul class='my-0'><li>1 lowercase letter</li><li> 1 uppercase letter</li><li> 1 number</li><li> 1 symbol (!, @, $, %, ^, &, *)</li></ul>"
            );
        }
        good = good && password == passwordConfirm;
        if (password != passwordConfirm) alerts.push("Passwords do not match");
    }
    good ? sumbitButton.classList.remove("disabled") : sumbitButton.classList.add("disabled");

    let alertsBox: HTMLDivElement = <HTMLDivElement>document.getElementById("alerts")!;
    alertsBox.innerHTML = "";
    if (alerts.length > 0) alertsBox.innerHTML += "You have some issues:<ul class='my-0 py-0'>";
    alerts = alerts.splice(0, 4);
    alerts.forEach((alert: string) => {
        alertsBox.innerHTML += `<li class="my-0">${alert}</li>`;
    });
    alertsBox.innerHTML += "</ul>";
});

function isValidEmail(email: string): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}

function isStrongPassword(password: string): boolean {
    const re = new RegExp("^((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,}))");
    return re.test(password);
}
