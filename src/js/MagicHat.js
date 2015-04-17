import {getRandom, isObjInArray} from "utils/utils";
import BEM from "utils/BEM";

var b = BEM.b("magic-hat");
b("cell");

const ELEMENTS_RANGE = {from: 1, to: 4};
const CELLS_IN_LINE = 11;
const GAME_SPEED = 15000;

class MagicHat {
    constructor (container) {
        this.container = container;
        this.model = [
            [3, 1, 2, 2, 2, 1, 1, 1, 2, 2, 3],
            [1, 3, 1, 4, 1, 4, 2, 2, 1, 1, 3],
            [2, 1, 2, 2, 4, 2, 1, 1, 1, 2, 1],
            [1, 3, 4, 2, 2, 3, 3, 4, 1, 3, 1],
            [2, 4, 2, 1, 1, 2, 4, 2, 2, 3, 3],
            [2, 2, 3, 1, 1, 1, 1, 3, 2, 1, 1],
            [4, 1, 2, 1, 2, 3, 1, 1, 3, 1, 4],
            [3, 4, 3, 3, 4, 1, 2, 2, 2, 1, 2],
            [2, 3, 3, 3, 1, 2, 3, 3, 2, 3, 2],
            [2, 4, 1, 1, 2, 4, 3, 3, 1, 4, 4],
            [4, 2, 3, 1, 1, 4, 4, 3, 4, 1, 2]
        ];

        this.activeCells = this.getCellSiblingsAvalanche({x:9, y:2});
        this.hoveredCellEl;

        container.addEventListener("mousemove", this.handleHiglight.bind(this), false);
        container.addEventListener("click", this.handleClick.bind(this), false);

        this.render();
        setInterval(function () {
            this.addNewLine();
            this.render();
        }.bind(this), GAME_SPEED)
    }

    handleHiglight (ev) {
        var cellElement = ev.originalTarget;

        if (cellElement !== this.hoveredCellEl && cellElement !== this.container) {
            this.hoveredCellEl = cellElement;

            var x = parseInt(cellElement.getAttribute("data-position-x"), 10);
            var y = parseInt(cellElement.getAttribute("data-position-y"), 10);
            var position = x !== NaN && y!== NaN ? {x, y} : false;

            if (position) {
                this.activeCells = this.getCellSiblingsAvalanche(position);
                this.render();
            }
        }
    }

    handleClick (ev) {
        this.removeActiveElements();
        this.normalizeModel();
        this.render();
    }

    shiftColomn (x, y) {
        var i;
        for (i = x ; i >= 0; i-=1){
            this.model[i][y] = this.model[i-1] ?this.model[i-1][y] : 0;
        }
    }

    normalizeModel () {
        var i, j;

        for (i=0; i < CELLS_IN_LINE; i+=1) { //Rows
            for (j=0; j < CELLS_IN_LINE; j+=1) { //Cells
                if (this.model[j][i] === undefined) {
                    this.shiftColomn(j,i);
                }
            }
        }
    }

    removeActiveElements () {
        this.activeCells.forEach(cell => {
            this.model[cell.x][cell.y] = undefined;
        })

    }

    getCellValue (position) {
        let result = null;
        if (this.model[position.x] !== undefined && this.model[position.x][position.y] !== undefined) {
            result = this.model[position.x][position.y];
        }

        return result;
    }

    getCellSiblingsAvalanche (position, prevResult) {
        var results = prevResult || [position];
        var siblings = this.getCellSiblings(position);

        siblings.forEach(cell => {
            if (!isObjInArray(results, cell)) {
                results.push(cell);
                this.getCellSiblingsAvalanche(cell, results);
            }

        })
        return results;
    }

    getCellSiblings (position) {
        var result = [position];

        var currentCellValue = this.getCellValue(position);
        var left   = { x: position.x-1, y: position.y   };
        var right  = { x: position.x+1, y: position.y   };
        var top    = { x: position.x  , y: position.y-1 };
        var bottom = { x: position.x  , y: position.y+1 };

        if (this.getCellValue(left) === currentCellValue)   { result.push(left);}
        if (this.getCellValue(right) === currentCellValue)  { result.push(right);}
        if (this.getCellValue(top) === currentCellValue)    { result.push(top);}
        if (this.getCellValue(bottom) === currentCellValue) { result.push(bottom);}

        return result;
    }

    addNewLine() {
        let newLine = this.generateNewLine();
        this.model.shift();
        this.model.push(newLine);
    }

    generateNewLine() {
        return Array
            .apply(null, {length : CELLS_IN_LINE})
            .map (el => this.generateRandomCell());
    }

    generateRandomCell () {
        return getRandom(ELEMENTS_RANGE.from, ELEMENTS_RANGE.to);
    }

    isCellActive (x, y) {
        var cells = this.activeCells.filter(activeElement => activeElement.x === x && activeElement.y === y);
        return cells[0] ? true : false;
    }

    render () {
        let items = this.model.map((line, x) =>
            `
                <div class="${b("line")}">
                    ${ line.map( (cell, y) => {
                        var active = this.isCellActive(x, y);

                        return `
                            <div
                                class="${b("cell", {active})} magic-hat__cell--type_${cell}"
                                data-position-x="${x}" data-position-y="${y}"
                            ></div>
                        `
                    }).join("")}
                </div>
            `
        ).join("");

        this.container.innerHTML = `
            <div class="magic-hat">${items}</div>
        `;
    }

}

export default MagicHat;