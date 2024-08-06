import { Readable } from "streamx";

// This class wraps a Readable stream and clones it, allowing it to be consumed multiple times
export function clone(stream, options) {
    return new (class ReadableClone extends Readable {
        constructor(readable, options) {
            super(options);
            readable.on('data', (chunk) => {
                this.push(chunk);
            });

            readable.on('end', () => {
                this.push(null);
            });

            readable.on('error', (err) => {
                this.emit('error', err);
            });
        }
    })(stream, options);
}