/**
 * Modified from timeLockPuzzleSolver.ts from Roblox.com
 */
import bigInt  from 'big-integer';

const PROGRESS_RESOLUTION = 1000;
const DEFAULT_YIELD_AFTER_ITERATIONS = 200;

export class TimeLockPuzzleSolver {
    n //: BigInteger;
    a //: BigInteger;
    t //: number;

    curBase //: BigInteger;
    curT //: number;

    isCancelled //: boolean;

    constructor(params) {
        this.n = bigInt(params.N);
        this.a = bigInt(params.A);
        this.t = params.T;

        this.curBase = this.a;
        this.curT = 0;

        this.isCancelled = false;
    }

    run(inProgressCallback, answerCallback) {
        const batchSize = Math.max(1, this.t / PROGRESS_RESOLUTION);
        while (!this.isDone()) {
            this.doRepeatedSquaring(batchSize);
            inProgressCallback(this.progress());
        }
        answerCallback(this.answer());
    }

    runAsync(
        inProgressCallback,
        answerCallback,
        yieldAfterIterations
    ) {
        const runIterations = () => {
            this.doRepeatedSquaring(yieldAfterIterations || DEFAULT_YIELD_AFTER_ITERATIONS);
            inProgressCallback(this.progress());
            if (this.isCancelled) return;
            if (this.isDone()) {
                answerCallback(this.answer());
            } else {
                setTimeout(runIterations, 0);
            }
        };
        setTimeout(runIterations, 0)
    }

    cancelRunAsync() {
        this.isCancelled = true;
    }

    doRepeatedSquaring(iterations) {
        const targetT =
            typeof iterations !== 'undefined' ? Math.min(this.t, this.curT + iterations) : this.t;
        for (; this.curT < targetT; this.curT += 1) {
            this.curBase = this.curBase.square().mod(this.n);
        }
    }

    answer() {
        if (!this.isDone()) return null;
        return this.curBase.toString();
    }

    progress() {
        return this.curT / this.t;
    }

    isDone() {
        return this.curT === this.t;
    }
}
