import { CharGroupName } from "./const.js";
import { ICharGroupConfig } from "./types.js";

export const config: ICharGroupConfig = {
  root: {
    [CharGroupName.BRACKET_ANGLE]: true,
    [CharGroupName.BRACKET_CURLY_DOUBLE]: true,
    // [CharGroupName.BRACKET_CURLY]: true,
  },
  groups: {
    [CharGroupName.BRACKET_ANGLE]: {
      [CharGroupName.TEXT]: true,
      [CharGroupName.QUOTE_SINGLE]: true,
      [CharGroupName.QUOTE_DOUBLE]: true,
    },
    [CharGroupName.BRACKET_CURLY_DOUBLE]: {
      // [CharGroupName.BRACKET_CURLY]: true,
    },
  },
};
