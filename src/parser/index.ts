import { logger as log } from "../logger.js";
import { Char } from "../const.js";
import { CharToGroup } from "./const.js";
import {
  ICharGroupName,
  ICharGroupConfig,
  ICharToGroupSection,
  ICharGroupMatch,
} from "./types.js";
import { Node } from "./node.js";
import { Container } from "./container.js";
import { Group } from "./group.js";
import { Text } from "./text.js";

export class Parser {
  public tree = new Container(null as unknown as Container);
  public nodes: Node[] = [this.tree];

  private head: Node = this.tree;
  private i = 0;

  constructor(public raw: string, public config: ICharGroupConfig) {
    this.parse();
  }

  public isRoot(target: Node) {
    return !target.parent;
  }

  public isText(target: Node): target is Text {
    return target instanceof Text;
  }

  public isGroup(target: Node): target is Group {
    return target instanceof Group;
  }

  public isContainer(target: Node): target is Container {
    return target instanceof Container;
  }

  private get prevChar() {
    return this.raw[this.i - 1];
  }

  private get char() {
    return this.raw[this.i];
  }

  private closeGroup(group: Group) {
    group.closed = true;

    this.shiftIterator(group.closeChars);
    this.head = group.parent;
  }

  private closeGroupHandler(): boolean {
    const groups = this.getGroupNameMatchs(CharToGroup.close);
    if (!groups.length) return false;

    const parent = this.isText(this.head) ? this.head.parent : this.head;

    // log.info("closeGroupHandler", this.char, groups, parent);
    if (this.isGroup(parent) && groups.matchs[parent.groupName]) {
      this.closeGroup(parent);
      return true;
    }

    return false;
  }

  private shiftIterator(group: string) {
    this.i += group.length - 1;
  }

  private getGroupNameMatchs(list?: ICharToGroupSection) {
    let i = this.i;
    let char = this.char;
    const withEscape = this.prevChar === Char.SLACH_BACK;

    const result: ICharGroupMatch = {
      matchs: {},
      length: 0,
    };

    if (withEscape) {
      return result;
    }

    while (list && list[char]) {
      const groupName = list[char].groupName;

      if (groupName) {
        result.matchs[groupName] = true;
        result.longest =
          groupName.length > (result.longest || "").length
            ? groupName
            : result.longest;
        result.length++;
      }
      list = list[char].inner;
      char = this.raw[++i];
    }

    return result;
  }

  private openGroup(groupName: ICharGroupName) {
    const parent = this.isText(this.head) ? this.head.parent : this.head;

    if (!this.isContainer(parent)) return;

    const groupConfig = this.config.groups[groupName];
    const group = new Group(parent, groupName, groupConfig);

    parent.childrens.push(group);
    group.parent = parent;

    this.shiftIterator(group.openChars);
    this.head = group;
    this.nodes.push(group);
  }

  private openGroupHandler(): boolean {
    const groups = this.getGroupNameMatchs(CharToGroup.open);

    if (!groups.longest) return false;

    const parent = this.isText(this.head) ? this.head.parent : this.head;

    if (this.isGroup(parent)) {
      if (parent.includes(groups.longest)) {
        this.openGroup(groups.longest);
        return true;
      } else {
        return false;
      }
    }

    if (this.isRoot(parent)) {
      if (this.config.root[groups.longest]) {
        this.openGroup(groups.longest);
        return true;
      }
    }

    return false;
  }

  private textHandler() {
    if (this.isContainer(this.head)) {
      const parent = this.head;
      const text = new Text(parent);

      parent.childrens.push(text);

      this.nodes.push(text);
      this.head = text;
    }

    if (this.isText(this.head)) {
      this.head.addChar(this.char);
    }
  }

  private listHandler(): boolean {
    if (this.isGroup(this.head)) {
      log.info(this.head.groupName, this.char);
    }

    return false;
  }

  private parse() {
    for (this.i = 0; this.i < this.raw.length; this.i++) {
      if (this.closeGroupHandler()) continue;
      if (this.openGroupHandler()) continue;
      if (this.listHandler()) continue;

      this.textHandler();
    }
  }
}
