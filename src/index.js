import fs from "node:fs";
import path from "node:path";
import { Logger, ConsoleDirection } from "@snilcy/logger";
import { last, lastIndex, updateById } from "@snilcy/cake";

// TODO: Add self close tags

const log = new Logger({
  directions: [
    new ConsoleDirection({
      deep: 5,
      undefined: false,
      excludeKeys: [
        "parent",
        "childrens",
        "pos",
        // "attrs"
      ],
      // lineTerminators: true,
    }),
  ],
});

const rlog = log.ns("Root");

const htmlPath = path.resolve(process.cwd(), "src/index.html");
const rawhtml = fs.readFileSync(htmlPath, "utf-8");

console.clear();

const NodeType = {
  ELEMENT: "ELEMENT",
  TEXT: "TEXT",
  ROOT: "ROOT",
};

const NodePlace = {
  TAG: "TAG",
  ATTR_NAME: "ATTR_NAME",
  ATTR_VALUE: "ATTR_VALUE",
};

let nodeId = 0;
const getNode = () => ({
  id: nodeId++,
  childrens: [],
  attrs: [],
  content: "",
  tag: "",
  parent: null,
  type: null,
  isClose: false,
  selfClosed: false,
  pos: {
    start: { line: 0, col: 0 },
    end: { line: 0, col: 0 },
  },
});

class HtmlTree {
  lines = [""];
  rawHtml = "";
  nodes = [];
  tree = getNode();

  currentNode = getNode();
  nodePlace = null;
  attrsList = [];
  attrQuote = null;

  constructor(rawHtml) {
    this.tree.type = NodeType.ROOT;
    this.rawHtml = rawHtml;
    this.parseRawToNodes();
    this.buildTree();
  }

  pushNode = () => {
    if (this.currentNode.type === NodeType.TEXT) {
      delete this.currentNode.childrens;
      delete this.currentNode.tag;
      delete this.currentNode.attrs;
    } else {
      this.currentNode.attrs = this.attrsList;
    }

    this.attrsList = [];
    this.nodes.push(this.currentNode);
    this.currentNode = getNode();
  };

  parseRawToNodes = () => {
    for (let i = 0; i < this.rawHtml.length; i++) {
      const sym = this.rawHtml[i];
      const prevSym = this.rawHtml[i - 1];
      const nextSym = this.rawHtml[i + 1];

      if (sym === "\n") {
        this.lines.push("");
      } else {
        updateById(this.lines, lastIndex(this.lines), (line) => line + sym);
      }

      if (this.nodePlace !== NodePlace.ATTR_VALUE) {
        if (sym === "<") {
          if (this.currentNode.type === NodeType.TEXT) {
            const nodeCol = last(this.lines).length - 1;
            const nodeLine =
              nodeCol < 1 ? this.lines.length - 1 : this.lines.length;
            this.currentNode.pos.end = {
              col: Math.max(this.lines[nodeLine - 1].length - 1, 1),
              line: nodeLine,
            };
            this.pushNode();
          }

          this.nodePlace = NodePlace.TAG;
          this.currentNode.type = NodeType.ELEMENT;
          this.currentNode.pos.start = {
            col: last(this.lines).length,
            line: this.lines.length,
          };
          continue;
        }

        if (sym === "/" && nextSym === ">") {
          this.currentNode.selfClosed = true;
          this.currentNode.pos.end = {
            col: last(this.lines).length,
            line: this.lines.length,
          };
          this.pushNode();
          i++;
          continue;
        }

        if (sym === ">") {
          this.currentNode.pos.end = {
            col: last(this.lines).length,
            line: this.lines.length,
          };
          this.pushNode();
          continue;
        }
      }

      if (this.currentNode.type === NodeType.ELEMENT) {
        this.currentNode.content += sym;

        if (this.nodePlace === NodePlace.ATTR_NAME) {
          if (sym === "=") {
            this.nodePlace = NodePlace.ATTR_VALUE;
            continue;
          }

          if (sym.match(/[\s]/)) {
            this.nodePlace = null;
            continue;
          }

          updateById(
            this.attrsList,
            Math.max(lastIndex(this.attrsList), 0),
            ({ name = "", value = "" } = {}) => ({
              name: name + sym,
              value,
            })
          );
          continue;
        }

        if (this.nodePlace === NodePlace.ATTR_VALUE) {
          if ((sym === "'" || sym === '"') && !this.attrQuote) {
            this.attrQuote = sym;
            continue;
          }

          if (sym === this.attrQuote && prevSym !== "\\") {
            this.nodePlace = null;
            this.attrQuote = null;
            continue;
          }

          updateById(
            this.attrsList,
            Math.max(lastIndex(this.attrsList), 0),
            ({ name = "", value = "" } = {}) => ({
              name,
              value: value + sym,
            })
          );
          continue;
        }

        if (this.nodePlace === NodePlace.TAG) {
          if (sym === "/") {
            this.currentNode.isClose = true;
            continue;
          }

          if (sym.match(/[\S]/)) {
            this.currentNode.tag += sym;
          } else {
            this.nodePlace = null;
          }
          continue;
        }

        if (sym.match(/\S/)) {
          this.nodePlace = NodePlace.ATTR_NAME;
          this.attrsList.push({
            name: sym,
            value: "",
          });
          continue;
        }

        continue;
      }

      if (this.currentNode.type !== NodeType.TEXT) {
        this.currentNode.type = NodeType.TEXT;
        this.currentNode.pos.start = {
          col: Math.max(last(this.lines).length, 1),
          line: this.lines.length,
        };
      }

      this.currentNode.content += sym;
    }
  };

  buildHtml = (node = this.tree) => {
    if (node.type === NodeType.TEXT) return node.content;
    const attrs = (node.attrs || [])
      .map(({ name, value }) => `${name}="${value}"`)
      .join(" ");
    const content = node.childrens.map(this.buildHtml).join("");

    if (node.type === NodeType.ROOT) return content;

    if (node.selfClosed)
      return ["<", [node.tag, attrs, "/>"].join(" ")].join("");

    return [
      "<",
      [node.tag, attrs].join(" "),
      ">",
      content,
      "</",
      node.tag,
      ">",
    ].join("");
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
        if (node.tag === parentNode.tag) {
          parentNode = parentNode.parent;
        } else {
          console.error(
            [
              `${node.pos.start.line - 1}: ${
                this.lines[node.pos.start.line - 2]
              }`,
              `${node.pos.start.line}: ${this.lines[node.pos.start.line - 1]}`,
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

const htmlTree = new HtmlTree(rawhtml);

rlog.info(htmlTree.rawHtml);
// rlog.info(htmlTree.nodes);
rlog.info(htmlTree.buildHtml());
