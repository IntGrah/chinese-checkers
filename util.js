const U = {
    letters: ["a", "b", "c", "d", "e", "f", "g", "h", "i"],
    end(start, vector) {
        return [start[0] + vector[0], start[1] + vector[1]];
    },
    magnitude(start, end) {
        return end[0] - start[0] + end[1] - start[1];
    },
    san(move) {
        if (move) {
            return U.letters[move[0][0]] + (move[0][1] + 1) + U.letters[move[1][0]] + (move[1][1] + 1);
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
    STARTING_POSITION: "xxxx5/xxx6/xx7/x8/9/8o/7oo/6ooo/5oooo x",
    ENDGAME_POSITION: "oo7/oo7/ooo6/3o5/3ox4/7x1/4o1xx1/5xxxx/7xx x",
    ENDING_POSITION: "oooo5/oo6o/oo7/o8/9/8x/7xx/x6xx/5xxxx x"
};
var transpositionTable = {};
