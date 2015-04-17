define(["exports"], function (exports) {
    "use strict";

    exports.getRandom = getRandom;
    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function getRandom(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    ;
});