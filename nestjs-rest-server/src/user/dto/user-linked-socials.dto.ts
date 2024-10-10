export class UserLinkedSocial {
  constructor(
    public provider: string,
    public name: string | null | undefined,
    public email: string | null | undefined,
    public imageUrl: string | null | undefined,
  ) {}
}
