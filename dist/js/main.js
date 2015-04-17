define(["exports", "MagicHat"], function (exports, _MagicHat) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var MagicHat = _interopRequire(_MagicHat);

  window.magicHat = new MagicHat(document.body);
});