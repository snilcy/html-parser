import { Logger } from "@snilcy/logger";

const logger = new Logger("", {
  console: {
    deep: 8,
    undefined: false,
    excludeKeys: [
      // "chars",
      // // "groupName",
      "id",
      "deep",
      "includes",
      // "closed",
      // "content",
      "parent",
      // // "childrens",
      // "pos",
      // "addChar",
      // "toString",
      // "buildClose",
      // "close",
      // "closed",
      // // "id",
      // "selfClosed",
      // "isCloseTag",
      // "updateLastAttr",
      // "closeGroupHandler",
      // "updateGroupHandler",
      // "endSeq",
      // "afterTagName",
      // "place",
      // "newGroupHandler",
      // "needCloseGroupHandler",
      // "needCloseGroup",
      // "inGroup",
      // "attrsList",
    ],
    lineTerminators: true,
  },
});

export { logger };
