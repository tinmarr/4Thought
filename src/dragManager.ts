/// <reference types="jquery" />
/// <reference path="./documentManager.ts" />

$(".sortable")
    .sortable({
        revert: true,
    })
    .disableSelection();

$(".sortable").on("mouseup", () => {
    let array = $(".sortable").sortable("toArray");
    send("/update-order", { order: array }, (res: any) => {
        console.log(res);
    });
});
