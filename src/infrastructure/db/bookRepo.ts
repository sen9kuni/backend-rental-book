import { Prisma, type PrismaClient } from "@prisma/client";
import type {
	CreateBook,
	DataBook,
	IBook,
	UpdateBook,
} from "../entity/interface";
import { injectable, inject } from "inversify";
import { TYPES } from "../entity/types";
import { DBError } from "../entity/errors";

@injectable()
export class BookRepository implements IBook {
	private prisma: PrismaClient;

	constructor(@inject(TYPES.prisma) prisma: PrismaClient) {
		this.prisma = prisma;
	}

	async getAll(search?: string) {
		try {
			let books: DataBook[] = [];
			if (!search || search.trim() === "") {
				books = await this.prisma.book.findMany();
			} else {
				books = await this.prisma.book.findMany({
					where: {
						OR: [
							{
								title: {
									contains: search.toLowerCase(), // Case-insensitive search by title
									// mode: 'insensitive', //! Makes the search case-insensitive, active it when move to postgresql
								},
							},
							{
								author: {
									contains: search.toLowerCase(), // Case-insensitive search by author
									// mode: 'insensitive', //! Makes the search case-insensitive, active it when move to postgresql
								},
							},
						],
					},
				});
			}
			return books;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientRustPanicError) {
				throw new DBError("error getting source from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async getOne(bookId: string) {
		try {
			const book = await this.prisma.book.findUnique({
				where: {
					id: bookId,
				},
			});
			if (!book) {
				return null;
			}

			return book;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientRustPanicError) {
				throw new DBError("error getting source from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async create(data: CreateBook) {
		try {
			const newBook = await this.prisma.book.create({
				data,
			});

			return newBook;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientRustPanicError) {
				throw new DBError("error getting source from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async update(bookId: string, data: UpdateBook) {
		try {
			const updatedBook = await this.prisma.book.update({
				where: {
					id: bookId,
				},
				data,
			});

			return updatedBook;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientRustPanicError) {
				throw new DBError("error getting source from DB");
			}

			throw new DBError("Something went wrong while doing DB operation");
		}
	}

	async delete(bookId: string) {
		try {
			await this.prisma.book.delete({
				where: {
					id: bookId,
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
