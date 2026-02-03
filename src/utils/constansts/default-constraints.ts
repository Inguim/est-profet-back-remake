export const DEFAULT_CONSTRAINTS = {
	usuarios_email_unique: "email",
};

export type TDeFaultConstraints = keyof typeof DEFAULT_CONSTRAINTS;
