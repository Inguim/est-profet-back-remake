export const TIPOS_CONTRUIBUICAO = {
	idealizador_desenvolvedor: "Idealizador e desenvolvedor",
	desenvolvedor: "Desenvolvedor",
	apoio_manutencao: "Apoio e manutenção",
} as const;

export type TTiposContribuicao = keyof typeof TIPOS_CONTRUIBUICAO;
