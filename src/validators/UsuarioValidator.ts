import type { IBaseValidator, IBaseValidatorResponse } from "./BaseValidator.js";
import * as z from "zod";
import type { ZodSafeParseResult } from "zod";
import { defaultMessages as dm } from "./default-messages.js";
import { USUARIO_TIPOS } from "../dto/UsuarioDTO.js";

const BASE_SCHEMA = z.object({
	nome: z
		.string(dm.required("nome"))
		.min(3, { error: ({ minimum }) => dm.minLength(minimum as number, "nome") })
		.nonempty("campo obrigatorio")
		.trim(),
	email: z.email(dm.invalidEmail),
	password: z
		.string(dm.required("password"))
		.min(6, { error: ({ minimum }) => dm.minLength(minimum as number, "password") }),
	confirm_password: z
		.string(dm.required("confirm_password"))
		.min(6, { error: ({ minimum }) => dm.minLength(minimum as number, "confirm_password") }),
});

const createSchemaAluno = BASE_SCHEMA.extend({
	tipo: z.literal("aluno", {
		error: () => dm.enum("tipo", USUARIO_TIPOS),
	}),
	curso_id: z.string(dm.required("curso_id")),
	serie_id: z.string(dm.required("serie_id")),
});

const createSchemaProfessor = BASE_SCHEMA.extend({
	tipo: z.literal("professor", {
		error: () => dm.enum("tipo", USUARIO_TIPOS),
	}),
	// adicionar campos professor
});

const createSchema = z
	.discriminatedUnion("tipo", [createSchemaAluno, createSchemaProfessor], {
		error: (issue) => {
			if (issue.code === "invalid_union") {
				return dm.enum("tipo", USUARIO_TIPOS);
			}
			return "Formato JSON errado";
		},
	})
	.refine((data) => data.password === data.confirm_password, {
		message: "As senhas não coincidem.",
		path: ["confirm_password"],
	});

const updateSchema = BASE_SCHEMA.pick({ nome: true });

class CreateValidator implements IBaseValidator {
	validate(data: any): IBaseValidatorResponse<ZodSafeParseResult<any>> {
		const result = createSchema.safeParse(data);
		return {
			success: result.success,
			extra: result,
		};
	}
}

class UpdateValidator implements IBaseValidator {
	validate(data: any): IBaseValidatorResponse<ZodSafeParseResult<any>> {
		const result = updateSchema.safeParse(data);
		return {
			success: result.success,
			extra: result,
		};
	}
}

export const userValidator = {
	CreateValidator,
	UpdateValidator,
};
