class Widget {
    private element: HTMLDivElement;
    private coords: { top: string; left: string } = { top: "0px", left: "0px" };
    private dims: { height: number; width: number } = { height: 0, width: 0 };
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
        headerDiv.innerHTML = head + "<hr class='mb-2 mt-1'>";
        headerDiv.classList.add("widgetHeader", "h5", "p-0", "m-0");
        headerDiv.id = this.element.id + "header";

        let contentDiv: HTMLDivElement = document.createElement("div");
        contentDiv.innerHTML = content;
        contentDiv.classList.add("widgetContent");

        let button: HTMLAnchorElement = document.createElement("a");
        button.classList.add("float-end", "m-0");
        button.innerHTML = "<i class='btn fal fa-inbox-out fa-sm p-0 m-0'></i>";

        button.onmousedown = () => {
            button.innerHTML = this.generalPop();
        };

        this.element.appendChild(button);
        this.element.appendChild(headerDiv);
        this.element.appendChild(contentDiv);

        this.parent.appendChild(this.element);

        this.dims.height = this.element.offsetHeight;
        this.dims.width = this.element.offsetWidth;

        this.coords.top = `${this.parent.offsetTop + this.element.offsetTop}px`;
        this.coords.left = `${this.parent.offsetLeft + this.element.offsetLeft}px`;
    }

    popOut() {
        this.element.style.top = this.coords.top;
        this.element.style.left = this.coords.left;
        this.element.classList.add("widgets");
        this.parent.removeChild(this.element);
        document.body.appendChild(this.element);
        window.dragElement(this.element);
        this.element.style.width = this.dims.width + "px";
        this.element.style.height = this.dims.height + "px";
        this.poppedOut = true;
    }

    generalPop(): string {
        if (this.poppedOut) {
            this.popIn();
            return "<i class='btn fal fa-inbox-out fa-sm p-0 m-0'></i>";
        }
        this.popOut();
        return "<i class='btn fal fa-inbox-in fa-sm p-0 m-0'></i>";
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
