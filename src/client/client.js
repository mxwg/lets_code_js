/*global dump, wwp:true, Raphael */

wwp = {};

(function () {
    "use strict";

    const raphael = Raphael;
    let paper;

    wwp.initializeDrawingArea = function (drawingArea) {
        let prevX = null;
        let prevY = null;

        paper = raphael(drawingArea);

        const jqArea = $(drawingArea);

        // TODO: not working when going outside while dragging
        let isDragging = false;

        $(document).mousedown(function (event) {
            isDragging = true;
            prevX = null;
            prevY = null;
        });

        $(document).mouseup(function(event) {
            isDragging = false;
        });

        // jqArea.mouseleave(function(event) {
        //     isDragging = false;
        // });

        jqArea.mousemove(function (event) {
            // apparently event.offsetX was not working in the webcast...
            // TODO: handle padding, border, margin
            const divPageX = jqArea.offset().left;
            const divPageY = jqArea.offset().top;
            const clickX = event.pageX -divPageX;
            const clickY = event.pageY - divPageY;


            if (prevX !== null && isDragging) {
                wwp.drawLine(prevX, prevY, clickX, clickY);
            }
            prevX = clickX;
            prevY = clickY;
        });
        return paper;
    };

    wwp.drawLine = function (x1, y1, x2, y2) {
        // example command: "M10 10L90 90"
        const stringCommand = `M${x1} ${y1}L${x2} ${y2}`;
        const line = paper.path(stringCommand);
    };
}());
