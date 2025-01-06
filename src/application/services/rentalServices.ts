import type { RentalRepository } from "../../infrastructure/db/rentalRepo";
import "reflect-metadata";
import { injectable, inject } from "inversify";
import { TYPES } from "../../infrastructure/entity/types";
import type {
	CreateRental,
	UpdateRental,
} from "../../infrastructure/entity/interface";

@injectable()
export class RentalServices {
	private rentalRepo: RentalRepository;

	constructor(@inject(TYPES.rentalRepo) rentalRepo: RentalRepository) {
		this.rentalRepo = rentalRepo;
	}

	async getAll(userId: string) {
		const rentals = await this.rentalRepo.getAll(userId);

		return rentals;
	}

	async getOne(rentalId: string) {
		const rental = await this.rentalRepo.getOne(rentalId);

		return rental;
	}

	async create(data: CreateRental) {
		const newRental = await this.rentalRepo.create(data);

		return newRental;
	}

	async update(rentalId: string, data: UpdateRental) {
		const updatedRental = await this.rentalRepo.update(rentalId, data);

		return updatedRental;
	}

	async delete(rentalId: string) {
		await this.rentalRepo.delete(rentalId);
	}
}
