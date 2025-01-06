import Elysia, { t } from "elysia";
import { authServices, rentalServices } from "../../application/instance";
import { AuthorizationError } from "../../infrastructure/entity/errors";

export const rentalRouter = new Elysia({ prefix: "/v1/rentals" })
	.derive(async ({ headers }) => {
		const sessionId = headers.authorization?.split(" ")[1];

		if (!sessionId) {
			throw new AuthorizationError("Session id not provided");
		}

		const { user } = await authServices.decodeSession(sessionId);

		return { user };
	})
	.get("/", async ({ user }) => {
		const rental = await rentalServices.getAll(user.id);

		return rental;
	})
	.get("/:id", async ({ params: { id } }) => {
		const rental = await rentalServices.getOne(id);

		return rental;
	})
	.post(
		"/",
		async ({ body, user, set }) => {
			const newRental = await rentalServices.create({
				...body,
				userId: user.id,
			});

			set.status = 201;

			return newRental;
		},
		{
			body: t.Object({
				bookId: t.String({ minLength: 3 }),
				rentedAt: t.Date(),
				returnedAt: t.Date(),
			}),
		},
	)
	.patch(
		"/:id",
		async ({ params: { id }, body }) => {
			const updatedRental = await rentalServices.update(id, {
				...body,
			});

			return updatedRental;
		},
		{
			body: t.Object({
				bookId: t.Optional(t.String({ minLength: 3 })),
				rentedAt: t.Optional(t.Date()),
				returnedAt: t.Optional(t.Date()),
			}),
		},
	)
	.delete("/:id", async ({ params: { id }, set }) => {
		set.status = 204;
		await rentalServices.delete(id);
	});
