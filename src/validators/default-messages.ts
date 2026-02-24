const defaultMessages = {
	invalidEmail: "Por favor, insira um e-mail válido.",
	confirmPassword: "As senhas não coincidem.",
	credencias_invalidas: "Email ou senha inválidas.",
	invalidUUID: (field: string) => `O campo ${field} deve ser um UUID.`,
	required: (field: string) => `O campo ${field} é obrigatório.`,
	unique: (field: string) => `O campo ${field} já existe.`,
	minLength: (min: number, field: string) => `O campo ${field} deve ter no mínimo ${min} caracteres.`,
	maxLength: (max: number, field: string) => `O campo ${field} deve ter no máximo ${max} caracteres.`,
	enum: (field: string, options: readonly string[]) =>
		`O campo ${field} deve ser um dos seguintes valores: ${options.join(", ")}.`,
	boolean: (field: string) => `O campo ${field} deve ser verdadeiro ou falso.`,
	arrayUnique: (field: string) => `O campo ${field} deve conter apenas valores únicos`,
	arrayMin: (min: number, field: string) =>
		`O campo ${field} deve conter no minímo ${min} ${min > 1 ? "valores" : "valor"} ${min > 1 ? "informados" : "informado"}`,
};

export { defaultMessages };
