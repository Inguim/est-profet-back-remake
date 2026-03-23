export interface IEmailProvider {
	send(to: string, content: string): Promise<void>;
}
