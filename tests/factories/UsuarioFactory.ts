import type { TUsuarioStatus, TUsuarioTipo } from "../../src/dto/index.js";
import { faker as f } from "@faker-js/faker";
import { generateUniqueValue } from "../utils/generateUniqueValue.js";

export interface IUsuarioFactory {
	nome: string;
	email: string;
	tipo: TUsuarioTipo;
	status: TUsuarioStatus;
	admin: boolean;
	password: string;
	created_at: Date;
	updated_at: Date;
}

export abstract class UsuarioFactory {
	private static sequence = 0;

	protected nome: string;
	protected email: string;
	protected tipo: TUsuarioTipo;
	protected status: TUsuarioStatus;
	protected admin: boolean;
	protected password: string;
	protected created_at: Date;
	protected updated_at: Date;
	// adicionar campos professor

	protected constructor() {
		this.nome = f.person.firstName();
		this.email = this.generateUniqueEmail();
		this.tipo = "professor";
		this.status = "analise";
		this.admin = false;
		this.password = f.internet.password();
		this.created_at = new Date();
		this.updated_at = new Date();
	}

	private generateUniqueEmail() {
		const sequence = String(UsuarioFactory.sequence++);
		const uniqueIdentifierEmail = `${sequence}.${generateUniqueValue()}`;
		return `email.professor${uniqueIdentifierEmail}@test.com`;
	}

	withNome(nome: string) {
		this.nome = nome;
		return this;
	}

	withEmail(email: string) {
		this.email = email;
		return this;
	}

	withStatus(status: TUsuarioStatus) {
		this.status = status;
		return this;
	}

	withPassword(password: string) {
		this.password = password;
		return this;
	}

	asAdmin(admin: boolean = true) {
		this.admin = admin;
		return this;
	}

	withCreatedAt(created_at: Date) {
		this.created_at = created_at;
		return this;
	}

	withUpdatedAt(updated_at: Date) {
		this.updated_at = updated_at;
		return this;
	}
}
