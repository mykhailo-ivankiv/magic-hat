define(["exports", "module", "utils/utils", "utils/BEM"], function (exports, module, _utilsUtils, _utilsBEM) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var getRandom = _utilsUtils.getRandom;
    var isObjInArray = _utilsUtils.isObjInArray;

    var BEM = _interopRequire(_utilsBEM);

    var b = BEM.b("magic-hat");
    b("cell");

    var ELEMENTS_RANGE = { from: 1, to: 4 };
    var CELLS_IN_LINE = 11;
    var GAME_SPEED = 15000;

    var MagicHat = (function () {
        function MagicHat(container) {
            _classCallCheck(this, MagicHat);

            this.container = container;
            this.model = [[3, 1, 2, 2, 2, 1, 1, 1, 2, 2, 3], [1, 3, 1, 4, 1, 4, 2, 2, 1, 1, 3], [2, 1, 2, 2, 4, 2, 1, 1, 1, 2, 1], [1, 3, 4, 2, 2, 3, 3, 4, 1, 3, 1], [2, 4, 2, 1, 1, 2, 4, 2, 2, 3, 3], [2, 2, 3, 1, 1, 1, 1, 3, 2, 1, 1], [4, 1, 2, 1, 2, 3, 1, 1, 3, 1, 4], [3, 4, 3, 3, 4, 1, 2, 2, 2, 1, 2], [2, 3, 3, 3, 1, 2, 3, 3, 2, 3, 2], [2, 4, 1, 1, 2, 4, 3, 3, 1, 4, 4], [4, 2, 3, 1, 1, 4, 4, 3, 4, 1, 2]];

            this.activeCells = this.getCellSiblingsAvalanche({ x: 9, y: 2 });
            this.hoveredCellEl;

            container.addEventListener("mousemove", this.handleHiglight.bind(this), false);
            container.addEventListener("click", this.handleClick.bind(this), false);

            this.render();
            setInterval((function () {
                this.addNewLine();
                this.render();
            }).bind(this), GAME_SPEED);
        }

        _createClass(MagicHat, {
            handleHiglight: {
                value: function handleHiglight(ev) {
                    var cellElement = ev.originalTarget;

                    if (cellElement !== this.hoveredCellEl && cellElement !== this.container) {
                        this.hoveredCellEl = cellElement;

                        var x = parseInt(cellElement.getAttribute("data-position-x"), 10);
                        var y = parseInt(cellElement.getAttribute("data-position-y"), 10);
                        var position = x !== NaN && y !== NaN ? { x: x, y: y } : false;

                        if (position) {
                            this.activeCells = this.getCellSiblingsAvalanche(position);
                            this.render();
                        }
                    }
                }
            },
            handleClick: {
                value: function handleClick(ev) {
                    this.removeActiveElements();
                    this.normalizeModel();
                    this.render();
                }
            },
            shiftColomn: {
                value: function shiftColomn(x, y) {
                    var i;
                    for (i = x; i >= 0; i -= 1) {
                        this.model[i][y] = this.model[i - 1] ? this.model[i - 1][y] : 0;
                    }
                }
            },
            normalizeModel: {
                value: function normalizeModel() {
                    var i, j;

                    for (i = 0; i < CELLS_IN_LINE; i += 1) {
                        //Rows
                        for (j = 0; j < CELLS_IN_LINE; j += 1) {
                            //Cells
                            if (this.model[j][i] === undefined) {
                                this.shiftColomn(j, i);
                            }
                        }
                    }
                }
            },
            removeActiveElements: {
                value: function removeActiveElements() {
                    var _this = this;

                    this.activeCells.forEach(function (cell) {
                        _this.model[cell.x][cell.y] = undefined;
                    });
                }
            },
            getCellValue: {
                value: function getCellValue(position) {
                    var result = null;
                    if (this.model[position.x] !== undefined && this.model[position.x][position.y] !== undefined) {
                        result = this.model[position.x][position.y];
                    }

                    return result;
                }
            },
            getCellSiblingsAvalanche: {
                value: function getCellSiblingsAvalanche(position, prevResult) {
                    var _this = this;

                    var results = prevResult || [position];
                    var siblings = this.getCellSiblings(position);

                    siblings.forEach(function (cell) {
                        if (!isObjInArray(results, cell)) {
                            results.push(cell);
                            _this.getCellSiblingsAvalanche(cell, results);
                        }
                    });
                    return results;
                }
            },
            getCellSiblings: {
                value: function getCellSiblings(position) {
                    var result = [position];

                    var currentCellValue = this.getCellValue(position);
                    var left = { x: position.x - 1, y: position.y };
                    var right = { x: position.x + 1, y: position.y };
                    var top = { x: position.x, y: position.y - 1 };
                    var bottom = { x: position.x, y: position.y + 1 };

                    if (this.getCellValue(left) === currentCellValue) {
                        result.push(left);
                    }
                    if (this.getCellValue(right) === currentCellValue) {
                        result.push(right);
                    }
                    if (this.getCellValue(top) === currentCellValue) {
                        result.push(top);
                    }
                    if (this.getCellValue(bottom) === currentCellValue) {
                        result.push(bottom);
                    }

                    return result;
                }
            },
            addNewLine: {
                value: function addNewLine() {
                    var newLine = this.generateNewLine();
                    this.model.shift();
                    this.model.push(newLine);
                }
            },
            generateNewLine: {
                value: function generateNewLine() {
                    var _this = this;

                    return Array.apply(null, { length: CELLS_IN_LINE }).map(function (el) {
                        return _this.generateRandomCell();
                    });
                }
            },
            generateRandomCell: {
                value: function generateRandomCell() {
                    return getRandom(ELEMENTS_RANGE.from, ELEMENTS_RANGE.to);
                }
            },
            isCellActive: {
                value: function isCellActive(x, y) {
                    var cells = this.activeCells.filter(function (activeElement) {
                        return activeElement.x === x && activeElement.y === y;
                    });
                    return cells[0] ? true : false;
                }
            },
            render: {
                value: function render() {
                    var _this = this;

                    var items = this.model.map(function (line, x) {
                        return "\n                <div class=\"" + b("line") + "\">\n                    " + line.map(function (cell, y) {
                            var active = _this.isCellActive(x, y);

                            return "\n                            <div\n                                class=\"" + b("cell", { active: active }) + " magic-hat__cell--type_" + cell + "\"\n                                data-position-x=\"" + x + "\" data-position-y=\"" + y + "\"\n                            ></div>\n                        ";
                        }).join("") + "\n                </div>\n            ";
                    }).join("");

                    this.container.innerHTML = "\n            <div class=\"magic-hat\">" + items + "</div>\n        ";
                }
            }
        });

        return MagicHat;
    })();

    module.exports = MagicHat;
});