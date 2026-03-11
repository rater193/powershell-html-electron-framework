//import {NodeColor} from "./_NodeColor.js";
import * as NodeColor from "../NodeColors.js";

function AddNode() {
    this.addInput("number1", "number");
    this.addInput("number2", "number");
    //this.getInputData("in1")
    this.addOutput("out", "number");
    this.value = 0
    this.valueIn1 = 0
    this.valueIn2 = 0
}

NodeColor.SetNodeColor.AsNumber(AddNode)
//NodeColor(AddNode)

AddNode.title = "Add";

AddNode.prototype.onExecute = function() {
    this.value = (this.getInputData(0) || 0) + (this.getInputData(1) || 0)
    this.valueIn1 = (this.getInputOrProperty("number1") || null)
    this.valueIn2 = (this.getInputOrProperty("number2") || null)
    this.setOutputData(0, this.value);
};

AddNode.prototype.onDrawForeground = function () {
  //this.setDirtyCanvas(true, true);

  //show the current value
  //this.outputs[0].label = Watch.toString(this.value);
  this.outputs[0].label = ((this.value ? Math.floor(this.value*1000)/1000 : null) || "out").toString()
  this.inputs[0].label = (this.valueIn1 ? Math.floor(this.valueIn1*1000)/1000 : null) || "number1"
  this.inputs[1].label = (this.valueIn2 ? Math.floor(this.valueIn2*1000)/1000 : null) || "number2"
  // Optional: immediately run one step so it updates right after connecting
  if (this.graph) {
    // If graph isn't running, a single step updates values
    try { this.graph.runStep(1); } catch { }
  }
}

LiteGraph.registerNodeType("math/add", AddNode);