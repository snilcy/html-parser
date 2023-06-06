// console.clear();
import fs from "node:fs";
import path from "node:path";
// import { HtmlParser } from "../build/parser.js";
import { logger } from "../build/logger.js";
import { Parser } from "../build/parser.js";
import { CharGroupName } from "../build/const.js";
import { config } from "../build/html.js";

const log = logger.ns("R", {
  console: {
    lineTerminators: true,
    // length: true
  },
});

const htmlPath = path.resolve(process.cwd(), "test/index.html");
const rawhtml = fs.readFileSync(htmlPath, "utf-8");

// const parser = new HtmlParser(rawhtml);

const c = {
  root: [CharGroupName.BRACKET_CURLY_DOUBLE, CharGroupName.BRACKET_CURLY],
  groups: [
    {
      group: CharGroupName.BRACKET_CURLY,
      inner: [CharGroupName.TEXT],
    },
    {
      group: CharGroupName.BRACKET_CURLY_DOUBLE,
      inner: [CharGroupName.TEXT],
    },
  ],
};

const gruopBuilder = new Parser(rawhtml, config);
log.info(gruopBuilder.tree);
// log.info(gruopBuilder.nodes);

// log.info("rawHtml", parser.rawHtml);
// log.info(parser.nodes.map((node) => node.content));
// rlog.info("nodes", parser.tree.childrens[0]);
// rlog.info("nodes", parser.tree.childrens[0].childrens[1].childrens[0]);
// log.info(parser.nodes);
// rlog.info("tree", parser.tree.childrens);
// rlog.info(parser.buildHtml());
