import { Logger } from "@snilcy/logger";

const logger = new Logger("Root", {
  console: {
    deep: 5,
    undefined: false,
    excludeKeys: [
      "parent",
      "childrens",
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
      "closeGroupHandler",
      "updateGroupHandler",
      "endSeq",
      "afterTagName",
      "place",
      "newGroupHandler",
      "needCloseGroupHandler",
      "needCloseGroup",
      "inGroup",
      "attrsList",
    ],
    lineTerminators: true,
  },
});

export { logger };
