/*
WatchNode.prototype.onConnectionsChange = function (type, slot, connected, link_info) {
  // Clear display so it's obvious something changed
  this._lastValue = undefined;
  this.setDirtyCanvas(true, true);

  // Optional: immediately run one step so it updates right after connecting
  if (this.graph) {
    // If graph isn't running, a single step updates values
    try { this.graph.runStep(1); } catch { }
  }
};

*/

import * as NodeColor from "../NodeColors.js";

//Watch a value in the editor
function Watch() {
  this.size = [60, 30];
  this.addInput("value", 0, { label: "" });
  this.value = 0;
  this._canvasRef = null; // we’ll set this when the node is added (see below)
}
NodeColor.SetNodeColor.AsUndefined(Watch)

Watch.title = "Watch";
Watch.desc = "Show value of input";

Watch.prototype.onConnectionsChange = function () {
  applyAutoColorToAnyInput(this, 0, this._canvasRef);
  this.setDirtyCanvas(true, true);
};

Watch.prototype.onAdded = function () {
  // Find the canvas that is rendering this graph (LiteGraph keeps a list)
  // This is the most reliable way to access your canvas color maps.
  if (this.graph && this.graph.list_of_graphcanvas && this.graph.list_of_graphcanvas.length > 0) {
    this._canvasRef = this.graph.list_of_graphcanvas[0];
  }

  applyAutoColorToAnyInput(this, 0, this._canvasRef);
};

Watch.prototype.onExecute = function () {
  if (this.inputs[0]) {
    this.value = this.getInputData(0);
  }
};

Watch.prototype.getTitle = function () {
  if (this.flags.collapsed) {
    return this.inputs[0].label;
  }
  return this.title;
};

Watch.prototype.onDrawForeground = function () {
  //this.setDirtyCanvas(true, true);

  // Optional: immediately run one step so it updates right after connecting
  if (this.graph) {
    // If graph isn't running, a single step updates values
    try { this.graph.runStep(1); } catch { }
  }
  //show the current value
  this.inputs[0].label = Watch.toString(this.value);
  //applyAutoColorToAnyInput(this, 0, this._canvasRef);
}

Watch.toString = function (o) {
  if (o == null) {
    return "null";
  } else if (o.constructor === Number) {
    return o.toFixed(3);
  } else if (o.constructor === Array) {
    var str = "[";
    for (var i = 0; i < o.length; ++i) {
      str += Watch.toString(o[i]) + (i + 1 != o.length ? "," : "");
    }
    str += "]";
    return str;
  } else {
    return String(o);
  }
};

function applyAutoColorToAnyInput(node, inputIndex, canvas) {
  const inp = node.inputs?.[inputIndex];
  if (!inp) return;

  // default for unconnected "*"
  const fallback = canvas?.default_connection_color_byType?.["*"] || "#fff";
  const fallbackOff = canvas?.default_connection_color_byTypeOff?.["*"] || fallback;

  // Find link info for this input
  const linkId = inp.link;
  if (!linkId || !node.graph || !node.graph.links) {
    inp.color_on = fallback;
    inp.color_off = fallbackOff;
    return;
  }

  const link = node.graph.links[linkId];
  if (!link) {
    inp.color_on = fallback;
    inp.color_off = fallbackOff;
    return;
  }

  // Link has `type` in most versions. If missing, fall back to origin slot type.
  let t = link.type;

  if (!t) {
    const originNode = node.graph.getNodeById(link.origin_id);
    const originSlot = originNode?.outputs?.[link.origin_slot];
    t = originSlot?.type;
  }

  const on = canvas?.default_connection_color_byType?.[t] || fallback;
  const off = canvas?.default_connection_color_byTypeOff?.[t] || fallbackOff;

  inp.color_on = on;
  inp.color_off = off;
}


LiteGraph.registerNodeType("debug/watch", Watch);