class Widget {
    private element: HTMLDivElement;
    private coords: { top: string; left: string } = { top: "0px", left: "0px" };
    private dims: { height: number; width: number } = { height: 0, width: 0 };
    private poppedOut: boolean;
    private parent: HTMLElement;

    constructor(id: string, head: string = "", content: string = "", parent: HTMLElement = document.body) {
        this.element = document.createElement("div");
        this.element.id = id;
        this.element.classList.add("shadow-lg", "rounded", "bg-body", "p-2", "mb-1");
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

        let popButton: HTMLAnchorElement = document.createElement("a");
        popButton.classList.add("float-end", "m-0", "mx-1");
        popButton.innerHTML = "<i class='btn fal fa-inbox-out fa-sm p-0 m-0'></i>";

        popButton.onmousedown = () => {
            popButton.innerHTML = this.generalPop();
        };

        let dismissButton: HTMLAnchorElement = document.createElement("a");
        dismissButton.classList.add("float-end", "m-0", "mx-1");
        dismissButton.innerHTML = "<i class='btn fal fa-times fa-sm p-0 m-0'></i>";

        dismissButton.onmousedown = () => {
            this.delete();
            if (this.parent.id == "suggestions" && this.parent.childElementCount - 1 == 0) {
                document.getElementById("noSugs")?.classList.remove("d-none");
            } else {
                document.getElementById("noSugs")?.classList.add("d-none");
            }
        };

        this.element.appendChild(dismissButton);
        this.element.appendChild(popButton);
        this.element.appendChild(headerDiv);
        this.element.appendChild(contentDiv);

        this.parent.appendChild(this.element);

        if (this.parent.id == "suggestions") {
            document.getElementById("noSugs")?.classList.add("d-none");
        }

        this.dims.height = this.element.offsetHeight;
        this.dims.width = this.element.offsetWidth;

        this.coords.top = `${this.parent.offsetTop + this.element.offsetTop}px`;
        this.coords.left = `${this.parent.offsetLeft + this.element.offsetLeft}px`;
    }

    popOut() {
        this.dims.height = this.element.offsetHeight;
        this.dims.width = this.element.offsetWidth;
        this.element.style.top = this.coords.top;
        this.element.style.left = this.coords.left;
        this.element.classList.add("widgets");
        this.parent.removeChild(this.element);
        document.body.appendChild(this.element);
        window.dragElement(this.element);
        this.element.style.width = this.dims.width + "px";
        this.element.style.height = this.dims.height + "px";
        this.poppedOut = true;
        if (this.parent.id == "suggestions" && this.parent.childElementCount - 1 == 0) {
            document.getElementById("noSugs")?.classList.remove("d-none");
        }
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
        this.element.style.removeProperty("height");
        this.element.style.removeProperty("width");
        this.poppedOut = false;
        if (this.parent.id == "suggestions") {
            document.getElementById("noSugs")?.classList.add("d-none");
        }
    }

    getElement(): HTMLDivElement {
        return this.element;
    }

    delete() {
        this.element.remove();
    }
}
