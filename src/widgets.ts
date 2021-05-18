class Widget {
    static activeWidgets: Widget[] = [];
    element: HTMLDivElement;
    coords: { top: string; left: string } = { top: "0px", left: "0px" };
    dims: { height: string; width: string } = { height: "0px", width: "0px" };
    poppedOut: boolean;
    parent: HTMLElement;

    constructor(id: string = "myguy", head: string = "", content: string = "", parent: HTMLElement = document.body) {
        Widget.activeWidgets.push(this);

        this.element = document.createElement("div");
        this.element.id = Widget.chooseValidID(id);
        this.element.classList.add("shadow-lg", "rounded", "bg-body", "p-2", "mb-2");
        this.poppedOut = parent == document.body;
        this.parent = parent;

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
            this.updateSuggestions();
        };

        let hoverSquare: HTMLDivElement = document.createElement("div");
        hoverSquare.classList.add("position-absolute", "end-0", "bottom-0");
        hoverSquare.style.cursor = "nwse-resize";
        hoverSquare.style.width = "10px";
        hoverSquare.style.height = "10px";
        hoverSquare.id = this.element.id + "resize";

        this.element.onmouseup = () => {
            if (this.element.classList.contains("widgets")) {
                this.coords.top = this.element.style.top != "" ? this.element.style.top : this.coords.top;
                this.coords.left = this.element.style.left != "" ? this.element.style.left : this.coords.left;
                this.dims.height = this.element.style.height != "" ? this.element.style.height : this.dims.height;
                this.dims.width = this.element.style.width != "" ? this.element.style.width : this.dims.width;
            }
        };

        this.element.appendChild(dismissButton);
        this.element.appendChild(popButton);
        this.element.appendChild(headerDiv);
        this.element.appendChild(contentDiv);
        this.element.appendChild(hoverSquare);

        this.parent.appendChild(this.element);

        this.updateSuggestions();

        this.dims.height = `${this.element.offsetHeight}px`;
        this.dims.width = `${this.element.offsetWidth}px`;

        this.coords.top = `${this.element.offsetTop - 5}px`;
        this.coords.left = `${this.element.offsetLeft - 5}px`;

        if (this.poppedOut) this.popOut();
    }

    updateSuggestions() {
        if (this.parent.id == "widgets" && this.parent.childElementCount == 0) {
            this.parent.classList.add("d-none");
        } else {
            this.parent.classList.remove("d-none");
        }
    }

    popOut() {
        this.element.style.top = this.coords.top;
        this.element.style.left = this.coords.left;
        this.element.style.width = this.dims.width;
        this.element.style.height = this.dims.height;
        this.element.classList.add("widgets");
        if (this.element.parentElement == this.parent) {
            this.parent.removeChild(this.element);
            document.body.appendChild(this.element);
        }
        Widget.dragElement(this.element);
        Widget.resizeElement(this.element, 10);
        this.poppedOut = true;
        this.updateSuggestions();
    }

    popIn() {
        if (this.element.parentElement == document.body && this.parent != document.body) {
            document.body.removeChild(this.element);
            this.parent.appendChild(this.element);
        }
        this.element.onmousedown = () => {};
        this.element.classList.remove("widgets");
        this.coords.top = this.element.style.top;
        this.coords.left = this.element.style.left;
        this.dims.height = this.element.style.height;
        this.dims.width = this.element.style.width;
        this.poppedOut = false;
        this.updateSuggestions();
    }

    generalPop(): string {
        if (this.poppedOut) {
            this.popIn();
            return "<i class='btn fal fa-inbox-out fa-sm p-0 m-0'></i>";
        }
        this.popOut();
        return "<i class='btn fal fa-inbox-in fa-sm p-0 m-0'></i>";
    }

    updatePop(): string {
        if (!this.poppedOut) {
            this.popIn();
            return "<i class='btn fal fa-inbox-out fa-sm p-0 m-0'></i>";
        }
        this.popOut();
        return "<i class='btn fal fa-inbox-in fa-sm p-0 m-0'></i>";
    }

    getElement(): HTMLDivElement {
        return this.element;
    }

    delete() {
        this.element.remove();
        Widget.activeWidgets = Widget.activeWidgets.filter((obj) => {
            return this != obj;
        });
    }

    setCoords(coords: object) {
        this.coords = coords as { top: string; left: string };
    }

    updatePos() {
        this.element.style.top = this.coords.top;
        this.element.style.left = this.coords.left;
    }

    toString(): string {
        let widgetData = {
            id: this.element.id,
            header: document.querySelector(`#${this.element.id} > .widgetHeader`)?.innerHTML,
            content: document.querySelector(`#${this.element.id} > .widgetContent`)?.innerHTML,
            coords: this.coords,
            dims: this.dims,
            poppedOut: this.poppedOut,
            parentId: this.parent.id,
        };
        return JSON.stringify(widgetData);
    }

    static loadData(widgetData: string): Widget {
        let parsedData = JSON.parse(widgetData);
        let widg = new Widget(parsedData.id, parsedData.header, parsedData.content, document.getElementById(parsedData.parentId)!);
        widg.dims = parsedData.dims;
        widg.poppedOut = parsedData.poppedOut;
        widg.updatePop();
        widg.setCoords(parsedData.coords);
        widg.updatePos();
        return widg;
    }

    static chooseValidID(base: string, charToAdd: string = "-") {
        charToAdd = charToAdd.replace(/[\.\#\>]/g, "-");
        if (document.getElementById(base) != null) {
            return this.chooseValidID(base + charToAdd, charToAdd);
        } else {
            return base;
        }
    }

    static resizeElement(elmnt: HTMLElement, borderSize: number) {
        let pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;
        if (document.getElementById(elmnt.id + "resize")) {
            /* if present, the header is where you move the DIV from:*/
            document.getElementById(elmnt.id + "resize")!.onmousedown = dragMouseDown;
        } else {
            /* otherwise, move the DIV from anywhere inside the DIV:*/
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeResizeElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementResize;
        }

        function elementResize(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.width = elmnt.offsetWidth - pos1 + "px";
            elmnt.style.height = elmnt.offsetHeight - pos2 + "px";
        }

        function closeResizeElement() {
            /* stop moving when mouse button is released:*/
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    static dragElement(elmnt: HTMLElement) {
        let pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) {
            /* if present, the header is where you move the DIV from:*/
            document.getElementById(elmnt.id + "header")!.onmousedown = dragMouseDown;
        } else {
            /* otherwise, move the DIV from anywhere inside the DIV:*/
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = elmnt.offsetTop - pos2 + "px";
            elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
        }

        function closeDragElement() {
            /* stop moving when mouse button is released:*/
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}
