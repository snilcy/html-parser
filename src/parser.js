import { last, lastIndex, updateById } from "@snilcy/cake";
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

const Char = {
  NEW_LINE: "\n",
  ANGLE_BRACKET_OPEN: "<",
  ANGLE_BRACKET_CLOSE: ">",
  SLASH: "/",
  SLACH_BACK: "\\",
  EQUALS: "=",
  QUOTE_SINGLE: "'",
  QUOTE_DOUBLE: '"',
};

class HtmlNode {
  content = "";
  parent = null;
  type = null;
  pos = {
    start: { line: 0, col: 0 },
    end: { line: 0, col: 0 },
  };

  static lastId = 0;

  constructor(type) {
    this.id = HtmlNode.lastId++;
    this.setType(type);
  }

  setType(type) {
    this.type = type;
  }

  get isElement() {
    return this.type === NodeType.ELEMENT;
  }

  get isText() {
    return this.type === NodeType.TEXT;
  }

  get isRoot() {
    return this.id === 0;
  }

  addChar = (char) => {
    this.content += char;
  };
}

class HtmlElement extends HtmlNode {
  tagName = "";
  isClose = false;
  selfClosed = false;
  childrens = [];
  place = ElementPlace.TAG_NAME;
  openedQuote = null;
  attrsList = [];
  attrs = {};

  constructor(startPos) {
    super();
    this.type = NodeType.ELEMENT;
    this.pos.start = startPos;
  }

  updateLastAttr = (callback) => {
    updateById(
      this.attrsList,
      Math.max(lastIndex(this.attrsList), 0),
      ({ name = "", value = "" } = {}) => callback(name, value)
    );
  };

  addChar = (char, prevChar) => {
    this.content += char;
    // log.info(this.place, this.content);

    if (this.place === ElementPlace.ATTR_NAME) {
      if (char === Char.EQUALS) {
        this.place = ElementPlace.ATTR_VALUE;
        return;
      }

      this.updateLastAttr((name, value) => ({
        name: name + char,
        value,
      }));
      return;
    }

    if (this.place === ElementPlace.ATTR_VALUE) {
      if (
        (char === Char.QUOTE_SINGLE || char === Char.QUOTE_DOUBLE) &&
        !this.openedQuote
      ) {
        this.openedQuote = char;
        return;
      }

      if (char === this.openedQuote && prevChar !== Char.SLACH_BACK) {
        this.place = null;
        this.openedQuote = null;
        return;
      }

      this.updateLastAttr((name, value) => ({
        name,
        value: value + char,
      }));
      return;
    }

    if (this.place === ElementPlace.TAG_NAME) {
      if (char === Char.SLASH) {
        this.isClose = true;
        return;
      }

      if (char.match(/[\S]/)) {
        this.tagName += char;
      } else {
        this.place = null;
      }
      return;
    }

    if (char.match(/\S/)) {
      this.place = ElementPlace.ATTR_NAME;
      this.attrsList.push({
        name: char,
        value: "",
      });
    }
  };

  toString = () => {
    const attrs = (this.attrs || [])
      .map(({ name, value }) => `${name}="${value}"`)
      .join(" ");

    const content = this.childrens.join("");

    if (this.isRoot) return content;

    if (this.selfClosed)
      return ["<", [this.tagName, attrs, "/>"].join(" ")].join("");

    return [
      "<",
      [this.tagName, attrs].join(" "),
      ">",
      content,
      "</",
      this.tagName,
      ">",
    ].join("");
  };
}

class HtmlText extends HtmlNode {
  constructor() {
    super();
    this.type = NodeType.TEXT;
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
    if (char === Char.NEW_LINE) {
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
  code = new Code();
  rawHtml = "";
  nodes = [];
  tree = new HtmlElement();

  currentNode = new HtmlNode();

  constructor(rawHtml) {
    this.rawHtml = rawHtml;
    this.parse();
    // this.parseRawToNodes();
    // this.buildTree();
  }

  pushNode = () => {
    log.info("pushNode", this.currentNode.type, this.currentNode.content);
    this.currentNode.pos.end = this.code.pos;
    this.nodes.push(this.currentNode);
  };

  parse = () => {
    for (let i = 0; i < this.rawHtml.length; i++) {
      const char = this.rawHtml[i];
      const prevChar = this.rawHtml[i - 1];
      const nextChar = this.rawHtml[i + 1];

      this.code.addChar(char);

      // in attr
      if (this.currentNode.isElement && this.currentNode.openedQuote) {
        this.currentNode.addChar(char, prevChar);
        continue;
      }

      // open tag
      if (char === Char.ANGLE_BRACKET_OPEN) {
        if (this.currentNode.isText) {
          this.pushNode();
        }

        this.currentNode = new HtmlElement(this.code.pos);
        continue;
      }

      // selfClosed
      if (char === Char.SLASH && nextChar === Char.ANGLE_BRACKET_CLOSE) {
        this.currentNode.selfClosed = true;
        continue;
      }

      // close tag
      if (char === Char.ANGLE_BRACKET_CLOSE) {
        this.pushNode();
        this.currentNode = new HtmlNode();
        continue;
      }

      if (!this.currentNode.type) {
        this.currentNode = new HtmlText(this.code.pos);
      }

      this.currentNode.addChar(char);
    }
  };

  buildTree = () => {
    let parentNode = this.tree;

    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      node.parent = parentNode;

      if (node.type === NodeType.TEXT) {
        parentNode.childrens.push(node);
        continue;
      }

      if (node.isClose) {
        if (node.tag === parentNode.tagName) {
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
}

export { HtmlParser };
