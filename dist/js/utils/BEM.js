define(["exports", "module"], function (exports, module) {
    "use strict";

    function getBEMPAth(blockData) {
        var base = blockData.b;

        if (typeof blockData.e === "string") {
            base += "__" + blockData.e;
        }

        return base + " " + blockData.m.map(function (modifier) {
            var result;
            if (typeof modifier === "string") {
                result = base + "--" + modifier;
            } else {
                result = base + "--" + modifier.name;

                if (modifier.value) {
                    result += "_" + modifier.value;
                }
            }

            return result;
        }).join(" ");
    }

    var BEM = {
        b: function b(b) {
            return function (elementName) {
                var modifiers = arguments[1] === undefined ? {} : arguments[1];

                var e, m;
                if (typeof elementName === "string") {
                    e = elementName;
                } else {
                    modifiers = elementName || {};
                }

                m = Object.keys(modifiers).filter(function (modifier) {
                    return modifiers[modifier];
                }) || [];

                return getBEMPAth({ b: b, e: e, m: m });
            };
        }
    };

    module.exports = BEM;
});