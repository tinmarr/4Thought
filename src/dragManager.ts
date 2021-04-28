/// <reference types="jquery" />
/// <reference path="./documentManager.ts" />

$(".sortable")
    .sortable({
        revert: true,
        appendTo: $(".sortable"),
        cancel: "a",
        delay: 500,
        opacity: 0.5,
        scroll: false,
        zIndex: 5,
    })
    .disableSelection();

$(".drag").draggable({
    connectToSortable: ".sortable",
    revert: "invalid",
});

$(".sortable").on("mouseup", () => {
    let array = $(".sortable").sortable("toArray");
    send("/update-order", { order: array }, (res: any) => {
        console.log(res);
    });
});
