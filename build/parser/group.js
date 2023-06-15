import { Container } from "./container.js";
import { CharGroups } from "./const.js";
export class Group extends Container {
    groupName;
    config;
    chars;
    closed = false;
    constructor(parent, groupName, config = {}) {
        super(parent);
        this.groupName = groupName;
        this.config = config;
        this.chars = CharGroups[groupName];
    }
    includes(groupName) {
        // log.info("includes", groupName);
        return Boolean(this.config?.includes && this.config.includes[groupName]);
    }
    get openChars() {
        return this.chars[0];
    }
    get closeChars() {
        return this.chars[1];
    }
    isCharsGroup() {
        return Boolean(this.groupName);
    }
}
//# sourceMappingURL=group.js.map