export function dataExpirada(data: Date, expiresIn: number): boolean {
	const agora = Date.now();
	const diferenca = agora - data.getTime();
	return diferenca >= expiresIn;
}
