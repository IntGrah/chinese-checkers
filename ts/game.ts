class Game {
    node: GameNode;
    log: Move[];
    lastMove: Move;

    constructor(private meta: Meta) {
        const now: Date = new Date();
        this.meta.event ??= "??";
        this.meta.site ??= "checkers.js";
        this.meta.date ??= now.toLocaleDateString();
        this.meta.time ??= now.toLocaleTimeString();
        this.meta.plyCount ??= 0;
        this.meta.x ??= "Unknown";
        this.meta.o ??= "checkers.js";
        this.meta.result ??= "*";
        this.importFEN(meta.fen);

    }
    play(move: Move): void {
        this.node = this.node.move(move);
        this.renderBoard(move);
        this.log.push(move);
        this.meta.plyCount++;
        const x: boolean = this.node.lastX() === 13,
            o: boolean = this.node.lastO() === 3;
        if (x && !o) {
            this.meta.result = "1-0";
        } else if (x && o) {
            this.meta.result = "1/2-1/2";
        } else if (!x && o) {
            this.meta.result = "0-1";
        } else {
            this.meta.result = "*";
        }
        this.renderPGN();
        this.renderFEN();
    }
    playSAN(san: string): void {
        const move: Move = [[Letter[san[0]], Number(san[1]) - 1], [Letter[san[2]], Number(san[3]) - 1]];
        this.play(move);
    }
    playBestMove(depth: number): void {
        let bestMove: Move;
        if (this.node.lastX() === 13 || this.node.lastO() === 3) {
            bestMove = null;
        } else {
            bestMove = this.node.bestMove(depth);
            this.play(bestMove);
        }
        console.log("Computer played: " + U.san(bestMove));
    }
    importFEN(fen: string = C.STARTING_POSITION): void {
        const board: Board = [],
            result: RegExpMatchArray = fen.match(/(.*) (x|o)/),
            split: string[] = result[1].split("/"),
            turn: boolean = result[2] === "x";
        let y: number = 0;
        for (const row of split) {
            board.push([]);
            for (let i: number = 0; i < row.length; i++) {
                const c: string = row[i];
                if (c === "x") {
                    board[y].push(1);
                } else if (c === "o") {
                    board[y].push(2);
                } else {
                    const spaces: number = Number(c);
                    for (let j: number = 0; j < spaces; j++) {
                        board[y].push(0);
                    }
                }
            }
            y++;
        }
        this.node = new GameNode(board, turn);
        this.log = [];
        this.meta.fen = fen;
        this.meta.plyCount = 0;
        this.renderBoard(null);
        this.renderPGN();
        this.renderFEN();
    }
    exportFEN(): string {
        let fen: string = "";
        for (let i: number = 0; i < 9; i++) {
            for (let j: number = 0; j < 9; j++) {
                fen += this.node.board[i][j];
            }
            if (i === 8) {
                break;
            }
            fen += "/";
        }
        return (fen + " " + this.node.turn).replace(/1/g, "x").replace(/2/g, "o").replace(/0{1,9}/g, match => match.length.toString());
    }
    exportPGN(): string {
        let pgn: string = `[Event "${this.meta.event}"]\n[Site "${this.meta.site}"]
[Date "${this.meta.date}"]\n[Time "${this.meta.time}"]\n[PlyCount "${this.meta.plyCount}"]\n`;
        if (this.meta.fen !== C.STARTING_POSITION) {
            pgn += `[FEN "${this.meta.fen}"]\n`
        }
        pgn += `[X "${this.meta.x}"]
[O "${this.meta.o}"]
[Result "${this.meta.result}"]\n\n`;
        for (let i: number = 0; i < this.log.length; i++) {
            if (i % 2 === 0) {
                pgn += i / 2 + 1 + ". ";
            }
            pgn += U.san(this.log[i]) + (i % 2 === 0 ? " " : "\n");
        }
        pgn += this.meta.result;
        return pgn;
    }
    renderPGN(): void {
        U.$("pgnText").innerText = this.exportPGN();
    }
    renderFEN(): void {
        U.$("fenText").innerText = this.exportFEN();
    }

    renderBoard(move: Move): void {
        this.lastMove = move;
        for (let i: number = 0; i < 9; i++) {
            for (let j: number = 0; j < 9; j++) {
                const piece: Piece = this.node.board[i][j],
                    style: CSSStyleDeclaration = U.cell(j, i ).style;
                style.backgroundColor = piece === 1 ? "#ff0000" : piece === 2 ? "#0000ff" : "#eeeeee"
                style.boxShadow = "0 0 0 0 #000000";
                if (move) {
                    U.cell(move[0][0], move[0][1]).style.backgroundColor = "#aaffaa";
                    U.cell(move[1][0], move[1][1]).style.boxShadow = "0 0 0 4px #00ff00";
                }
            }
        }
        U.$("turn").style.backgroundColor = this.node.turn ? "#ff0000" : "#0000ff";

    }
}
