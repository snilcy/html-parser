import { Node } from "./node.js";
export class List extends Node {
    delimetr;
    items = [];
    constructor(parent, delimetr) {
        super(parent);
        this.delimetr = delimetr;
    }
}
//# sourceMappingURL=list.js.map