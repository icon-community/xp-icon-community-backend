export class ReferralDto {
  constructor(
    public referrerUserAddress: string,
    public referredUserAddress: string,
    public createdAt: Date,
    public isProcessed: boolean,
  ) {
  }
}
