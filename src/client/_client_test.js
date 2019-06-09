/* global expect, wwp */
(function() {
    "use strict";

    describe("Drawing area", function () {

        it("should be initialized in correct div", function () {
            const drawingAreaDivId = "wwp-drawing-area";
            let div = document.createElement("div");
            div.setAttribute("id", drawingAreaDivId);
            document.body.appendChild(div);


            wwp.initializeDrawingArea(drawingAreaDivId);

            const extractedDiv = document.getElementById(drawingAreaDivId);
            // expect(extractedDiv.getAttribute("foo")).to.equal("bar");

        });
    });

}());
