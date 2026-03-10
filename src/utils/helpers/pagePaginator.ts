import type { Knex } from "knex";

const DEFAULT_PER_PAGE = 5;
const DEFAULT_LIMIT_PER_PAGE = 10;

export type TPagePagination = {
	page: number;
	perPage: number;
};

export type TPagePaginatedResponse<T> = {
	data: T[];
	page: number;
	perPage: number;
	count: number;
	totalPages: number;
};

export class PagePaginator {
	async execute<T>(
		query: Knex.QueryBuilder,
		page: number,
		perPage: number = DEFAULT_PER_PAGE,
		columnCount = "id",
	): Promise<TPagePaginatedResponse<T>> {
		if (perPage > DEFAULT_LIMIT_PER_PAGE) perPage = DEFAULT_LIMIT_PER_PAGE;
		const offset = (page - 1) * perPage;

		const countQuery = query.clone();
		const dataQuery = query.clone();

		const [{ count }] = await countQuery.clearOrder().clearSelect().countDistinct(`${columnCount} as count`);
		const data = await dataQuery.limit(perPage).offset(offset);

		return {
			data,
			page,
			perPage,
			count: Number(count),
			totalPages: Math.ceil(count / perPage),
		};
	}
}
