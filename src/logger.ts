import { Logger } from "@snilcy/logger";

const logger = new Logger("", {
  console: {
    deep: 6,
    undefined: false,
    excludeKeys: ["parent", "includes", "chars", "closed", "id", "config"],
    lineTerminators: true,
  },
});

export { logger };
