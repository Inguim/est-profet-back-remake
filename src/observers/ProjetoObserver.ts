import type { INotificacaoDTO, NotificacaoDTO } from "../dto/NotificacaoDTO.js";
import type { INotificacaoService } from "../services/NotificacaoService.js";
import type { ISolicitacaoService } from "../services/SolicitacaoService.js";

export interface IProjetoObserver {
	updated(projetoId: string, executerId: string): Promise<INotificacaoDTO | null>;
}

type TConstructorObserver = {
	notificacaoService: INotificacaoService;
	solicitacaoService: ISolicitacaoService;
};

export class ProjetoObserver implements IProjetoObserver {
	private notificacaoService: INotificacaoService;
	private solicitacaoService: ISolicitacaoService;

	constructor({ notificacaoService, solicitacaoService }: TConstructorObserver) {
		this.notificacaoService = notificacaoService;
		this.solicitacaoService = solicitacaoService;
	}

	async updated(projetoId: string, executerId: string): Promise<NotificacaoDTO | null> {
		return await this.solicitacaoService
			.findOne({ projeto_id: projetoId })
			.then(async (solicitacao) => {
				await this.solicitacaoService.update(String(solicitacao.id), {
					status: "alterado",
					tipo_alteracao: "alteracao_dados",
				});
				const notificacao = await this.notificacaoService.create({
					solicitacao_id: String(solicitacao.id),
					user_id: executerId,
				});
				return notificacao;
			})
			.catch(() => {
				return null;
			});
	}
}
