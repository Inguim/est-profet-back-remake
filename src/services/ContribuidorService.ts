import type { IGitHubProvider } from "../providers/GitHubProvider.js";
import type { ContribuidorDTO, IContribuidorDTO } from "../dto/ContribuidorDTO.js";
import { ContribuidorModel } from "../models/ContribuidorModel.js";
import type { TPagePaginatedResponse, TPagePagination } from "../utils/helpers/pagePaginator.js";

export type TCreateDTOContribuidorService = {
	github_username: string;
	tipo_contribuicao_id: string;
	user_id: string;
};

export type TUpdateDTOContribuidorService = {
	github_username: string;
	tipo_contribuicao_id: string;
};

type TListDTOContribuidorService = {
	pagination?: TPagePagination;
};

type TConstructorService = {
	gitHubProvider: IGitHubProvider;
};

export interface IContribuidorService {
	create(dto: TCreateDTOContribuidorService): Promise<IContribuidorDTO>;
	get(id: string): Promise<IContribuidorDTO>;
	update(id: string, dto: TUpdateDTOContribuidorService): Promise<IContribuidorDTO>;
	delete(id: string): Promise<IContribuidorDTO>;
	list(filter?: TListDTOContribuidorService): Promise<TPagePaginatedResponse<IContribuidorDTO>>;
}

export class ContribuidorService implements IContribuidorService {
	private model = ContribuidorModel;
	private gitHubProvider: IGitHubProvider;

	constructor({ gitHubProvider }: TConstructorService) {
		this.gitHubProvider = gitHubProvider;
	}

	async create(dto: TCreateDTOContribuidorService): Promise<ContribuidorDTO> {
		const { github_username, tipo_contribuicao_id, user_id } = dto;
		const model = new this.model();
		const contribuidor = await model.create({ github_username, tipo_contribuicao_id, user_id });
		return contribuidor;
	}

	async get(id: string): Promise<ContribuidorDTO> {
		const model = new this.model();
		let contribuidor = await model.get(id);
		contribuidor = await this.getGitHubAccountDados(contribuidor);
		return contribuidor;
	}

	async update(id: string, dto: TUpdateDTOContribuidorService): Promise<ContribuidorDTO> {
		const { github_username, tipo_contribuicao_id } = dto;
		const model = new this.model();
		const contribuidor = await model.update(id, { github_username, tipo_contribuicao_id });
		return contribuidor;
	}

	async delete(id: string): Promise<ContribuidorDTO> {
		const model = new this.model();
		const contribuidor = await model.delete(id);
		return contribuidor;
	}

	async list({ pagination = { page: 1, perPage: 5 } }: TListDTOContribuidorService = {}): Promise<
		TPagePaginatedResponse<ContribuidorDTO>
	> {
		const model = new this.model();
		const { data, count, page, perPage, totalPages } = await model.list(pagination);
		const contribuidores: ContribuidorDTO[] = [];
		for (let contribuidor of data) {
			contribuidor = await this.getGitHubAccountDados(contribuidor);
			contribuidores.push(contribuidor);
		}
		return {
			data: contribuidores,
			count,
			page,
			perPage,
			totalPages,
		};
	}

	private async getGitHubAccountDados(contribuidor: ContribuidorDTO): Promise<ContribuidorDTO> {
		contribuidor.github_dados = await this.gitHubProvider.getUserInfo(contribuidor.github_username);
		return contribuidor;
	}
}
