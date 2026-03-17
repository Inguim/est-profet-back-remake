import { eventBus } from "./index.js";

export interface IProjetoEvents {
	updated(projetoId: string, executerId: string): Promise<void>;
}

export class ProjetoEvents implements IProjetoEvents {
	private eventEmitter = eventBus;

	async updated(projetoId: string, executerId: string) {
		this.eventEmitter.emit("projeto.updated", { projetoId, executerId });
	}
}
