import z, { type ZodSafeParseResult } from "zod";

import { defaultMessages as dm } from "./default-messages.js";
import type { IBaseValidator, IBaseValidatorResponse } from "./BaseValidator.js";

const BASE_SCHEMA = z.object({
	nome: z
		.string(dm.required("nome"))
		.min(3, { error: ({ minimum }) => dm.minLength(Number(minimum), "nome") })
		.max(50, { error: ({ maximum }) => dm.maxLength(Number(maximum), "nome") })
		.trim(),
	link: z
		.string(dm.required("link"))
		.min(3, { error: ({ minimum }) => dm.minLength(Number(minimum), "link") })
		.max(255, { error: ({ maximum }) => dm.maxLength(Number(maximum), "link") })
		.trim(),
});

const createSchema = BASE_SCHEMA.clone();

const updateSchama = BASE_SCHEMA.clone();

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
		const result = updateSchama.safeParse(data);
		return {
			success: result.success,
			extra: result,
		};
	}
}

export const noticiaValidator = {
	CreateValidator,
	UpdateValidator,
};
