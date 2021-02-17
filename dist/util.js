const U = {
    add(start, vector) {
        return [start[0] + vector[0], start[1] + vector[1]];
    },
    magnitude(start, end) {
        return end[0] - start[0] + end[1] - start[1];
    },
    san(move) {
        if (move) {
            return Letter[move[0][0]] + (move[0][1] + 1) + Letter[move[1][0]] + (move[1][1] + 1);
        }
        else {
            return "null";
        }
    },
    depth() {
        return Number(U.$("depth").value);
    },
    $(id) {
        return document.getElementById(id);
    },
    cell(j, i) {
        return document.getElementById("board").rows[i].cells[j];
    },
    index(element) {
        const parent = element.parentElement;
        return [
            Array.prototype.indexOf.call(parent.children, element),
            Array.prototype.indexOf.call(parent.parentElement.children, parent)
        ];
    }
};
const C = {
    SINGLE_VECTORS: [[0, 1], [1, 0], [1, -1], [-1, 1], [-1, 0], [0, -1]],
    DOUBLE_VECTORS: [[0, 2], [2, 0], [2, -2], [-2, 2], [-2, 0], [0, -2]],
    STARTING_POSITION: "xxxx5/xxx6/xx7/x8/9/8o/7oo/6ooo/5oooo x"
};
let transpositionTable = {};
var Letter;
(function (Letter) {
    Letter[Letter["a"] = 0] = "a";
    Letter[Letter["b"] = 1] = "b";
    Letter[Letter["c"] = 2] = "c";
    Letter[Letter["d"] = 3] = "d";
    Letter[Letter["e"] = 4] = "e";
    Letter[Letter["f"] = 5] = "f";
    Letter[Letter["g"] = 6] = "g";
    Letter[Letter["h"] = 7] = "h";
    Letter[Letter["i"] = 8] = "i";
})(Letter || (Letter = {}));
