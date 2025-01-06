// IUser
// ISession
// INote

import type { Session, User, Book, Rental } from "@prisma/client";

export type CreateUser = Omit<User, "id">;
export type UpdateUser = Partial<User>;
export type CreateBook = Omit<Book, "id" | "lastUpdatedAt">;
export type UpdateBook = Partial<Book>;
export type CreateRental = Omit<Rental, "id">;
export type UpdateRental = Partial<Rental>;
export type DataBook = Book;

export interface IUser {
	getAll: () => Promise<User[]>;
	getOne: (id: string) => Promise<User | null>;
	create: (data: CreateUser) => Promise<User>;
	update: (id: string, data: UpdateUser) => Promise<User>;
	delete: (id: string) => Promise<void>;
}

export interface ISession {
	getOne: (sessionId: string) => Promise<Session | null>;
	create: (userId: string) => Promise<Session>;
	delete: (sessionId: string) => Promise<void>;
}

export interface IBook {
	getAll: (search?: string) => Promise<Book[]>;
	getOne: (id: string) => Promise<Book | null>;
	create: (data: CreateBook) => Promise<Book>;
	update: (id: string, data: UpdateBook) => Promise<Book>;
	delete: (id: string) => Promise<void>;
}

export interface IRental {
	getAll: (userId: string) => Promise<Rental[]>;
	getOne: (id: string) => Promise<Rental | null>;
	create: (data: CreateRental) => Promise<Rental>;
	update: (id: string, data: UpdateRental) => Promise<Rental>;
	delete: (id: string) => Promise<void>;
}
