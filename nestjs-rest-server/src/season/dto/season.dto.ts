export class SeasonDto {
  number: number;
  blockStart: number;
  blockEnd: number;
  userCount: number;
  balance_in_wallets: {
    icx: number;
  };
  tasks: SeasonTaskDto[];
  rankings: SeasonRankingsDto[];
}

export class SeasonTaskDto {
  totalLastDay: number;
  description: string;
  title: string;
}

export class SeasonRankingsDto {
  address: string;
  total: number;
}
