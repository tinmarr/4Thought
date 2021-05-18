/// <reference path="./documentManager.ts" />

import Sortable from "sortablejs";

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
