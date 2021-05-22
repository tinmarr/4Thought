class Widget {
    static widgets: Widget[] = [];
    static idMin = 0;
    element: HTMLDivElement;
    content: string;
    collapse: string | boolean;
    isCollapsed = false;

    constructor(config: { content: string; collapse: string | boolean; isCollapsed?: boolean }) {
        this.content = config.content;
        this.collapse = config.collapse;

        this.element = document.createElement("div");
        this.element.id = "widget" + Widget.idMin;
        this.element.classList.add("widget", "shadow-lg", "rounded", "bg-body", "mb-2", "position-relative");

        const contentDiv = document.createElement("div");
        contentDiv.innerHTML = config.content;
        contentDiv.classList.add("widgetContent", "p-2", "rounded");

        const buttonsDiv = document.createElement("div");
        buttonsDiv.classList.add("position-absolute", "top-0", "end-0", "px-2", "mx-2", "my-1", "rounded", "bg-white");

        if (config.collapse !== false) {
            const collapseBtn = document.createElement("a");
            collapseBtn.innerHTML = "<i class='btn far fa-angle-down p-0 me-2' id='collapseBtn' />";
            buttonsDiv.appendChild(collapseBtn);
            collapseBtn.onclick = () => { this.toggleCollapse() }

            const collapsedDiv = document.createElement("div");
            collapsedDiv.innerHTML = config.collapse as string;
            collapsedDiv.classList.add("widgetCollapsed", "p-2", "rounded", "d-none");

            this.element.append(collapsedDiv);
        }

        const closeBtn = document.createElement("a");
        closeBtn.innerHTML = "<i class='btn fal fa-times p-0 m-0' />";
        closeBtn.onclick = () => {
            this.delete();
            Widget.updateList();
        };
        buttonsDiv.appendChild(closeBtn);

        this.element.appendChild(contentDiv);
        this.element.appendChild(buttonsDiv);

        document.getElementById("widgets")!.appendChild(this.element);
        Widget.idMin++;
        Widget.widgets.push(this);

        Widget.updateList();

        if (config.isCollapsed || false) this.toggleCollapse();
    }

    toObj(): object {
        this.content = this.element.querySelector("div.widgetContent")!.innerHTML;
        if (this.collapse !== false) this.element.querySelector("div.widgetCollapsed")!.innerHTML;
        return { content: this.content, collapse: this.collapse, isCollapsed: this.isCollapsed, type: this.constructor.name };
    }

    delete() {
        this.element.remove();
        Widget.widgets = Widget.widgets.filter((obj) => {
            return this != obj;
        });
    }

    toggleCollapse() {
        this.element.querySelector(this.isCollapsed ? "div.widgetContent" : "div.widgetCollapsed")!.classList.remove("d-none");
        this.element.querySelector(this.isCollapsed ? "div.widgetCollapsed" : "div.widgetContent")!.classList.add("d-none");

        (this.element.querySelector("#collapseBtn")! as HTMLDivElement).style.transform = 'rotate('+(this.isCollapsed ? 0 : 90)+'deg)'; 

        this.isCollapsed = !this.isCollapsed;        
    }

    static updateList() {
        const widgetsDiv = document.getElementById("widgets")!;
        if (widgetsDiv.childElementCount == 0) widgetsDiv.classList.add("d-none");
        else widgetsDiv.classList.remove("d-none");
    }

    static generate(fromObj) {
        let lookup = { Widget: Widget, DefWidget: DefWidget, CommentWidget: CommentWidget, YoutubeWidget: YoutubeWidget, RecordWidget: RecordWidget };
        new lookup[fromObj.type]({ content: fromObj.content, collapse: fromObj.collapse, isCollapsed: fromObj.isCollapsed });
    }
}
