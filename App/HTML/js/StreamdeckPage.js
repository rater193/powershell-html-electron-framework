import * as Globals from "./Globals.js";
import * as StreamdeckFramework from "./StreamdeckFramework.js";
import * as InspectorConstructor from "./InspectorConstructor.js";
//import { toPng } from '../../node_modules/html-to-image/dist/html-to-image.js';

let selectedPage = null;


class StreamdeckPage {
    parentPage = null;
    btnsRow = 8;
    btnsColumns = 4;
    storage = [];

    constructor(parentPage = null) {
        this.parentPage = parentPage;
    }

    SetPage(id) {
        let page = new StreamdeckPage(this);
        this.storage[id] = {
            itemtype: "page",
            itempage: page,
            render: function (btnid) {
                StreamdeckFramework.SetButton(btnid, "./img/icons/folder.png", "", async function (btnid) {
                    selectedPage = page
                    selectedPage.RenderPage()
                })
                const elementToRender = StreamdeckFramework.Getbutton(btnid).element;
                htmlToImage.toPng(elementToRender, { cacheBust: false }).then(async (result) => {
                    window.electron.triggerAction({ action: "setImage", id: btnid, image: result })
                })

            },
            inspector: function () {
                InspectorConstructor.inspector.AddInputField("Test");
            }
        }
        if (selectedPage == this) {
            this.storage[id].render(id)
        }
        return page
    }

    SetButton(id) {
        this.storage[id] = {
            itemtype: "button",
            render: function (btnid) {
                StreamdeckFramework.SetButton(btnid, "./img/sidebar-buttons.png", "", async function (btnid) {
                    //alert("test1");
                    //alert(htmlToImage);
                    //alert("test2");
                    //let data = await htmlToImage.toPixelData(StreamdeckFramework.Getbutton(btnid).element);
                    //alert(toPng);
                    //alert(await Object.keys(htmlToImage.toPng(StreamdeckFramework.Getbutton(btnid).element)));
                    //alert(StreamdeckFramework.Getbutton(btnid).element);
                })

                const elementToRender = StreamdeckFramework.Getbutton(btnid).element;
                htmlToImage.toPng(elementToRender, { cacheBust: false }).then(async (result) => {
                    window.electron.triggerAction({ action: "setImage", id: btnid, image: result })
                })

                //await window.electron.triggerAction({ action: "setImage", id: btnid, image: await htmlToImage.toPng(test2, {cacheBust: false})});

            },
            inspector: function () {
                Globals.elementInspector.innerHTML = "Selected button " + id;
            }
        }
        if (selectedPage == this) {
            this.storage[id].render(id)
        }
    }

    DeleteNode(id) {
        delete this.storage[id];
        this.storage[id] = null;
        if (selectedPage == this) {
            StreamdeckFramework.DeleteButton(id)
        }
    }

    RenderPage() {
        StreamdeckFramework.ResetButtonLayout(this.btnsRow, this.btnsColumns)
        for (let i = 0; i < this.btnsRow * this.btnsColumns; i++) {
            if (this.storage[i]) {
                this.storage[i].render(i);
            } else {
                StreamdeckFramework.DeleteButton(i);
            }
        }

        if (this.parentPage) {
            let parent = this.parentPage;
            StreamdeckFramework.SetButton(24, "./img/icons/back.png", "", function () {
                selectedPage = parent;
                selectedPage.RenderPage()
            });

            const elementToRender = StreamdeckFramework.Getbutton(btnid).element;
            htmlToImage.toPng(elementToRender, { cacheBust: false }).then(async (result) => {
                window.electron.triggerAction({ action: "setImage", id: 24, image: result })
            })
        }
    }
}

export let rootPage = new StreamdeckPage();

export function GetSelectedPage() {
    return selectedPage;
}

export function ShowInspector(id) {
    InspectorConstructor.inspector.Clear();
    if (selectedPage.storage[Number(id)]) {
        selectedPage.storage[Number(id)].inspector();
    }
}

selectedPage = rootPage;
document.addEventListener("DOMContentLoaded", function (event) {
    try {
        /*
        rootPage.SetButton(5);
        rootPage.SetButton(4);
        rootPage.SetButton(3);


        let page = rootPage.SetPage(1);
        page.SetButton(20);

        let page2 = page.SetPage(5);
        page2.SetButton(3);
        page2.SetButton(4);
        page2.SetButton(6);


        let page3 = rootPage.SetPage(0);
        page3.SetButton(15);

        rootPage.RenderPage();*/
    } catch (e) {
        //alert(e)
    }
});