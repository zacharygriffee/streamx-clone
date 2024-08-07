# streamx-clone

Clone the readable component of a streamx stream.
## Installation

```sh
npm install streamx-clone --save
```

## Example

``` ecmascript 6
import { clone } from "streamx-clone";
import { Readable } from "streamx";

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
    data === "Hello, World!";
});

```
---

Distributed under the MIT license. See ``LICENSE`` for more information.



