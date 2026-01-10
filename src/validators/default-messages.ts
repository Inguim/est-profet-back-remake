const defaultMessages = {
	required: (field: string) => `O campo ${field} é obrigatório.`,
	invalidEmail: "Por favor, insira um e-mail válido.",
	minLength: (min: number, field: string) => `O campo ${field} deve ter no mínimo ${min} caracteres.`,
	maxLength: (max: number, field: string) => `O campo ${field} deve ter no máximo ${max} caracteres.`,
	enum: (field: string, options: readonly string[]) =>
		`O campo ${field} deve ser um dos seguintes valores: ${options.join(", ")}.`,
	boolean: (field: string) => `O campo ${field} deve ser verdadeiro ou falso.`,
};

export { defaultMessages };
