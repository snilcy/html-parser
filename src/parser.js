/* eslint-disable node/no-unsupported-features/es-syntax */
import { first, last, lastIndex, updateById } from "@snilcy/cake";
import { Logger, ConsoleDirection } from "@snilcy/logger";

const log = new Logger({
  directions: [
    new ConsoleDirection({
      deep: 5,
      undefined: false,
      excludeKeys: [
        // "parent",
        // "childrens",
        "pos",
        "addChar",
        "toString",
        // "attrs"
      ],
      lineTerminators: true,
    }),
  ],
});

const NodeType = {
  ELEMENT: "ELEMENT",
  TEXT: "TEXT",
};

const ElementPlace = {
  TAG_NAME: "TAG_NAME",
  ATTR_NAME: "ATTR_NAME",
  ATTR_VALUE: "ATTR_VALUE",
};

const C = {
  NEW_LINE: "\n",
  SLASH: "/",
  SLACH_BACK: "\\",
  EQUALS: "=",

  QUOTE_SINGLE: "'",
  QUOTE_DOUBLE: '"',
  QUOTE_BACKTICK: "`",

  BRACKET_ANGLE_OPEN: "<",
  BRACKET_ANGLE_CLOSE: ">",
  BRACKET_ROUND_OPEN: "(",
  BRACKET_ROUND_CLOSE: ")",
  BRACKET_SQUARE_OPEN: "[",
  BRACKET_SQUARE_CLOSE: "]",
  BRACKET_CURLY_OPEN: "{",
  BRACKET_CURLY_CLOSE: "}",
};

const RawContentTags = ["script", "style", "pre"];

const StringStartChars = [C.QUOTE_SINGLE, C.QUOTE_DOUBLE, C.QUOTE_BACKTICK];

const Wrapper = {
  [C.QUOTE_SINGLE]: C.QUOTE_SINGLE,
  [C.QUOTE_DOUBLE]: C.QUOTE_DOUBLE,
  [C.QUOTE_BACKTICK]: C.QUOTE_BACKTICK,
  [C.BRACKET_ROUND_OPEN]: C.BRACKET_ROUND_CLOSE,
  [C.BRACKET_SQUARE_OPEN]: C.BRACKET_SQUARE_CLOSE,
  [C.BRACKET_CURLY_OPEN]: C.BRACKET_CURLY_CLOSE,
  // [Char.BRACKET_ANGLE_OPEN]: Char.BRACKET_ANGLE_CLOSE,
};

const TagToWrappers = {
  script: [C.QUOTE_SINGLE, C.QUOTE_DOUBLE, C.QUOTE_BACKTICK],
  style: [C.QUOTE_SINGLE, C.QUOTE_DOUBLE],
};

class HtmlNode {
  #type = null;

  groupChars = [];
  groups = [];
  inGroup = false;

  #needCloseGroup = false;

  content = "";
  parent = null;
  pos = {
    start: { line: 0, col: 0 },
    end: { line: 0, col: 0 },
  };

  static lastId = 0;

  constructor(startPos, type) {
    this.id = HtmlNode.lastId++;
    this.pos.start = startPos;
    this.#type = type;
  }

  get isElement() {
    return this.#type === NodeType.ELEMENT;
  }

  get isText() {
    return this.#type === NodeType.TEXT;
  }

  get isRoot() {
    return this.id === 0;
  }

  get isNode() {
    return !this.#type;
  }

  get #lastGroup() {
    return last(this.groups) || {};
  }

  get isGroupStarted() {
    const group = this.#lastGroup;
    return Boolean(group.char && !group.content.length);
  }

  get isGroupEnded() {
    return this.#needCloseGroup;
  }

  #needCloseGroupHandler = () => {
    this.#needCloseGroup = false;
  };

  #closeGroupHandler = () => {
    this.#needCloseGroup = true;
    this.inGroup = false;
  };

  #newGroupHandler = (char) => {
    this.inGroup = true;
    this.groups.push({
      char,
      content: "",
    });
  };

  #updateGroupHandler = (char) => {
    updateById(this.groups, lastIndex(this.groups), (group) => ({
      ...group,
      content: group.content + char,
    }));
  };

  addChar(char) {
    const lastGroup = this.#lastGroup;
    this.content += char;

    if (this.#needCloseGroup) {
      return this.#needCloseGroupHandler();
    }

    if (
      this.inGroup &&
      char === lastGroup.char &&
      lastGroup.content[lastGroup.content.length - 2] !== C.SLACH_BACK
    ) {
      return this.#closeGroupHandler();
    }

    if (!this.inGroup && this.groupChars.includes(char)) {
      return this.#newGroupHandler(char);
    }

    if (this.inGroup) {
      return this.#updateGroupHandler(char);
    }
  }
}

