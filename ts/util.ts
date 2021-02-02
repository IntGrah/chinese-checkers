const U = {
    letters: ["a", "b", "c", "d", "e", "f", "g", "h", "i"],
    end(start: Point, vector: Point): Point {
        return [start[0] + vector[0], start[1] + vector[1]];
    },
    magnitude(start: Point, end: Point): number {
        return end[0] - start[0] + end[1] - start[1];
    },
    san(move: Move): string {
        if (move) {
            return U.letters[move[0][0]] + (move[0][1] + 1) + U.letters[move[1][0]] + (move[1][1] + 1);
        } else {
            return "null";
        }
    },
    depth(): number {
        return Number((U.$("depth") as HTMLSelectElement).value);
    },
    $(id: string): HTMLElement {
        return document.getElementById(id);
    },
    cell(j: number, i: number): HTMLTableDataCellElement {
        return (document.getElementById("board") as HTMLTableElement).rows[i].cells[j];
    },
    index(element: HTMLTableDataCellElement): Point {
        const parent: HTMLTableRowElement = element.parentElement as HTMLTableRowElement;
        return [
            Array.prototype.indexOf.call(parent.children, element),
            Array.prototype.indexOf.call(parent.parentElement.children, parent)
        ];
    }
}

const C = {
    SINGLE_VECTORS: [[0, 1], [1, 0], [1, -1], [-1, 1], [-1, 0], [0, -1]],
    DOUBLE_VECTORS: [[0, 2], [2, 0], [2, -2], [-2, 2], [-2, 0], [0, -2]],
    STARTING_POSITION: "xxxx5/xxx6/xx7/x8/9/8o/7oo/6ooo/5oooo x",
    ENDGAME_POSITION: "oo7/oo7/ooo6/3o5/3ox4/7x1/4o1xx1/5xxxx/7xx x",
    ENDING_POSITION: "oooo5/oo6o/oo7/o8/9/8x/7xx/x6xx/5xxxx x"
};

var transpositionTable = {};

type Piece = 0 | 1 | 2;
type Board = Piece[][];
type Point = number[];
type Move = Point[];

interface Meta {
    event?: string;
    site?: string;
    date?: string;
    time?:string;
    plyCount?: number;
    x?: string;
    o?: string;
    result?: Result;
    fen?: string;
}

type Result = "1-0" | "1/2-1/2" | "0-1" | "*";
