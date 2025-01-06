import { Container } from "inversify";
import { TYPES } from "../infrastructure/entity/types";
import { UserRepository } from "../infrastructure/db/userRepo";
import { SessionRepository } from "../infrastructure/db/sessionRepo";
import { PrismaClient } from "@prisma/client";
import { AuthServices } from "./services/authServices";
import { BookRepository } from "../infrastructure/db/bookRepo";
import { BookServices } from "./services/bookServices";
import { RentalRepository } from "../infrastructure/db/rentalRepo";
import { RentalServices } from "./services/rentalServices";

const container = new Container();

container.bind(TYPES.prisma).toConstantValue(new PrismaClient());

container.bind(TYPES.userRepo).to(UserRepository);
container.bind(TYPES.sessionRepo).to(SessionRepository);
container.bind(TYPES.bookRepo).to(BookRepository);
container.bind(TYPES.rentalRepo).to(RentalRepository);

container.bind(AuthServices).toSelf();
container.bind(BookServices).toSelf();
container.bind(RentalServices).toSelf();

// instances
export const authServices = container.get<AuthServices>(AuthServices);
export const bookServices = container.get<BookServices>(BookServices);
export const rentalServices = container.get<RentalServices>(RentalServices);