class HtmlElement extends HtmlNode {
  #place = ElementPlace.TAG_NAME;
  groupChars = [C.QUOTE_SINGLE, C.QUOTE_DOUBLE];

  tagName = "";
  isCloseTag = false;
  selfClosed = false;
  childrens = [];
  attrsList = [];
  attrs = {};
  closed = false;

  constructor(startPos) {
    super(startPos, NodeType.ELEMENT);
    this.content = "<";
  }

  #updateLastAttr = (callback) => {
    updateById(
      this.attrsList,
      Math.max(lastIndex(this.attrsList), 0),
      ({ name = "", value = "" } = {}) => callback(name, value)
    );
  };

  close = () => {
    if (this.#place === ElementPlace.TAG_NAME) {
      this.#afterTagName();
    }

    this.attrs = this.attrsList.reduce((result, { name, value }) => {
      result[name] = value;
      return result;
    }, {});

    this.content += C.BRACKET_ANGLE_CLOSE;
    this.#place = null;
    this.closed = true;
  };

  addChar = (char) => {
    if (this.closed) {
      return;
    }

    super.addChar(char);
    // log.info(char, this.inGroup);

    if (this.#place === ElementPlace.ATTR_NAME) {
      // attr value
      if (char === C.EQUALS) {
        this.#place = ElementPlace.ATTR_VALUE;
        return;
      }

      // attr without value
      if (char.match(/\s/)) {
        this.#place = null;
        return;
      }

      this.#updateLastAttr((name, value) => ({
        name: name + char,
        value,
      }));
      return;
    }

    if (this.#place === ElementPlace.ATTR_VALUE) {
      if (this.isGroupStarted) {
        return;
      }

      if (this.isGroupEnded) {
        this.#place = null;
        return;
      }

      this.#updateLastAttr((name, value) => ({
        name,
        value: value + char,
      }));

      return;
    }

    if (this.#place === ElementPlace.TAG_NAME) {
      if (char === C.SLASH) {
        this.isCloseTag = true;
        return;
      }

      if (char.match(/[\S]/)) {
        this.tagName += char;
      } else {
        this.#afterTagName();
      }

      return;
    }

    if (char === C.SLASH) {
      this.selfClosed = true;
      return;
    }

    if (char.match(/\S/)) {
      this.#place = ElementPlace.ATTR_NAME;
      this.attrsList.push({
        name: char,
        value: "",
      });
    }
  };

  #afterTagName = () => {
    this.#place = null;

    // log.info(this.tagName, this.content);
  };

  toString = () => {
    const attrs = Object.keys(this.attrs)
      .map((name) => `${name}="${this.attrs[name]}"`)
      .join(" ");

    const content = this.childrens.join("");

    if (this.isRoot) return content;

    if (this.selfClosed)
      return [
        C.BRACKET_ANGLE_OPEN,
        [this.tagName, attrs, C.SLASH + C.BRACKET_ANGLE_CLOSE].join(" "),
      ].join("");

    return [
      C.BRACKET_ANGLE_OPEN,
      [this.tagName, attrs].join(" "),
      C.BRACKET_ANGLE_CLOSE,
      content,
      this.buildClose(),
    ].join("");
  };

  buildClose = () => {
    return [
      C.BRACKET_ANGLE_OPEN,
      C.SLASH,
      this.tagName,
      C.BRACKET_ANGLE_CLOSE,
    ].join("");
  };
}

class HtmlText extends HtmlNode {
  endSeq = null;

  constructor({ startPos, endSeq, tagName } = {}) {
    super(startPos, NodeType.TEXT);

    this.endSeq = endSeq;
    this.groupChars = TagToWrappers[tagName] || [];
  }

  toString() {
    return this.content;
  }
}

class Code {
  lines = [""];

  get col() {
    return last(this.lines).length;
  }

  get line() {
    return this.lines.length || 1;
  }

