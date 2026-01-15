import type { IBaseValidator, IBaseValidatorResponse } from "./BaseValidator.js";
import * as z from "zod";
import type { ZodSafeParseResult } from "zod";
import { defaultMessages as dm } from "./default-messages.js";
import { USUARIO_TIPOS } from "../dto/index.js";

const createSchema = z
	.object({
		nome: z
			.string(dm.required("nome"))
			.min(3, { error: ({ minimum }) => dm.minLength(minimum as number, "nome") })
			.nonempty("campo obrigatorio"),
		email: z.email(dm.invalidEmail),
		password: z
			.string(dm.required("password"))
			.min(6, { error: ({ minimum }) => dm.minLength(minimum as number, "password") }),
		confirm_password: z
			.string(dm.required("confirm_password"))
			.min(6, { error: ({ minimum }) => dm.minLength(minimum as number, "confirm_password") }),
		tipo: z.enum(USUARIO_TIPOS, { error: () => dm.enum("tipo", USUARIO_TIPOS) }),
	})
	.refine((data) => data.password === data.confirm_password, {
		message: "As senhas não coincidem.",
		path: ["confirm_password"],
	});

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
