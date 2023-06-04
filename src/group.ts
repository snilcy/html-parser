import { logger } from "./logger.js";
import { CharGroups, CharGroupChildrens, StartChartToGroup } from "./const.js";
import { ICharGroups, ICharGroup } from "./types.js";

const log = logger.ns("GroupBuiler");

class Group {
  public content = "";
  // eslint-disable-next-line no-use-before-define
  public childrens: Group[] = [];
  public parent: Group | null = null;
  public chars = CharGroups.EMPTY;
  public closed = false;

  private childrenGroups: ICharGroup[] = [];

  constructor(chars: ICharGroup = CharGroups.EMPTY) {
    this.chars = chars;
    this.childrenGroups = CharGroupChildrens.get(chars) || [];
  }

  public get isEmpty() {
    return this.chars === CharGroups.EMPTY && !this.content.length;
  }

  private get openChar() {
    return this.chars[0];
  }

  private get closeChar() {
    return this.chars[1];
  }

  inChildren(char: string) {
    return this.closeChar && this.closeChar;
  }

  addChar(char: string): Group | undefined {}
}

export class GroupBuilder {
  public tree = new Group();
  public raw = "";

  private head = this.tree;

  constructor(raw: string) {
    this.raw = raw;
    this.parse();
    log.debug("StartChartToGroup", StartChartToGroup);
  }

  private getCharGroup(char: string, i: number) {
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

  private parse() {
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
