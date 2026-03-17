import type { INotificacaoDTO, NotificacaoDTO } from "../dto/NotificacaoDTO.js";
import type { INotificacaoService } from "../services/NotificacaoService.js";

export interface ISolicitacaoObserver {
	created(solicitacaoId: string, membrosIds: string[]): Promise<INotificacaoDTO[]>;
}

type TConstructorObserver = {
	notificacaoService: INotificacaoService;
};

export class SolicitacaoObserver implements ISolicitacaoObserver {
	private notificacaoService: INotificacaoService;

	constructor({ notificacaoService }: TConstructorObserver) {
		this.notificacaoService = notificacaoService;
	}

	async created(solicitacaoId: string, membrosIds: string[]): Promise<NotificacaoDTO[]> {
		const notificacoes: NotificacaoDTO[] = [];
		for (const membroId of membrosIds) {
			const notificacao = await this.notificacaoService.create({ solicitacao_id: solicitacaoId, user_id: membroId });
			notificacoes.push(notificacao);
		}
		return notificacoes;
	}
}
