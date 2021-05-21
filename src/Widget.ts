class Widget {
    static widgets: Widget[] = [];
    static idMin = 0;
    element: HTMLDivElement;
    content: string;
    icon: string[];

    constructor(config: { content: string; icon: string | string[] }) {
        this.content = config.content;
        this.icon = typeof config.icon == "string" ? config.icon.split(" ") : config.icon;
        this.element = document.createElement("div");
        this.element.id = "widget" + Widget.idMin;
        this.element.classList.add("widget", "shadow-lg", "rounded", "bg-body", "mb-2", "position-relative");

        const contentDiv = document.createElement("div");
        contentDiv.innerHTML = config.content;
        contentDiv.classList.add("widgetContent", "p-2", "rounded");

        const buttonsDiv = document.createElement("div");
        buttonsDiv.classList.add("position-absolute", "top-0", "end-0", "px-2", "mx-2", "my-1", "rounded", "bg-white");

        const collapseBtn = document.createElement("a");
        collapseBtn.innerHTML = "<i class='btn far fa-angle-down p-0 me-2' />";

        const closeBtn = document.createElement("a");
        closeBtn.innerHTML = "<i class='btn fal fa-times p-0 m-0' />";
        closeBtn.onclick = () => {
            this.delete();
            Widget.updateList();
        };

        buttonsDiv.appendChild(collapseBtn);
        buttonsDiv.appendChild(closeBtn);

        this.element.appendChild(contentDiv);
        this.element.appendChild(buttonsDiv);

        document.getElementById("widgets")!.appendChild(this.element);
        Widget.idMin++;
        Widget.widgets.push(this);

        Widget.updateList();
    }

    toObj(): object {
        this.content = this.element.querySelector("div.widgetContent")!.innerHTML;
        return { content: this.content, icon: this.icon, type: this.constructor.name };
    }

    delete() {
        this.element.remove();
        Widget.widgets = Widget.widgets.filter((obj) => {
            return this != obj;
        });
    }

    static updateList() {
        const widgetsDiv = document.getElementById("widgets")!;
        if (widgetsDiv.childElementCount == 0) widgetsDiv.classList.add("d-none");
        else widgetsDiv.classList.remove("d-none");
    }

    static generate(fromObj) {
        let lookup = { Widget: Widget, DefWidget: DefWidget, CommentWidget: CommentWidget, YoutubeWidget: YoutubeWidget, RecordWidget: RecordWidget };
        new lookup[fromObj.type]({ content: fromObj.content, icon: fromObj.icon });
    }
}
