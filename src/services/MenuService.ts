import { MenuDTO, type IMenuDTO } from "../dto/MenuDTO.js";
import { MenuModel } from "../models/MenuModel.js";
import { type ICategoriaService } from "../services/CategoriaService.js";

export interface IMenuService {
	list(): Promise<IMenuDTO[]>;
}

type TConstructor = {
	categoriaService: ICategoriaService;
};

export class MenuService implements IMenuService {
	protected model = MenuModel;
	protected dto = MenuDTO;
	private categoriaService: ICategoriaService;

	constructor({ categoriaService }: TConstructor) {
		this.categoriaService = categoriaService;
	}

	async list(): Promise<MenuDTO[]> {
		const model = new this.model();
		const menus = await model.list();
		const results: MenuDTO[] = [];
		for (const menu of menus) {
			const categorias = await this.getCategorias(String(menu.id));
			results.push(new this.dto({ ...menu, categorias }));
		}
		return results;
	}

	private async getCategorias(id: string) {
		return await this.categoriaService.list({ menu_id: id });
	}
}
