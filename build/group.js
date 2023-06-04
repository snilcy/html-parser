import { logger } from "./logger.js";
import { CharGroups, CharGroupChildrens, StartChartToGroup } from "./const.js";
const log = logger.ns("GroupBuiler");
class Group {
    content = "";
    // eslint-disable-next-line no-use-before-define
    childrens = [];
    parent = null;
    chars = CharGroups.EMPTY;
    closed = false;
    childrenGroups = [];
    constructor(chars = CharGroups.EMPTY) {
        this.chars = chars;
        this.childrenGroups = CharGroupChildrens.get(chars) || [];
    }
    get isEmpty() {
        return this.chars === CharGroups.EMPTY && !this.content.length;
    }
    get openChar() {
        return this.chars[0];
    }
    get closeChar() {
        return this.chars[1];
    }
    inChildren(char) {
        return this.closeChar && this.closeChar;
    }
    addChar(char) { }
}
export class GroupBuilder {
    tree = new Group();
    raw = "";
    head = this.tree;
    constructor(raw) {
        this.raw = raw;
        this.parse();
        log.debug("StartChartToGroup", StartChartToGroup);
    }
    getCharGroup(char, i) {
        if (!char) {
            return;
        }
        const len = char.length;
        const lenGroup = StartChartToGroup[len];
        if (len === 1) {
            return lenGroup[char];
        }
        if (len === 2) {
            return lenGroup[char + this.raw[i + 1]];
        }
        return lenGroup;
    }
    parse() {
        log.debug("parse", this.raw);
        for (let i = 0; i < this.raw.length; i++) {
            const char = this.raw[i];
            // log.debug(char);
            // log.debug(char, this.getCharGroup(char, i));
            // if (this.head.isEmpty) {
            //   // s;
            // }
            const newGroup = this.head.addChar(char);
            if (newGroup) {
                this.head = newGroup;
            }
            if (this.head.closed) {
                const nextGroup = new Group();
                if (this.head.parent) {
                    this.head.parent.childrens.push(nextGroup);
                }
                this.head = nextGroup;
            }
        }
    }
}
