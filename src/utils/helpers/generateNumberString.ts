import { randomInt } from "crypto";

export function generateNumberString(): string {
	const code = randomInt(0, 1_000_000); // 0 até 999999
	return code.toString().padStart(6, "0");
}
