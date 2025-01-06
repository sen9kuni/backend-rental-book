import Elysia, { t } from "elysia";
import { authServices, bookServices } from "../../application/instance";
import { AuthorizationError } from "../../infrastructure/entity/errors";

export const bookRouter = new Elysia({ prefix: "/v1/books" })
	.derive(async ({ headers }) => {
		const sessionId = headers.authorization?.split(" ")[1];

		if (!sessionId) {
			throw new AuthorizationError("Session id not provided");
		}

		const { user } = await authServices.decodeSession(sessionId);

		return { user };
	})
	// router
	.get("/:search", async ({ params: { search } }) => {
		const books = await bookServices.getAll(search);

		return books;
	})
	.get("/id/:id", async ({ params: { id } }) => {
		const book = await bookServices.getOne(id);

		return book;
	})
	.post(
		"/",
		async ({ body, user, set }) => {
			const newBook = await bookServices.create({
				lastUpdatedBy: user.id,
				...body,
			});

			set.status = 201;

			return newBook;
		},
		{
			body: t.Object({
				title: t.String({ minLength: 3 }),
				author: t.String({ minLength: 3 }),
				description: t.String(),
				imageUrl: t.String(),
				publishedAt: t.Date(),
				totalStock: t.Number(),
				availableStock: t.Number(),
			}),
		},
	)
	.patch(
		"/:id",
		async ({ params: { id }, body, user }) => {
			const updatedBook = await bookServices.update(id, {
				...body,
				lastUpdatedBy: user.id,
			});

			return updatedBook;
		},
		{
			body: t.Object({
				title: t.Optional(t.String()),
				author: t.Optional(t.String()),
				description: t.Optional(t.String()),
				imageUrl: t.Optional(t.String()),
				publishedAt: t.Optional(t.Date()),
				totalStock: t.Optional(t.Number()),
				availableStock: t.Optional(t.Number()),
			}),
		},
	)
	.delete("/:id", async ({ params: { id }, set }) => {
		set.status = 204;
		await bookServices.delete(id);
	});
