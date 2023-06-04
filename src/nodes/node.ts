import { last, lastIndex, updateById } from "@snilcy/cake";
import type { IGroup, ICodePosition, ICodeRange } from "../types.js";
import { Char, NodeType } from "../const.js";
import { HtmlElement } from "./element.js";
import { HtmlText } from "./text.js";

class HtmlNode {
  static lastId = 0;

  public id: number;
  public groups: IGroup[] = [];
  public inGroup = false;
  public content = "";
  // eslint-disable-next-line no-use-before-define
  public parent: HtmlElement | null = null;
  public pos: ICodeRange = {
    start: { line: 0, col: 0 },
    end: { line: 0, col: 0 },
  };

  protected groupChars: string[] = [];

  private type: NodeType;
  private needCloseGroup = false;

  constructor(
    startPos: ICodePosition = { col: 0, line: 0 },
    type: NodeType = NodeType.EMPTY
  ) {
    this.id = HtmlNode.lastId++;
    this.pos.start = startPos;
    this.type = type;
  }

  public isElement(): this is HtmlElement {
    return this.type === NodeType.ELEMENT;
  }

  public isText(): this is HtmlText {
    return this.type === NodeType.TEXT;
  }

  public get isRoot() {
    return this.id === 0;
  }

  public get isNode() {
    return this.type === NodeType.EMPTY;
  }

  public get isGroupStarted() {
    const group = this.lastGroup;
    return Boolean(group.char && !group.content.length);
  }

  public get isGroupEnded() {
    return this.needCloseGroup;
  }

  public addChar(char: string) {
    const lastGroup = this.lastGroup;
    this.content += char;

    if (this.needCloseGroup) {
      return this.needCloseGroupHandler();
    }

    if (
      this.inGroup &&
      char === lastGroup.char &&
      lastGroup.content[lastGroup.content.length - 2] !== Char.SLACH_BACK
    ) {
      return this.closeGroupHandler();
    }

    if (!this.inGroup && this.groupChars.includes(char)) {
      return this.newGroupHandler(char);
    }

    if (this.inGroup) {
      return this.updateGroupHandler(char);
    }
  }

  private get lastGroup() {
    return last(this.groups) || ({} as IGroup);
  }

  private needCloseGroupHandler = () => {
    this.needCloseGroup = false;
  };

  private closeGroupHandler = () => {
    this.needCloseGroup = true;
    this.inGroup = false;
  };

  private newGroupHandler = (char: string) => {
    this.inGroup = true;
    this.groups.push({
      char,
      content: "",
    });
  };

  private updateGroupHandler = (char: string) => {
    updateById(this.groups, lastIndex(this.groups), (group: IGroup) => ({
      ...group,
      content: group.content + char,
    }));
  };
}

export { HtmlNode };
