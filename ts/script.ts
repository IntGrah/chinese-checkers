function main(): void {
    g = new Game({});
}

let g: Game;

let start: Point = [],
    auto: boolean = true,
    flip: boolean = false;

document.querySelectorAll("td").forEach(function (element) {
    element.addEventListener("mousedown", function (event: MouseEvent) {
        event.preventDefault();
        start = U.index(this);
        if (g.node.board[start[1]][start[0]] === (g.node.turn ? 1 : 2)) {
            const ends: Point[] = g.node.findPieceEnds(start);
            for (const end of ends) {
                U.cell(end[0], end[1]).style.backgroundColor = "#ffc999";
            }
        }
    });
    element.addEventListener("mouseup", function (): void {
        if (start && g.node.board[start[1]][start[0]] === (g.node.turn ? 1 : 2)) {
            const test: Point = U.index(this);
            let ends: Point[] = g.node.findPieceEnds(start),
                legal: boolean = false;
            for (const end of ends) {
                if (end[0] === test[0] && end[1] === test[1]) {
                    legal = true;
                    break;
                }
            }
            if (legal) {
                    g.play([start, test]);
                start = undefined;
                if (auto) {
                    setTimeout(() => g.playBestMove(U.depth()), 10);
                }
            }
        }
        g.renderBoard(g.lastMove);
    });
});

U.$("turn").addEventListener("click", function () {
    this.style.backgroundColor = g.node.turn ? "#ff0000" : "#0000ff";
    g.node.turn = !g.node.turn;
});

U.$("best").addEventListener("click", function () {
    g.playBestMove(U.depth());
    if (auto) {
        setTimeout(() => g.playBestMove(U.depth()), 10);
    }
});

U.$("auto").addEventListener("click", function () {
    this.classList.toggle("selected");
    auto = !auto;
});

U.$("flip").addEventListener("click", function () {
    U.$("board").style.transform = `rotate(${(flip = !flip) ? 45 : -135}deg) skew(15deg, 15deg`;
    if (auto) {
        g.playBestMove(U.depth());
    }
});

U.$("new").addEventListener("click", function () {
    U.$("board").style.transform = "rotate(-135deg) skew(15deg, 15deg)";
    main();
});

U.$("pgnButton").addEventListener("click", function () {
    this.classList.toggle("selected");
    U.$("pgnText").classList.toggle("invisible");
});

U.$("fenButton").addEventListener("click", function () {
    this.classList.toggle("selected");
    U.$("fenText").classList.toggle("invisible");
});

main();