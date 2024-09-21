export class CreateReferralDto {
  constructor(
    public referrerUserAddress: string,
    public referredUserAddress: string,
    public referralCode: string,
  ) {}
}
