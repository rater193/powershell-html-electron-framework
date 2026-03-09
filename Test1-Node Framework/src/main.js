

import './lib/integration-litegraph.js';
import './litegraph/load-nodetypes.js';
import './litegraph/overide-popupmessage.js';

//import * as utils from './utils.js';


//Resizing the graph to match the size of the page
const documentWidth = Math.max(
    document.body.scrollWidth, 
    document.documentElement.scrollWidth, 
    document.body.offsetWidth, 
    document.documentElement.offsetWidth, 
    document.documentElement.clientWidth
);

const documentHeight = Math.max(
    document.body.scrollHeight, 
    document.documentElement.scrollHeight, 
    document.body.offsetHeight, 
    document.documentElement.offsetHeight, 
    document.documentElement.clientHeight
);
document.getElementById("mycanvas").width = (documentWidth-2)
document.getElementById("mycanvas").height = (documentHeight-2)


/*
var graph = new LGraph();
var canvas = new LGraphCanvas("#mycanvas", graph);


/*
var node_const = LiteGraph.createNode("basic/const");
node_const.pos = [200,200];
graph.add(node_const);
node_const.setValue(4.5);

var node_watch = LiteGraph.createNode("basic/watch");
node_watch.pos = [700,200];
graph.add(node_watch);
node_const.connect(0, node_watch, 0 );
*/
/*
graph.start()





/*
LiteGraph.registered_node_types = {};
LiteGraph.Nodes = {};
*/
/*
LiteGraph.registered_node_types = {};
LiteGraph.Nodes = {};



function AddNode() {
    this.addInput("number1", "number");
    this.addInput("number2", "number");
    //this.getInputData("in1")
    this.addOutput("out", "number");
}

AddNode.title = "Add";

AddNode.prototype.onExecute = function() {
    this.setOutputData(0, (this.getInputData(0) || 0) + (this.getInputData(1) || 0));
};

AddNode.prototype.color = "#2a363b";
AddNode.prototype.bgcolor = "#3b4f56";



function MultiplyNode() {
    this.addInput("number1", "number");
    this.addInput("number2", "number");
    
    this.addOutput("out", "number");
}

MultiplyNode.title = "Multiply";

MultiplyNode.prototype.onExecute = function() {
    this.setOutputData(0, (this.getInputData(0) || 0) * (this.getInputData(1) || 0));
};



function ConstNumber() {
    this.addOutput("out", "number")
}









function WatchNode() {
  this.addInput("Value", "*");          // accept any type
  this.addOutput("Value", "*");         // pass-through (optional)

  this.size = [220, 90];

  this.properties = {
    label: "Watch",
    maxLen: 120
  };

  this._last = undefined;
  this._lastText = "(no data)";

  // Optional: quick label edit
  this.addWidget("text", "Label", this.properties.label, (v) => {
    this.properties.label = String(v ?? "");
  });
}

WatchNode.title = "Watch";
WatchNode.desc = "Displays the latest incoming value";

WatchNode.prototype.onExecute = function () {
  const v = this.getInputData(0);
  this._last = v;

  // Pass-through so you can keep chaining
  this.setOutputData(0, v);

  this._lastText = formatWatchValue(v, this.properties.maxLen);
};

WatchNode.prototype.onDrawForeground = function (ctx) {
  if (this.flags.collapsed) return;

  ctx.save();

  // Label
  ctx.font = "12px sans-serif";
  ctx.fillStyle = "#cfd3da";
  ctx.fillText(this.properties.label || "Watch", 10, 45);

  // Value (monospace-ish)
  ctx.font = "12px monospace";
  ctx.fillStyle = "#9fe3a1";
  const txt = this._lastText ?? "(no data)";
  drawMultilineText(ctx, txt, 10, 65, this.size[0] - 20, 2);

  ctx.restore();
};

// Helper: format input safely
function formatWatchValue(v, maxLen = 120) {
  if (v === undefined) return "(undefined)";
  if (v === null) return "(null)";

  let s;
  const t = typeof v;

  if (t === "string") s = v;
  else if (t === "number" || t === "boolean" || t === "bigint") s = String(v);
  else if (t === "function") s = "(function)";
  else {
    // object / array
    try {
      s = JSON.stringify(v);
    } catch {
      s = "(unserializable object)";
    }
  }

  if (!s) s = "(empty)";
  if (s.length > maxLen) s = s.slice(0, maxLen) + "…";
  return s;
}

// Helper: wrap text (very small/simple)
function drawMultilineText(ctx, text, x, y, maxWidth, maxLines = 2) {
  const words = String(text).split(" ");
  let line = "";
  let lineCount = 0;

  for (let i = 0; i < words.length; i++) {
    const test = line ? line + " " + words[i] : words[i];
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y + lineCount * 14);
      line = words[i];
      lineCount++;
      if (lineCount >= maxLines) {
        ctx.fillText("…", x + maxWidth - 10, y + (maxLines - 1) * 14);
        return;
      }
    } else {
      line = test;
    }
  }

  ctx.fillText(line, x, y + lineCount * 14);
}









LiteGraph.registerNodeType("math/add", AddNode);
LiteGraph.registerNodeType("math/multiply", MultiplyNode);
LiteGraph.registerNodeType("debug/watch", WatchNode);





//Resizing the graph to match the size of the page
const documentWidth = Math.max(
    document.body.scrollWidth, 
    document.documentElement.scrollWidth, 
    document.body.offsetWidth, 
    document.documentElement.offsetWidth, 
    document.documentElement.clientWidth
);

const documentHeight = Math.max(
    document.body.scrollHeight, 
    document.documentElement.scrollHeight, 
    document.body.offsetHeight, 
    document.documentElement.offsetHeight, 
    document.documentElement.clientHeight
);
document.getElementById("mycanvas").width = (documentWidth-2)
document.getElementById("mycanvas").height = (documentHeight-2)
*/