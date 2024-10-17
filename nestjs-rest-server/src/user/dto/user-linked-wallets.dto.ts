import { ChainType } from "../../shared/models/enum/ChainType";

export class UserLinkedWalletsDto {
  constructor(
    public address: string,
    public type: ChainType,
  ) {}
}
