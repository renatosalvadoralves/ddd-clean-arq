export class InvalidUuidError extends Error {
    constructor(id: string) {
        super(`Invalid UUID: ${id}`);
        this.name = "InvalidUuidError"
    }
}

export default InvalidUuidError;