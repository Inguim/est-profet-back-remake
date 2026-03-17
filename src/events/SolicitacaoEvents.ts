import type { ISolicitacaoDTO, SolicitacaoDTO } from "../dto/SolicitacaoDTO.js";
import { eventBus } from "./index.js";

export interface ISolicitacaoEvents {
	created(solicitacao: ISolicitacaoDTO, projetoMembrosIds: string[]): Promise<void>;
}

export class SolicitacaoEvents implements ISolicitacaoEvents {
	private eventEmitter = eventBus;

	async created(solicitacao: SolicitacaoDTO, projetoMembrosIds: string[]) {
		this.eventEmitter.emit("solicitacao.created", { solicitacaoId: String(solicitacao.id), projetoMembrosIds });
	}
}
