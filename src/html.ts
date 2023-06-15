import { Char } from "./const.js";
import { CharGroupName } from "./parser/const.js";
import { ICharGroupConfig } from "./parser/types.js";

const htmlConfig = {
  entities: {
    NodeList: {
      type: "list",
      value: {
        [CharGroupName.BRACKET_ANGLE]: true,
        [CharGroupName.QUOTE_SINGLE]: true,
        [CharGroupName.QUOTE_DOUBLE]: true,
        [CharGroupName.QUOTE_BACKTICK]: true,
      },
    },
    NodeAttr: {
      type: "map",
      value: {
        [CharGroupName.QUOTE_SINGLE]: true,
        [CharGroupName.QUOTE_DOUBLE]: true,
      },
    },
    Node: {
      group: CharGroupName.BRACKET_ANGLE,
      delimetr: Char.SPACE,
      type: "list",
    },
  },
  root: "NodeList",
};

const cssConfig = {
  entities: {
    Props: {
      type: "list",
      value: {
        [CharGroupName.BRACKET_CURLY]: true,
        TEXT: true,
      },
    },
    Value: {
      type: "list",
      delimetr: {
        [Char.SPACE]: "WORD",
      },
      value: {
        [CharGroupName.QUOTE_SINGLE]: true,
        [CharGroupName.QUOTE_DOUBLE]: true,
      },
    },
    Prop: {
      type: "map",
      delimetr: Char.COLON,
      value: {},
    },
    [CharGroupName.BRACKET_CURLY]: {
      type: "list",
      value: {
        [Char.SEMICOLON]: "Prop",
      },
    },
  },
  root: "Props",
};

export const config: ICharGroupConfig = {
  root: {
    [CharGroupName.BRACKET_ANGLE]: true,
    [CharGroupName.BRACKET_CURLY_DOUBLE]: true,
  },
  groups: {
    [CharGroupName.BRACKET_ANGLE]: {
      includes: {
        [CharGroupName.QUOTE_SINGLE]: true,
        [CharGroupName.QUOTE_DOUBLE]: true,
      },
      list: {
        [Char.SPACE]: {
          [Char.EQUALS]: true,
        },
      },
    },
    [CharGroupName.BRACKET_CURLY_DOUBLE]: {
      // [CharGroupName.BRACKET_CURLY]: true,
    },
  },
};
