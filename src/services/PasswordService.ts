import { compare, hash as hs } from "bcrypt";

export interface IPasswordService {
	hash(password: string): Promise<string>;
	compare(password: string, hashedPassword: string): Promise<boolean>;
}

export class PasswordService implements IPasswordService {
	hash(password: string): Promise<string> {
		return hs(password, 8);
	}

	compare(password: string, hashedPassword: string): Promise<boolean> {
		return compare(password, hashedPassword);
	}
}
