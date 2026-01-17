import type { IBaseValidator, IBaseValidatorResponse } from "./BaseValidator.js";
import * as z from "zod";
import type { ZodSafeParseResult } from "zod";
import { defaultMessages as dm } from "./default-messages.js";
import { USUARIO_TIPOS } from "../dto/index.js";

const createSchema = z
	.object({
		nome: z.string().min(3, { error: ({ minimum }) => dm.minLength(minimum as number, "nome") }),
		email: z.email(dm.invalidEmail),
		password: z.string().min(6, { error: ({ minimum }) => dm.minLength(minimum as number, "senha") }),
		confirm_password: z
			.string()
			.min(6, { error: ({ minimum }) => dm.minLength(minimum as number, "confirmação de senha") }),
		tipo: z.enum(USUARIO_TIPOS, { error: () => dm.enum("tipo", USUARIO_TIPOS) }),
	})
	.check(
		z.refine((data) => data.password === data.confirm_password, {
			message: dm.confirmPassword,
			path: ["confirm_password"],
		}),
	);

class CreateValidator implements IBaseValidator {
	validate(data: any): IBaseValidatorResponse<ZodSafeParseResult<any>> {
		const result = createSchema.safeParse(data);
		return {
			success: result.success,
			extra: result,
		};
	}
}

export const userValidator = {
	CreateValidator,
};
