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
            let array = sortable.toArray();
            
            sendNoCB("/update-order", { order: array });
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
            let array = sortable.toArray();
            Widget.sort(array);
        }
    });
}