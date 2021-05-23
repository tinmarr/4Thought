/// <reference path="./documentManager.ts" />

import Sortable from "sortablejs";

const parent = document.currentScript?.getAttribute("doc-parent")!;

if (parent == "Home") {
    const sortable = new Sortable(document.getElementById("sortable") as HTMLElement, {
        group: {
            name: "documents",
            pull: true,
        },
        sort: true,
        animation: 150,
        draggable: ".drag",
        dataIdAttr: "id",
        direction: "vertical",
        ghostClass: "invisible",
        handle: ".handle",
        onSort: (ev: Sortable.SortableEvent) => {
            sendNoCB("/update-order", { from: ev.oldIndex, to: ev.newIndex });
        },
    });
} else if (parent == "Editor") {
    const sortable = new Sortable(document.getElementById("widgets") as HTMLElement, {
        group: {
            name: "documents",
            pull: true,
        },
        sort: true,
        animation: 150,
        draggable: ".drag",
        dataIdAttr: "id",
        direction: "vertical",
        ghostClass: "invisible",
        handle: ".handle",
        onSort: (ev: Sortable.SortableEvent) => {
            Widget.widgets.splice(ev.newIndex!, 0, Widget.widgets.splice(ev.oldIndex!, 1)[0]);
        }
    });
}