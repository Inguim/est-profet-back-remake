import { eventBus } from "../events/index.js";
import { SolicitacaoObserver } from "../observers/index.js";
import { NotificacaoService } from "../services/NotificacaoService.js";
import { TipoNotificacaoService } from "../services/TipoNotificacaoService.js";

eventBus.on("solicitacao.created", async ({ solicitacaoId, projetoMembrosIds }) => {
	const tipoNotificacaoService = new TipoNotificacaoService();
	const notificacaoService = new NotificacaoService({ tipoNotificacaoService });
	const observer = new SolicitacaoObserver({ notificacaoService });
	observer.created(solicitacaoId, projetoMembrosIds);
});
