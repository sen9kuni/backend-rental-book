import type { SessionRepository } from "../../infrastructure/db/sessionRepo";
import type { UserRepository } from "../../infrastructure/db/userRepo";
import "reflect-metadata";
import { injectable, inject } from "inversify";
import { TYPES } from "../../infrastructure/entity/types";
import { UserDTO } from "../dtos/userDTO";
import {
	AuthorizationError,
	NotFoundError,
} from "../../infrastructure/entity/errors";

@injectable()
export class AuthServices {
	private userRepo: UserRepository;
	private sessionRepo: SessionRepository;

	constructor(
		@inject(TYPES.userRepo) userRepo: UserRepository,
		@inject(TYPES.sessionRepo) sessionRepo: SessionRepository,
	) {
		this.userRepo = userRepo;
		this.sessionRepo = sessionRepo;
	}

	async registerUser(name: string, email: string, password: string) {
		const user = await this.userRepo.getOne(email);

		if (user) {
			throw new Error("user already registered");
		}

		const hashPassword = await Bun.password.hash(password);
		const newUser = await this.userRepo.create({
			name,
			email,
			password: hashPassword,
			avatar: "",
		});

		return new UserDTO(newUser).fromEntity();
	}

	async loginUser(email: string, password: string) {
		const user = await this.userRepo.getOne(email);

		if (!user) {
			throw new NotFoundError("User not found");
		}

		const matchPassword = await Bun.password.verify(password, user.password);

		if (!matchPassword) {
			throw new AuthorizationError("Invalid credential");
		}

		const session = await this.sessionRepo.create(user.id);

		return session;
	}

	async checkSession(sessionId: string) {
		const session = await this.sessionRepo.getOne(sessionId);

		if (!session) {
			throw new AuthorizationError("Session invalid");
		}

		return "valid";
	}

	async decodeSession(sessionId: string) {
		const session = await this.sessionRepo.getOne(sessionId);

		if (!session) {
			throw new AuthorizationError("session invalid");
		}

		const user = await this.userRepo.getOne(session.userId);

		if (!user) {
			throw new AuthorizationError("Session invalid");
		}
		return { user };
	}
}
