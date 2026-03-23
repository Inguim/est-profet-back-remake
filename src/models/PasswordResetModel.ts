import type { Knex } from "knex";
import dbConnection from "../database/dbConfig.js";
import { PasswordResetDTO, type IPasswordResetDTO } from "../dto/PasswordResetDTO.js";
import { generateNumberString } from "../utils/helpers/generateNumberString.js";

export type TCreateModelPasswordReset = {
	email: string;
};

export interface IPasswordResetModel {
	create(dto: TCreateModelPasswordReset): Promise<IPasswordResetDTO>;
	findOne(email: string, token: string): Promise<IPasswordResetDTO | null>;
	delete(email: string, token: string): Promise<boolean>;
}

export class PasswordResetModel implements IPasswordResetModel {
	protected table = "password_resets";
	protected tableTag = "password_resets";
	protected dto = PasswordResetDTO;

	private get db(): Knex.QueryBuilder {
		return this.connection.table(this.table);
	}

	constructor(private readonly connection: Knex = dbConnection) {}

	async create(dto: TCreateModelPasswordReset): Promise<IPasswordResetDTO> {
		const { email } = dto;
		// para melhor segurança seria melhor hashear o token antes de armazena-lo
		const token = generateNumberString();
		const [newReset] = await this.db.insert({ email, token, created_at: new Date() }).returning("*");
		return new this.dto(newReset);
	}

	async findOne(email: string, token?: string): Promise<IPasswordResetDTO | null> {
		const reset = await this.db
			.select("*")
			.where({ email, ...(token ? { token } : {}) })
			.first();
		if (!reset) return null;
		return new this.dto(reset);
	}

	async delete(email: string, token: string): Promise<boolean> {
		const deleted = await this.db.where({ email, token }).del();
		return deleted > 0;
	}
}
