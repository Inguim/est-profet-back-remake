import { faker as f } from "@faker-js/faker";
import { PROJETO_STATUS, type TProjetoStatus } from "../../src/dto/ProjetoDTO.js";
import { generateUniqueValue } from "../utils/generateUniqueValue.js";

export interface IProjetoFactory {
	nome: string;
	resumo: string;
	introducao: string;
	objetivo: string;
	metodologia: string;
	result_disc: string;
	conclusao: string;
	status: TProjetoStatus;
	categoria_id: string;
	estado_id: string;
}

export class ProjetoFactory {
	private static sequence = 0;

	private nome: string;
	private resumo: string;
	private introducao: string;
	private objetivo: string;
	private metodologia: string;
	private result_disc: string;
	private conclusao: string;
	private status: TProjetoStatus;
	private categoria_id: string;
	private estado_id: string;

	private constructor() {
		this.nome = this.generateUniqueNome();
		this.resumo = f.lorem.paragraph();
		this.introducao = f.lorem.paragraph();
		this.objetivo = f.lorem.paragraph();
		this.metodologia = f.lorem.paragraph();
		this.result_disc = f.lorem.paragraph();
		this.conclusao = f.lorem.paragraph();
		this.status = f.helpers.objectKey(PROJETO_STATUS);
		this.categoria_id = f.string.uuid();
		this.estado_id = f.string.uuid();
	}

	static create() {
		return new ProjetoFactory();
	}

	private generateUniqueNome() {
		const sequence = String(ProjetoFactory.sequence++);
		const uniqueIdentifierNome = `${sequence}.${generateUniqueValue()}`;
		return uniqueIdentifierNome + f.string.alpha({ length: { min: 5, max: 80 } });
	}

	withNome(nome: string) {
		this.nome = nome;
		return this;
	}

	withResumo(resumo: string) {
		this.resumo = resumo;
		return this;
	}

	withIntroducao(introducao: string) {
		this.introducao = introducao;
		return this;
	}

	withObjetivo(objetivo: string) {
		this.objetivo = objetivo;
		return this;
	}

	withMetodologia(metodologia: string) {
		this.metodologia = metodologia;
		return this;
	}

	withResultadoDiscussao(result_disc: string) {
		this.result_disc = result_disc;
		return this;
	}

	withConclusao(conclusao: string) {
		this.conclusao = conclusao;
		return this;
	}

	withStatus(status: TProjetoStatus) {
		this.status = status;
		return this;
	}

	withCategoria(categoria_id: string) {
		this.categoria_id = categoria_id;
		return this;
	}

	withEstado(estado_id: string) {
		this.estado_id = estado_id;
		return this;
	}

	build(): IProjetoFactory {
		return {
			nome: this.nome,
			resumo: this.resumo,
			introducao: this.introducao,
			objetivo: this.objetivo,
			metodologia: this.metodologia,
			result_disc: this.result_disc,
			conclusao: this.conclusao,
			status: this.status,
			categoria_id: this.categoria_id,
			estado_id: this.estado_id,
		};
	}
}
