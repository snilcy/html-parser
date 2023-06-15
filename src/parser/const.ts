import { Char } from "../const.js";
import {
  ICharGroupName,
  ICharGroups,
  ICharToGroup,
  ICharToGroupSection,
} from "./types.js";

export const CharGroupName = {
  TEXT: "t",
  QUOTE_SINGLE: Char.QUOTE_SINGLE,
  QUOTE_DOUBLE: Char.QUOTE_DOUBLE,
  QUOTE_BACKTICK: Char.QUOTE_BACKTICK,
  BRACKET_ROUND: Char.BRACKET_ROUND_OPEN + Char.BRACKET_ROUND_CLOSE,
  BRACKET_SQUARE: Char.BRACKET_SQUARE_OPEN + Char.BRACKET_SQUARE_CLOSE,
  BRACKET_CURLY: Char.BRACKET_CURLY_OPEN + Char.BRACKET_CURLY_CLOSE,
  BRACKET_CURLY_DOUBLE:
    Char.BRACKET_CURLY_OPEN_DOUBLE + Char.BRACKET_CURLY_CLOSE_DOUBLE,
  BRACKET_ANGLE: Char.BRACKET_ANGLE_OPEN + Char.BRACKET_ANGLE_CLOSE,
};

export const CharGroups: ICharGroups = {
  // [CharGroupName.TEXT]: ["", ""],
  [CharGroupName.QUOTE_SINGLE]: [Char.QUOTE_SINGLE, Char.QUOTE_SINGLE],
  [CharGroupName.QUOTE_DOUBLE]: [Char.QUOTE_DOUBLE, Char.QUOTE_DOUBLE],
  [CharGroupName.QUOTE_BACKTICK]: [Char.QUOTE_BACKTICK, Char.QUOTE_BACKTICK],
  [CharGroupName.BRACKET_ROUND]: [
    Char.BRACKET_ROUND_OPEN,
    Char.BRACKET_ROUND_CLOSE,
  ],
  [CharGroupName.BRACKET_SQUARE]: [
    Char.BRACKET_SQUARE_OPEN,
    Char.BRACKET_SQUARE_CLOSE,
  ],
  [CharGroupName.BRACKET_CURLY]: [
    Char.BRACKET_CURLY_OPEN,
    Char.BRACKET_CURLY_CLOSE,
  ],
  [CharGroupName.BRACKET_CURLY_DOUBLE]: [
    Char.BRACKET_CURLY_OPEN_DOUBLE,
    Char.BRACKET_CURLY_CLOSE_DOUBLE,
  ],
  [CharGroupName.BRACKET_ANGLE]: [
    Char.BRACKET_ANGLE_OPEN,
    Char.BRACKET_ANGLE_CLOSE,
  ],
};

const reduceChars = (
  str: string,
  groupName: ICharGroupName,
  result: ICharToGroupSection
) =>
  [...str].reduce((resultPart, char, id) => {
    const isLastChar = id + 1 === str.length;
    const section = resultPart[char] || {};
    resultPart[char] = section;

    if (isLastChar) {
      section.groupName = groupName;
      return resultPart;
    } else {
      section.inner = section.inner || {};
      return section.inner;
    }
  }, result);

export const CharToGroup = Object.entries(CharGroups).reduce(
  (result: ICharToGroup, [groupName, [openChars, closeChars]]) => {
    reduceChars(openChars, groupName, result.open);
    reduceChars(closeChars, groupName, result.close);
    return result;
  },
  {
    open: {},
    close: {},
  }
);
