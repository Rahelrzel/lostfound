class HttpError extends Error {
  status: number;
  errors: string[];

  constructor({
    status,
    message,
    errors,
  }: {
    status: number;
    message: string;
    errors?: string[];
  }) {
    super(message);
    this.status = status;
    this.errors = errors ?? [];
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export default HttpError;