class GameNode {
    constructor(board, turn) {
        this.board = board;
        this.turn = turn;
    }
    bestMove(depth) {
        const evaluation = this.evaluate(depth, -1000, 1000, true), n = this.evaluations.indexOf(evaluation);
        console.log(evaluation);
        return this.moves[n];
    }
    evaluate(depth, alpha, beta, root) {
        if (root) {
            transpositionTable = {};
        }
        if (!this.turn && this.lastX() === 13) {
            return 500 + depth;
        }
        else if (!this.turn && this.lastO() === 3) {
            return -500 - depth;
        }
        if (depth === 0) {
            return this.heuristicEvaluate();
        }
        const serial = this.serialize(depth), serialValue = transpositionTable[serial];
        if (serialValue) {
            return serialValue;
        }
        const evaluations = [], moves = this.findAllMoves();
        let value;
        if (this.turn) {
            value = -1000;
            for (let i = 0; i < moves.length; i++) {
                const evaluation = this.move(moves[i]).evaluate(depth - 1, alpha, beta, false);
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
        }
        else {
            value = 1000;
            for (let i = 0; i < moves.length; i++) {
                const evaluation = this.move(moves[i]).evaluate(depth - 1, alpha, beta, false);
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
    serialize(depth) {
        let string = "" + depth + this.turn;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                string += this.board[i][j];
            }
        }
        return string;
    }
    heuristicEvaluate() {
        let value = -176, lastX = 13, lastO = 3;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const piece = this.board[i][j];
                if (piece !== 0) {
                    value += (piece - 1.5) * Math.abs(i - j);
                    if (piece === 1) {
                        value += i + j;
                        if (i + j < lastX) {
                            lastX = i + j;
                        }
                    }
                    else {
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
    lastX() {
        let last = 13;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.board[i][j] === 1 && i + j < last) {
                    last = i + j;
                }
            }
        }
        return last;
    }
    lastO() {
        let last = 3;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.board[i][j] === 2 && i + j > last) {
                    last = i + j;
                }
            }
        }
        return last;
    }
    findAllMoves() {
        const allMoves = [], positions = [];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.board[i][j] === (this.turn ? 1 : 2)) {
                    positions.push([j, i]);
                }
            }
        }
        for (const position of positions) {
            const ends = this.findPieceEnds(position), moves = [];
            for (let i = 0; i < ends.length; i++) {
                const piece = this.board[position[1]][position[0]], magnitude = U.magnitude(position, ends[i]);
                if (piece === 1 && magnitude > -2 || piece === 2 && magnitude < 2) {
                    moves.push([position, ends[i]]);
                }
            }
            delete this.ends;
            allMoves.push(...moves);
        }
        return allMoves.sort(function (a, b) {
            const absA = U.magnitude(a[0], a[1]), absB = U.magnitude(b[0], b[1]);
            if (absA > absB) {
                return -1;
            }
            else if (absA < absB) {
                return -1;
            }
            return 0;
        });
    }
    findPieceEnds(start) {
        this.ends = [];
        this.findMinorMoves(start);
        this.findMajorMoves(start, 6);
        return this.ends;
    }
    findMinorMoves(start) {
        for (const vector of C.SINGLE_VECTORS) {
            if (this.itemAt(start, vector) === 0) {
                this.ends.push(U.add(start, vector));
            }
        }
    }
    findMajorMoves(start, from) {
        for (let i = 0; i < 6; i++) {
            if (from === i) {
                continue;
            }
            const double = C.DOUBLE_VECTORS[i], jump = this.itemAt(start, C.SINGLE_VECTORS[i]);
            if (this.itemAt(start, double) === 0 && (jump === 1 || jump === 2)) {
                const test = U.add(start, double);
                if (this.ends.every(end => end[0] !== test[0] || end[1] !== test[1])) {
                    this.ends.push(test);
                    this.findMajorMoves(test, 6 - i);
                }
            }
        }
    }
    itemAt(start, vector) {
        return this.board[start[1] + vector[1]]?.[start[0] + vector[0]];
    }
    move(move) {
        const board = [];
        for (let i = 0; i < 9; i++) {
            board[i] = [...this.board[i]];
        }
        if (move) {
            const start = move[0], end = move[1], temp = board[start[1]][start[0]];
            board[start[1]][start[0]] = 0;
            board[end[1]][end[0]] = temp;
        }
        return new GameNode(board, !this.turn);
    }
}
