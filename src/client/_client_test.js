/* global expect, wwp, $ */
(function () {
    "use strict";

    describe("Drawing area", function () {
        function addDivToDocument(divString) {
            const drawingArea = $(divString);
            $(document.body).append(drawingArea);
            return drawingArea;
        }

        it("should be initialized in correct div", function () {
            const drawingArea = addDivToDocument("<div id='wwp-drawing-area'>content</div>");

            wwp.initializeDrawingArea("wwp-drawing-area");

            const tagInsideDrawingArea = drawingArea.children(0)[0].tagName;
            expect(tagInsideDrawingArea).to.equal("svg");
        });

        it("should have the same dimension as its enclosing div", function () {
            // create drawingArea as a jquery object
            const drawingArea = addDivToDocument("<div style='height: 333px; width: 666px'>content</div>");

            // get dom object out of jquery object using [0]
            const paper = wwp.initializeDrawingArea(drawingArea[0]);

            expect(paper.height).to.equal(333);
            expect(paper.width).to.equal(666);
        });

        it("should draw a line", function () {
            const drawingArea = addDivToDocument("<div style='height: 300px; width: 500px'>content</div>");
            const paper = wwp.initializeDrawingArea(drawingArea);

            wwp.drawLine(20, 30, 200, 50);

            let elements = [];
            paper.forEach(function (element) {
                elements.push(element);
            });
            expect(elements.length).to.equal(1);

            const element = elements[0];
            const path = element.node.attributes.d.value;
            expect(path).to.equal("M20,30L200,50");
        });
    });

}());
