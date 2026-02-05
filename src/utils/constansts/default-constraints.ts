export const DEFAULT_CONSTRAINTS = {
	usuarios_email_unique: "email",
	cursos_curso_unique: "curso",
	serires_serie_unique: "serie",
};

export type TDeFaultConstraints = keyof typeof DEFAULT_CONSTRAINTS;
