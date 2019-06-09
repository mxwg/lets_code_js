/*global dump, wwp:true, Raphael */

wwp = {};

(function () {
    "use strict";

    const raphael = Raphael;

    wwp.initializeDrawingArea = function (drawingArea) {
        const paper = raphael(drawingArea);

        return paper;
    };
}());
