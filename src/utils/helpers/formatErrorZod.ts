import type { ZodError } from "zod";

export function formatErrorZod(error: ZodError): Record<string, string> {
	const errors: Record<string, string> = {};
	error.issues.forEach((issue) => {
		const path = issue.path[0] || "unknown_field";
		Object.assign(errors, { [path]: issue.message });
	});
	return errors;
}
