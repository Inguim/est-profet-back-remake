export type TEvents = {
	"solicitacao.created": { solicitacaoId: string; projetoMembrosIds: string[] };
	"projeto.updated": { projetoId: string; executerId: string };
	"passwordReset.sendEmail": { to: string; token: string };
};
