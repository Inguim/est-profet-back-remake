import { eventBus } from "../events/index.js";
import { PasswordResetObserver } from "../observers/index.js";
import { FakeEmailProvider } from "../providers/FakeEmailProvider.js";

eventBus.on("passwordReset.sendEmail", async ({ to, token }) => {
	const observer = new PasswordResetObserver({ emailProvider: new FakeEmailProvider() });
	observer.created(to, token);
});
