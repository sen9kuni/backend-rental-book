import { Elysia } from "elysia";
import { authRouter } from "./presentation/router/authRouter";
import { bookRouter } from "./presentation/router/bookRouter";
import swagger from "@elysiajs/swagger";
import cors from "@elysiajs/cors";

const app = new Elysia()
	.get("/", () => "Hello Elysia")
	.use(cors())
	.use(
		swagger({
			path: "/docs",
		}),
	)
	.group("/api", (app) => app.use(authRouter).use(bookRouter))
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
