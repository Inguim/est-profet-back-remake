import { hash as hs } from "bcrypt";

export interface IPasswordService {
	hash(password: string): Promise<string>;
}

export class PasswordService implements IPasswordService {
	hash(password: string): Promise<string> {
		return hs(password, 8);
	}
}
