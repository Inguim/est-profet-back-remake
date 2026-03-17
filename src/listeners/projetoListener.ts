import { eventBus } from "../events/index.js";

eventBus.on("projeto.created", async ({ id, membrosIds }) => {
	console.log("On");
	console.log("Projeto", id);
	console.log("Membros", membrosIds);
});
