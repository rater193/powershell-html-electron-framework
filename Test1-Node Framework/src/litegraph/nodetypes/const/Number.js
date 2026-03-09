
import * as NodeColor from "../NodeColors.js";

//Constant
function ConstantNumber() {
    this.addOutput("value", "number");
    this.addProperty("value", 1.0);
    this.widget = this.addWidget("number", "value", 1, "value");
    this.widgets_up = true;
    this.size = [180, 30];
}

NodeColor.SetNodeColor.AsNumber(ConstantNumber)

ConstantNumber.title = "Const Number";
ConstantNumber.desc = "Constant number";

ConstantNumber.prototype.onExecute = function () {
    this.setOutputData(0, parseFloat(this.properties["value"]));
};

ConstantNumber.prototype.getTitle = function () {
    if (this.flags.collapsed) {
        return this.properties.value;
    }
    return this.title;
};

ConstantNumber.prototype.setValue = function (v) {
    this.setProperty("value", v);
}

ConstantNumber.prototype.onDrawBackground = function (ctx) {
    //show the current value
    this.outputs[0].label = this.properties["value"].toFixed(3);
};
LiteGraph.registerNodeType("const/number", ConstantNumber);