import type { IBaseValidator, IBaseValidatorResponse } from "./BaseValidator.js";
import * as z from "zod";
import type { ZodSafeParseResult } from "zod";
import { defaultMessages as dm } from "./default-messages.js";
import { PROJETO_STATUS_VALUES } from "../dto/ProjetoDTO.js";
import { USUARIO_PROJETO_STATUS_VALUES } from "../dto/UsuarioProjetoDTO.js";

const BASE_SCHEMA = z.object({
	nome: z
		.string(dm.required("nome"))
		.min(3, { error: ({ minimum }) => dm.minLength(Number(minimum), "nome") })
		.max(100, { error: ({ maximum }) => dm.minLength(Number(maximum), "nome") })
		.trim(),
	resumo: z.string(dm.required("resumo")).trim(),
	introducao: z.string(dm.required("introducao")).trim(),
	objetivo: z.string(dm.required("objetivo")).trim(),
	metodologia: z.string(dm.required("metodologia")).trim(),
	result_disc: z.string(dm.required("result_disc")).trim(),
	conclusao: z.string(dm.required("conclusao")).trim(),
	status: z.enum(PROJETO_STATUS_VALUES, { error: () => dm.enum("tipo", PROJETO_STATUS_VALUES) }),
	categoria_id: z.uuidv4(dm.required("categoria_id")).trim(),
	estado_id: z.uuidv4(dm.required("estado_id")).trim(),
});

const createSchema = BASE_SCHEMA.extend({
	membros: z
		.array(
			z.object({
				user_id: z.uuidv4(dm.invalidUUID("user_id")).trim(),
				relacao: z.enum(USUARIO_PROJETO_STATUS_VALUES, {
					error: () => dm.enum("relacao", USUARIO_PROJETO_STATUS_VALUES),
				}),
			}),
			{ error: () => dm.required("membros") },
		)
		.min(1, { error: ({ minimum }) => dm.arrayMin(Number(minimum), "membros") })
		.refine((items) => new Set(items.map((i) => i.user_id)).size === items.length, {
			message: dm.arrayUnique("membros"),
		}),
}).omit({ status: true });

const updateSchema = BASE_SCHEMA.pick({ status: true });

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

export const projetoValidator = {
	CreateValidator,
	UpdateValidator,
};
