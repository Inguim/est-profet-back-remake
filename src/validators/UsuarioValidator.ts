import type { IBaseValidator } from "./BaseValidator.js";
import * as z from "zod";
import { defaultMessages as dm } from "./default-messages.js";
import { USUARIO_TIPOS, USUARIO_STATUS } from "../dto/index.js";

const createSchema = z
	.object({
		nome: z.string().min(3, { error: ({ minimum }) => dm.minLength(minimum as number, "nome") }),
		email: z.email(dm.invalidEmail),
		password: z.string().min(6, { error: ({ minimum }) => dm.minLength(minimum as number, "senha") }),
		confirm_password: z
			.string()
			.min(6, { error: ({ minimum }) => dm.minLength(minimum as number, "confirmação de senha") }),
		tipo: z.enum(USUARIO_TIPOS, { error: () => dm.enum("tipo", USUARIO_TIPOS) }),
		status: z.enum(USUARIO_STATUS, { error: () => dm.enum("status", USUARIO_STATUS) }),
		admin: z.boolean(dm.boolean("admin")),
	})
	.check(
		z.refine((data) => data.password === data.confirm_password, {
			message: dm.confirmPassword,
			path: ["confirm_password"],
		}),
	);

class CreateValidator implements IBaseValidator {
	validate(data: any): boolean {
		const result = createSchema.safeParse(data);
		return result.success;
	}
}

export const userValidator = {
	CreateValidator,
};
