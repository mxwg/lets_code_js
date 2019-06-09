/* global expect, wwp */
(function () {
    "use strict";


    describe("Drawing area", function () {
        it("should be initialized in correct div", function () {
            const drawingAreaDivId = "wwp-drawing-area";
            const drawingArea = $("<div id='" + drawingAreaDivId + "'>content</div>");
            $(document.body).append(drawingArea);

            wwp.initializeDrawingArea(drawingAreaDivId);


            const tag = drawingArea.children(0)[0].tagName;
            expect(tag).to.equal("svg");
        });

        it("should have the same dimension as its enclosing div", function () {
            // create drawingArea as a jquery object
            const drawingArea = $("<div style='height: 333px; width: 666px'>content</div>");
            $(document.body).append(drawingArea);

            // get dom object out of jquery object using [0]
            const paper = wwp.initializeDrawingArea(drawingArea[0]);

            expect(paper.height).to.equal(333);
            expect(paper.width).to.equal(666);
        });
    });

}());
