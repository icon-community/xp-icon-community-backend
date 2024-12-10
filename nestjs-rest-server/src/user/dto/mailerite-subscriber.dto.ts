export class MaileriteSubscriberDto {
  constructor(
    public readonly email: string,
    public readonly created_at: string,
    public readonly status: string,
  ) {}
}
