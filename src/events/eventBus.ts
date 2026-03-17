type TListener<T> = (payload: T) => void | Promise<void>;

export class EventBus<E extends Record<string, any>> {
	private listeners: {
		[K in keyof E]?: TListener<E[K]>[];
	} = {};

	on<K extends keyof E>(event: K, listener: TListener<E[K]>) {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}
		this.listeners[event]!.push(listener);
	}

	emit<K extends keyof E>(event: K, payload: E[K]) {
		const listeners = this.listeners[event];
		if (!listeners) return;

		for (const listener of listeners) {
			setImmediate(() => {
				Promise.resolve(listener(payload)).catch((err) => {
					console.error(`Erro no evento ${String(event)}`, err);
				});
			});
		}
	}
}
