export class DBError extends Error {
	public status: number;
	public code: "DB_ERROR";

	constructor(message: string) {
		super(message);
		this.status = 500;
		this.code = "DB_ERROR";
	}
}

export class AuthorizationError extends Error {
	public status: number;
	public code: "AUTORIZATION_ERROR";

	constructor(message: string) {
		super(message);
		this.status = 401;
		this.code = "AUTORIZATION_ERROR";
	}
}

export class NotFoundError extends Error {
	public status: number;
	public code: "NOTFOUND_ERROR";

	constructor(message: string) {
		super(message);
		this.status = 404;
		this.code = "NOTFOUND_ERROR";
	}
}
