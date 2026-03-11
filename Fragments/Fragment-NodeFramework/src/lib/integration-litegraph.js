
var graph = new LGraph();
var canvas = new LGraphCanvas("#mycanvas", graph);


LiteGraph.registered_node_types = {};
LiteGraph.Nodes = {};

// Pick your own colors by slot/link "type"
/*
    node.prototype.color = "#2a2b3b";
    node.prototype.bgcolor = "#3b3b56";
*/
const typeColorsOn = {
  number:  "#FFD500",
  string:  "#656592",
  text:    "#494b66",
  boolean: "#66FF66",
  object:  "#66CCFF",
  flow:    "#9999FF",
  "*":     "#CCCCCC"
};

// Apply to BOTH the pins and links
canvas.default_connection_color_byType    = { ...typeColorsOn };
canvas.default_connection_color_byTypeOff = { ...typeColorsOn };

// Some versions also use this shared map:
Object.assign(LGraphCanvas.link_type_colors, typeColorsOn);
