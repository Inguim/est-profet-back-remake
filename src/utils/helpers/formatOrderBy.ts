type TOrder = {
	column: string;
	sort: "asc" | "desc";
};

export function formatOrderBy<T>(order: T): TOrder {
	const [column = "", sort = "asc"] = String(order).split("__");
	return {
		column,
		sort,
	} as TOrder;
}
