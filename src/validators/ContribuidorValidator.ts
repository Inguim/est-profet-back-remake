import z, { type ZodSafeParseResult } from "zod";

import { defaultMessages as dm } from "./default-messages.js";
import type { IBaseValidator, IBaseValidatorResponse } from "./BaseValidator.js";

const BASE_SCHEMA = z.object({
	github_username: z
		.string(dm.required("github_username"))
		.min(3, { error: ({ minimum }) => dm.minLength(Number(minimum), "github_username") })
		.nonempty("campo obrigatorio")
		.trim(),
	tipo_contribuicao_id: z.uuidv4({ error: () => dm.invalidUUID("tipo_contribuicao_id") }),
	user_id: z.uuidv4({ error: () => dm.invalidUUID("user_id") }),
});

const createSchema = BASE_SCHEMA.clone();

const updateSchama = BASE_SCHEMA.omit({ user_id: true });

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

export const contribuidorValidator = {
	CreateValidator,
	UpdateValidator,
};
