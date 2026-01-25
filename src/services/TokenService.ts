import { decode, sign, TokenExpiredError, verify } from "jsonwebtoken";
import { getEnv } from "../utils/helpers/getEnv.js";
import { ExpiredTokenError, InvalidTokenError } from "../errors/index.js";

export interface ITokenService {
	create(payload: any): string;
	decode<T>(token: string): T;
	validate(token: string): void;
}

const ENV_EXPIRES = parseInt(getEnv("TOKEN_EXPIRES"));
const ENV_SECRET = getEnv("TOKEN_SECRET");

export class TokenService implements ITokenService {
	constructor(private expiresIn: number = ENV_EXPIRES) {}

	create(payload: object): string {
		const token = sign(payload, ENV_SECRET, { expiresIn: this.expiresIn });
		return token;
	}

	decode<T>(token: string): T {
		const decoded = decode(token);
		return decoded as T;
	}

	validate(token: string): void {
		try {
			verify(token, ENV_SECRET);
		} catch (error) {
			if (error instanceof TokenExpiredError) throw new ExpiredTokenError();
			throw new InvalidTokenError();
		}
	}
}
