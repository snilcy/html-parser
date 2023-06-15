export class Node {
    parent;
    id;
    constructor(parent) {
        this.parent = parent;
        this.id = Node.lastId++;
    }
    static lastId = 0;
}
//# sourceMappingURL=node.js.map