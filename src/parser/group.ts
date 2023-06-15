import {
  ICharGroup,
  ICharGroupItemConfig,
  ICharGroupName,
  ICharGroupUsageList,
} from "./types.js";
import { Container } from "./container.js";
import { CharGroups } from "./const.js";
import { logger as log } from "../logger.js";

export class Group extends Container {
  public chars: ICharGroup;
  public closed = false;

  constructor(
    parent: Container,
    public groupName: ICharGroupName,
    public config: ICharGroupItemConfig = {}
  ) {
    super(parent);
    this.chars = CharGroups[groupName];
  }

  public includes(groupName: string) {
    // log.info("includes", groupName);

    return Boolean(this.config?.includes && this.config.includes[groupName]);
  }

  public get openChars() {
    return this.chars[0];
  }

  public get closeChars() {
    return this.chars[1];
  }

  public isCharsGroup(): this is Group {
    return Boolean(this.groupName);
  }
}
