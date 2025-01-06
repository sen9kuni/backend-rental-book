import type { BookRepository } from "../../infrastructure/db/bookRepo";
import "reflect-metadata";
import { injectable, inject } from "inversify";
import { TYPES } from "../../infrastructure/entity/types";
import type {
	CreateBook,
	UpdateBook,
} from "../../infrastructure/entity/interface";

@injectable()
export class BookServices {
	private bookRepo: BookRepository;

	constructor(@inject(TYPES.bookRepo) bookRepo: BookRepository) {
		this.bookRepo = bookRepo;
	}

	async getAll(search?: string) {
		const books = await this.bookRepo.getAll(search);

		return books;
	}

	async getOne(bookId: string) {
		const book = await this.bookRepo.getOne(bookId);

		return book;
	}

	async create(data: CreateBook) {
		const newBook = await this.bookRepo.create(data);

		return newBook;
	}

	async update(bookId: string, data: UpdateBook) {
		const updatedBook = await this.bookRepo.update(bookId, data);

		return updatedBook;
	}

	async delete(bookId: string) {
		await this.bookRepo.delete(bookId);
	}
}
