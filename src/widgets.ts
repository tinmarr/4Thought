class Widget {
    private element: HTMLDivElement;
    private coords: { top: string; left: string } = { top: "0px", left: "0px" };
    private poppedOut: boolean;
    private parent: HTMLElement;

    constructor(id: string, head: string = "", content: string = "", parent: HTMLElement = document.body) {
        this.element = document.createElement("div");
        this.element.id = id;
        this.element.classList.add("shadow-lg", "rounded", "bg-body", "p-2");
        this.poppedOut = parent == document.body;
        this.parent = parent;
        if (this.poppedOut) {
            this.popOut();
        }

        let headerDiv: HTMLDivElement = document.createElement("div");
        headerDiv.innerHTML = head;
        headerDiv.classList.add("widgetHeader");

        let contentDiv: HTMLDivElement = document.createElement("div");
        contentDiv.innerHTML = content;
        contentDiv.classList.add("widgetContent");

        let button: HTMLButtonElement = document.createElement("button");
        button.innerHTML = "POP";
        button.onmousedown = () => {
            console.log("click!");
            this.generalPop();
        };

        this.element.appendChild(headerDiv);
        this.element.appendChild(contentDiv);
        this.element.appendChild(button);

        this.parent.appendChild(this.element);
    }

    popOut() {
        this.element.style.top = this.coords.top;
        this.element.style.left = this.coords.left;
        this.element.classList.add("widgets");
        this.parent.removeChild(this.element);
        document.body.appendChild(this.element);
        window.dragElement(this.element);
        this.poppedOut = true;
    }

    generalPop() {
        if (this.poppedOut) {
            this.popIn();
            return;
        }
        this.popOut();
    }

    popIn() {
        document.body.removeChild(this.element);
        this.parent.appendChild(this.element);
        this.element.onmousedown = () => {};
        this.element.classList.remove("widgets");
        this.coords.top = this.element.style.top;
        this.coords.left = this.element.style.left;
        this.poppedOut = false;
    }

    getElement(): HTMLDivElement {
        return this.element;
    }
}
