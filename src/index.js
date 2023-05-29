import fs from "node:fs";
import path from "node:path";
import { HtmlParser } from "./parser.js";
import { Logger, ConsoleDirection } from "@snilcy/logger";

const log = new Logger({
  directions: [
    new ConsoleDirection({
      deep: 5,
      undefined: false,
      excludeKeys: [
        "parent",
        // "childrens",
        "pos",
        "addChar",
        "toString",
        "buildClose",
        "close",
        "closed",
        "id",
        "selfClosed",
        "isCloseTag",
        "updateLastAttr",
        // "attrs"
      ],
      lineTerminators: true,
    }),
  ],
});

const rlog = log.ns("Root");

const htmlPath = path.resolve(process.cwd(), "src/index.html");
const rawhtml = fs.readFileSync(htmlPath, "utf-8");

console.clear();

const parser = new HtmlParser(rawhtml);

rlog.info("rawHtml", parser.rawHtml);
rlog.info(parser.nodes.map((node) => node.content));
// rlog.info("nodes", parser.tree.childrens[0]);
// rlog.info("nodes", parser.tree.childrens[0].childrens[1].childrens[0]);
rlog.info(parser.nodes);
// rlog.info("tree", parser.tree.childrens);
// rlog.info(parser.buildHtml());
