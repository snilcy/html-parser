import { CharGroupName } from "./const.js";
import { IGroupsConfig } from "./types.js";

export const config: IGroupsConfig = {
  root: {
    [CharGroupName.TEXT]: true,
    [CharGroupName.BRACKET_ANGLE]: true,
  },
  groups: {
    [CharGroupName.TEXT]: {
      [CharGroupName.BRACKET_CURLY_DOUBLE]: true,
      [CharGroupName.QUOTE_SINGLE]: true,
      [CharGroupName.QUOTE_DOUBLE]: true,
      [CharGroupName.QUOTE_BACKTICK]: true,
    },
    [CharGroupName.BRACKET_ANGLE]: {
      [CharGroupName.TEXT]: true,
      [CharGroupName.QUOTE_SINGLE]: true,
      [CharGroupName.QUOTE_DOUBLE]: true,
    },
  },
};
