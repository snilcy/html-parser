import fs from "node:fs";
import path from "node:path";
// import { HtmlParser } from "../build/parser.js";
import { logger } from "../build/logger.js";
import { GroupBuilder } from "../build/group.js";

const log = logger.ns("R");

const htmlPath = path.resolve(process.cwd(), "test/index.html");
const rawhtml = fs.readFileSync(htmlPath, "utf-8");

console.clear();

// const parser = new HtmlParser(rawhtml);

const gruopBuilder = new GroupBuilder(rawhtml);
log.info("rawHtml", gruopBuilder.tree);

// log.info("rawHtml", parser.rawHtml);
// log.info(parser.nodes.map((node) => node.content));
// rlog.info("nodes", parser.tree.childrens[0]);
// rlog.info("nodes", parser.tree.childrens[0].childrens[1].childrens[0]);
// log.info(parser.nodes);
// rlog.info("tree", parser.tree.childrens);
// rlog.info(parser.buildHtml());
