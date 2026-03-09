export const TIPOS_NOTIFICACAO = {
	solicitacao: "solicitacao",
} as const;

export type TTiposNotificacao = keyof typeof TIPOS_NOTIFICACAO;
