// import "source-map-support/register.js";
import fs from "node:fs";
import path from "node:path";
import { logger } from "../build/logger.js";

import { Parser } from "../build/parser/index.js";
import { config } from "../build/html.js";

const log = logger.ns("R", {
  console: {
    lineTerminators: true,
    // length: true
  },
});

const htmlPath = path.resolve(process.cwd(), "test/index.html");
const rawhtml = fs.readFileSync(htmlPath, "utf-8");

const parser = new Parser(rawhtml, config);

log.info(parser.tree.childrens[0]);
// log.info(gruopBuilder.nodes);
