export class Queue {

    private running = false;
    private queue: Function[] = [];

    private next() {
        this.running = false;

        const shift = this.queue.shift();
        if(shift) {
            this.running = true;
            shift();
        }
    }

    add(callback: Function) {
        const _this = this;

        this.queue.push(function() {
            const finished = callback();
            if(typeof finished === "undefined" || finished) _this.next();
        });

        if(!this.running) this.next();
    }
};