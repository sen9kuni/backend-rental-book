import { Prisma, type PrismaClient } from "@prisma/client";
import type { CreateRental, IRental, UpdateRental } from "../entity/interface";
import "reflect-metadata";
import { injectable, inject } from "inversify";
import { TYPES } from "../entity/types";
import { DBError } from "../entity/errors";

@injectable()
export class RentalRepository implements IRental {
	private prisma: PrismaClient;

	constructor(@inject(TYPES.prisma) prisma: PrismaClient) {
		this.prisma = prisma;
	}

	async getAll(userId: string) {
		try {
			const resntals = await this.prisma.rental.findMany({
				where: {
					userId,
				},
			});
			return resntals;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientRustPanicError) {
				throw new DBError("error getting source from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async getOne(rentalId: string) {
		try {
			const rental = await this.prisma.rental.findUnique({
				where: {
					id: rentalId,
				},
			});

			if (!rental) {
				return null;
			}

			return rental;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientRustPanicError) {
				throw new DBError("error getting source from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async create(data: CreateRental) {
		try {
			const newRental = await this.prisma.rental.create({
				data,
			});

			return newRental;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientRustPanicError) {
				throw new DBError("error getting source from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async update(rentalId: string, data: UpdateRental) {
		try {
			const updatedRental = await this.prisma.rental.update({
				where: {
					id: rentalId,
				},
				data,
			});

			return updatedRental;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientRustPanicError) {
				throw new DBError("error getting source from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async delete(rentalId: string) {
		try {
			await this.prisma.book.delete({
				where: {
					id: rentalId,
				},
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientRustPanicError) {
				throw new DBError("error getting source from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}
}
