import type { TEvents } from "./eventTypes.js";
import { EventBus } from "./eventBus.js";

export const eventBus = new EventBus<TEvents>();
