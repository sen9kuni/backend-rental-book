import { Prisma, type PrismaClient } from "@prisma/client";
import type { CreateUser, IUser, UpdateUser } from "../entity/interface";
import "reflect-metadata";
import { injectable, inject } from "inversify";
import { TYPES } from "../entity/types";
import { DBError } from "../entity/errors";

@injectable()
export class UserRepository implements IUser {
	private prisma: PrismaClient;

	constructor(@inject(TYPES.prisma) prisma: PrismaClient) {
		this.prisma = prisma;
	}

	async getAll() {
		try {
			const users = await this.prisma.user.findMany();
			return users;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async getOne(userIdOrEmail: string) {
		try {
			const user = await this.prisma.user.findFirst({
				where: {
					OR: [
						{
							id: userIdOrEmail,
						},
						{
							email: userIdOrEmail,
						},
					],
				},
			});

			if (!user) {
				return null;
			}

			return user;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async create(data: CreateUser) {
		try {
			const newUser = await this.prisma.user.create({
				data,
			});

			return newUser;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async update(userId: string, data: UpdateUser) {
		try {
			const updatedUser = this.prisma.user.update({
				where: {
					id: userId,
				},
				data,
			});

			return updatedUser;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async delete(userId: string) {
		try {
			await this.prisma.user.delete({
				where: {
					id: userId,
				},
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new DBError("error getting resource from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}
}
