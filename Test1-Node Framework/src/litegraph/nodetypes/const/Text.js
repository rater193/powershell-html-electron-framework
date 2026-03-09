import * as NodeColor from "../NodeColors.js";

function ConstText() {
    this.addOutput("out", "text");

    this.properties = {
        label: "UNDEFINED"
    };

    // Optional: quick label edit
    this.addWidget("text", "Value", this.properties.label, (v) => {
        this.properties.label = String(v ?? "UNDEFINED");
    });
}

NodeColor.SetNodeColor.AsText(ConstText)

ConstText.title = "Text";

ConstText.prototype.onExecute = function () {
    this.setOutputData(0, this.properties["label"]);
};


LiteGraph.registerNodeType("const/text", ConstText);