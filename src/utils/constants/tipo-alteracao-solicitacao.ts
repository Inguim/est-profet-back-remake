export const TIPO_ALTERACAO_SOLICITACAO = ["alteracao_dados", "solicitar_analise", "aprovacao"] as const;

export type TTipoAlteracaoSolicitacao = (typeof TIPO_ALTERACAO_SOLICITACAO)[number];
