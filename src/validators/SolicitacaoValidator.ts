import type { IBaseValidator, IBaseValidatorResponse } from "./BaseValidator.js";
import * as z from "zod";
import type { ZodSafeParseResult } from "zod";
import { defaultMessages as dm } from "./default-messages.js";
import { TIPO_ALTERACAO_SOLICITACAO } from "../utils/constants/tipo-alteracao-solicitacao.js";

const BASE_SCHEMA = z.object({
	titulo: z.string(dm.required("titulo")).trim(),
	descricao: z.string(dm.required("descricao")).trim(),
	projeto_id: z.uuidv4(dm.invalidUUID("projeto_id")).trim(),
});

const createSchema = BASE_SCHEMA.clone();

const updateSchema = BASE_SCHEMA.clone()
	.omit({ projeto_id: true })
	.extend({
		tipo_alteracao: z.enum(TIPO_ALTERACAO_SOLICITACAO, {
			error: () => dm.enum("tipo_alteracao", TIPO_ALTERACAO_SOLICITACAO),
		}),
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

class UpdateValidator implements IBaseValidator {
	validate(data: any): IBaseValidatorResponse<ZodSafeParseResult<any>> {
		const result = updateSchema.safeParse(data);
		return {
			success: result.success,
			extra: result,
		};
	}
}

export const solicitacaoValidator = {
	CreateValidator,
	UpdateValidator,
};
