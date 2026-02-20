export function generateUniqueValue() {
	const now = new Date();
	return `${now.getHours()}${now.getMinutes()}${now.getSeconds()}${now.getMilliseconds()}`;
}
