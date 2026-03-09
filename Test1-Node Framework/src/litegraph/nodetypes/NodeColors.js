

export const SetNodeColor = {}
SetNodeColor.AsNumber = function(node) {
    node.prototype.color = "#3b3b2a";
    node.prototype.bgcolor = "#56513b";
}
SetNodeColor.AsString = function(node) {
    node.prototype.color = "#2a2b3b";
    node.prototype.bgcolor = "#3b3b56";
}
SetNodeColor.AsText = function(node) {
    node.prototype.color = "#2a2b3b";
    node.prototype.bgcolor = "#3b3b56";
}
SetNodeColor.AsBoolean = function(node) {
    node.prototype.color = "#2a3b2a";
    node.prototype.bgcolor = "#3b563c";
}
SetNodeColor.AsUndefined = function(node) {
    //node.prototype.color = "#2a363b";
    //node.prototype.bgcolor = "#3b4f56";
}