  get pos() {
    return {
      col: this.col,
      line: this.line,
    };
  }

  addChar = (char) => {
    if (char === C.NEW_LINE) {
      this.newLine();
    } else {
      this.addToLastLine(char);
    }
  };

  newLine = () => {
    this.lines.push("");
  };

  addToLastLine = (char) => {
    updateById(this.lines, lastIndex(this.lines), (line) => line + char);
  };
}

class HtmlParser {
  rawHtml = "";
  nodes = [];

  code = new Code();
  tree = new HtmlElement();
  currentNode = new HtmlNode();

  constructor(rawHtml) {
    this.rawHtml = rawHtml;
    this.parse();
    this.buildTree();
  }

  pushNode = () => {
    this.currentNode.pos.end = this.code.pos;

    if (this.currentNode.isElement) {
      this.currentNode.close();
    }

    this.nodes.push(this.currentNode);
  };

  nodeInGroupHandler = (char) => {
    this.currentNode.addChar(char);
  };

  textNodeWithEndSeqHandler = (char, i) => {
    const { endSeq } = this.currentNode;

    if (
      first(endSeq) === char &&
      last(endSeq) === this.rawHtml[i + endSeq.length - 1] &&
      this.rawHtml.slice(i, i + endSeq.length) === endSeq
    ) {
      this.pushNode();
      this.currentNode = new HtmlElement(this.code.pos);
      return;
    }

    this.currentNode.addChar(char);
  };

  openAngleBracketHandler = () => {
    if (this.currentNode.isText) {
      this.pushNode();
    }

    this.currentNode = new HtmlElement(this.code.pos);
  };

  closeAngleBracketHandler = () => {
    this.pushNode();
    this.#afterTagCloseHandler();
  };

  parse = () => {
    for (let i = 0; i < this.rawHtml.length; i++) {
      const char = this.rawHtml[i];

      this.code.addChar(char);

      if (this.currentNode.inGroup) {
        this.nodeInGroupHandler(char);
        continue;
      }

      if (this.currentNode.endSeq) {
        this.textNodeWithEndSeqHandler(char, i);
        continue;
      }

      if (char === C.BRACKET_ANGLE_OPEN) {
        this.openAngleBracketHandler();
        continue;
      }

      if (char === C.BRACKET_ANGLE_CLOSE) {
        this.closeAngleBracketHandler();
        continue;
      }

      if (this.currentNode.isNode) {
        this.currentNode = new HtmlText(this.code.pos);
      }

      this.currentNode.addChar(char);
    }
  };

  #afterTagCloseHandler = () => {
    const lastNode = last(this.nodes);
    const isOpenRawContentTag =
      !lastNode.isCloseTag && RawContentTags.includes(lastNode.tagName);

    if (isOpenRawContentTag) {
      this.currentNode = new HtmlText({
        startPos: this.code.pos,
        endSeq: [C.BRACKET_ANGLE_OPEN, C.SLASH, lastNode.tagName].join(""),
        tagName: lastNode.tagName,
      });
      return;
    }

    this.currentNode = new HtmlNode();
  };

  buildTree = () => {
    let parentNode = this.tree;

    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      node.parent = parentNode;

      if (node.isText) {
        parentNode.childrens.push(node);
        continue;
      }

      if (node.isCloseTag) {
        if (node.tagName === parentNode.tagName) {
          parentNode = parentNode.parent;
        } else {
          console.error(
            [
              `${node.pos.start.line - 1}: ${
                this.code[node.pos.start.line - 2]
              }`,
              `${node.pos.start.line}: ${this.code[node.pos.start.line - 1]}`,
              [
                " ".repeat(
                  node.pos.start.line.toString().length + node.pos.start.col + 1
                ),
                "^".repeat(node.pos.end.col - node.pos.start.col + 1),
                `(`,
                [node.pos.start.col, node.pos.end.col].join("-"),
                `)`,
              ].join(""),
            ].join("\n")
          );
          throw new Error(`Close tag isnt valid`);
        }
      } else {
        parentNode.childrens.push(node);

        if (!node.selfClosed) {
          parentNode = node;
        }
      }
    }

    if (this.tree.childrens.length > 1) {
      throw new Error("Need root container");
    }
  };

  buildHtml = () => {
    return this.tree.toString();
  };
}

export { HtmlParser };
