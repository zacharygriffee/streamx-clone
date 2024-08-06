import {Readable} from "streamx";
import {test} from "brittle";
import {clone} from "./index.js";

test("ReadableStreamClone", async (t) => {
    t.plan(1);
    const messages = ["Hello, ", "World!"];
    const readable = new Readable({
        read(cb) {
            let msg;
            while (msg = messages.shift()) {
                this.push(msg);
            }
            this.push(null);
            cb();
        },
    });

    const cloneStream = clone(readable);

    let data = "";
    cloneStream.on("data", (chunk) => {
        data += chunk.toString();
    });

    cloneStream.once("end", () => {
        t.is(data, "Hello, World!");
    });

    cloneStream.once("error", (err) => {
        t.fail(err);
    });
});

// test 3 clones of the same readable stream

test("ReadableStreamClone 3 clones", async (t) => {
    t.plan(3);
    const messages = ["Hello, ", "World!"];
    const record = {};
    const readable = new Readable({
        read(cb) {
            let msg;
            while (msg = messages.shift()) {
                this.push(msg);
            }
            this.push(null);
            cb();
        },
    });

    const r1 = clone(readable);
    const r2 = clone(readable);
    const r3 = clone(readable);

    r1.on("data", onData.bind(null, "r1"));
    r2.on("data", onData.bind(null, "r2"));
    r3.on("data", onData.bind(null, "r3"));

    r1.once("end", onEnd.bind(null, "r1"));
    r2.once("end", onEnd.bind(null, "r2"));
    r3.once("end", onEnd.bind(null, "r3"));

    r1.once("error", e => t.fail());
    r2.once("error", e => t.fail());
    r3.once("error", e => t.fail());

    function onData(id, data) {
        if (!record[id]) {record[id] = ""}
        record[id] += data.toString();
    }

    function onEnd(id) {
        t.is(record[id], "Hello, World!");
    }
});

