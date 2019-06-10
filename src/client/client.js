/*global dump, wwp:true, Raphael */

wwp = {};

(function () {
    "use strict";

    const raphael = Raphael;
    let paper;

    wwp.initializeDrawingArea = function (drawingArea) {
        paper = raphael(drawingArea);

        return paper;
    };

    wwp.drawLine = function (x1, y1, x2, y2) {
        // example command: "M10 10L90 90"
        const stringCommand = `M${x1} ${y1}L${x2} ${y2}`;
        const line = paper.path(stringCommand);
    };
}());
