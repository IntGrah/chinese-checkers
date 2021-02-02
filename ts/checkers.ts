class GameNode {
    board: Board;
    turn: boolean;
    evaluations: number[];
    moves: Move[];
    ends: Point[];

    constructor(board: Board, turn: boolean) {
        this.board = board;
        this.turn = turn;
    }
    
    bestMove(depth: number): Move {
        const evaluation: number = this.evaluate(depth, -1000, 1000, true),
            n: number = this.evaluations.indexOf(evaluation);
        console.log(evaluation);
        return this.moves[n];
    }
    evaluate(depth: number, alpha: number, beta: number, root: boolean): number {
        if (root) {
            transpositionTable = {};
        }
        if (!this.turn && this.lastX() === 13) {
            return 500 + depth;
        } else if (!this.turn && this.lastO() === 3) {
            return -500 - depth;
        }
        if (depth === 0) {
            return this.heuristicEvaluate();
        }

        const serial: string = this.serialize(depth),
            serialValue: number = transpositionTable[serial];
        if (serialValue) {
            return serialValue;
        }

        const evaluations: number[] = [],
            moves: Move[] = this.findAllMoves();

        let value: number;
        if (this.turn) {
            value = -1000;
            for (let i: number = 0; i < moves.length; i++) {
                const evaluation: number = this.move(moves[i]).evaluate(depth - 1, alpha, beta, false);
                if (evaluation > value) {
                    value = evaluation;
                }
                if (value > alpha) {
                    alpha = value;
                }
                evaluations[i] = evaluation;
                if (alpha >= beta) {
                    break;
                }
            }
        } else {
            value = 1000;
            for (let i: number = 0; i < moves.length; i++) {
                const evaluation: number = this.move(moves[i]).evaluate(depth - 1, alpha, beta, false);
                if (evaluation < value) {
                    value = evaluation;
                }
                if (value < beta) {
                    beta = value;
                }
                evaluations[i] = evaluation;
                if (alpha >= beta) {
                    break;
                }
            }
        }
        if (root) {
            this.moves = moves;
            this.evaluations = evaluations;
        }
        return transpositionTable[serial] = value;
    }
    serialize(depth: number): string {
        let string: string = "" + depth + this.turn;
        for (let i: number = 0; i < 9; i++) {
            for (let j: number = 0; j < 9; j++) {
                string += this.board[i][j];
            }
        }
        return string;
    }
    heuristicEvaluate(): number {
        let value: number = -176,
            lastX: number = 13,
            lastO: number = 3;
        for (let i: number = 0; i < 9; i++) {
            for (let j: number = 0; j < 9; j++) {
                const piece: Piece = this.board[i][j];
                if (piece !== 0) {
                    value += (piece - 1.5) * Math.abs(i - j);
                    if (piece === 1) {
                        value += i + j;
                        if (i + j < lastX) {
                            lastX = i + j;
                        }
                    } else {
                        value += i + j;
                        if (i + j > lastO) {
                            lastO = i + j;
                        }
                    }
                }
            }
        }
        return value + lastX + lastO;
    }
    lastX(): number {
        let last: number = 13;
        for (let i: number = 0; i < 9; i++) {
            for (let j: number = 0; j < 9; j++) {
                if (this.board[i][j] === 1 && i + j < last) {
                    last = i + j;
                }
            }
        }
        return last;
    }
    lastO(): number {
        let last: number = 3;
        for (let i: number = 0; i < 9; i++) {
            for (let j: number = 0; j < 9; j++) {
                if (this.board[i][j] === 2 && i + j > last) {
                    last = i + j;
                }
            }
        }
        return last;
    }
    findAllMoves(): Move[] {
        const allMoves: Move[] = [],
            positions: Point[] = [];
        for (let i: number = 0; i < 9; i++) {
            for (let j: number = 0; j < 9; j++) {
                if (this.board[i][j] === (this.turn ? 1 : 2)) {
                    positions.push([j, i]);
                }
            }
        }
        for (const position of positions) {
            const ends: Point[] = this.findPieceEnds(position),
                moves: Move[] = [];
            for (let i: number = 0; i < ends.length; i++) {
                const piece: Piece = this.board[position[1]][position[0]],
                    magnitude: number = U.magnitude(position, ends[i]);
                if (piece === 1 && magnitude > -2 || piece === 2 && magnitude < 2) {
                    moves.push([position, ends[i]]);
                }
            }
            delete this.ends;
            allMoves.push(...moves);
        }
        return allMoves.sort(function (a: Move, b: Move): number {
            const absA: number = U.magnitude(a[0], a[1]),
                absB: number = U.magnitude(b[0], b[1]);
            if (absA > absB) {
                return -1;
            } else if (absA < absB) {
                return -1;
            }
            return 0;
        });
    }
    findPieceEnds(start: Point): Point[] {
        this.ends = [];
        this.findMinorMoves(start);
        this.findMajorMoves(start, 6);
        return this.ends;
    }
    findMinorMoves(start: Point): void {
        for (const vector of C.SINGLE_VECTORS) {
            if (this.itemAt(start, vector) === 0) {
                this.ends.push(U.end(start, vector));
            }
        }
    }
    findMajorMoves(start: Point, from: number): void {
        for (let i: number = 0; i < 6; i++) {
            if (from === i) {
                continue;
            }
            const double: Point = C.DOUBLE_VECTORS[i],
                jump = this.itemAt(start, C.SINGLE_VECTORS[i]);
            if (this.itemAt(start, double) === 0 && (jump === 1 || jump === 2)) {
                const test: Point = U.end(start, double);
                if (this.ends.every(end => end[0] !== test[0] || end[1] !== test[1])) {
                    this.ends.push(test);
                    this.findMajorMoves(test, 6 - i);
                }
            }
        }
    }
    itemAt(start: Point, vector: Point): Piece {
        const y: number = start[1] + vector[1];
        if (y < 0 || y > 8) {
            return undefined;
        }
        return this.board[y][start[0] + vector[0]];
    }
    move(move: Move): GameNode {
        const board: Board = [];
        for (let i: number = 0; i < 9; i++) {
            board[i] = [...this.board[i]];
        }
        if (move) {
            const start: Point = move[0],
                end: Point = move[1],
                temp: Piece = board[start[1]][start[0]];
            board[start[1]][start[0]] = 0;
            board[end[1]][end[0]] = temp;
        }
        return new GameNode(board, !this.turn);
    }
}
