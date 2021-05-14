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

        this.element.appendChild(headerDiv);
        this.element.appendChild(contentDiv);

        this.parent.appendChild(this.element);
    }

    popOut() {
        this.element.style.top = this.coords.top;
        this.element.style.left = this.coords.left;
        this.element.classList.add("widgets");
        this.parent.removeChild(this.element);
        document.body.appendChild(this.element);
        window.dragElement(this.element);
    }

    popIn() {
        document.body.removeChild(this.element);
        this.parent.appendChild(this.element);
        this.element.onmousedown = () => {};
        this.element.classList.remove("widgets");
        this.coords.top = this.element.style.top;
        this.coords.left = this.element.style.left;
    }

    getElement(): HTMLDivElement {
        return this.element;
    }
}
