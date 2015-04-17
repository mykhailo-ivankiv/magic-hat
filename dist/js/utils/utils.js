define(["exports"], function (exports) {
    "use strict";

    exports.getRandom = getRandom;
    exports.isObjInArray = isObjInArray;
    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function getRandom(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    ;

    function isObjInArray(arr, obj) {
        var comparableArray = arr.map(function (obj) {
            return JSON.stringify(obj);
        });
        var comparableObj = JSON.stringify(obj);

        return comparableArray.indexOf(comparableObj) >= 0 ? true : false;
    }
});