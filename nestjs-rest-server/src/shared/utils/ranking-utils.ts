import { RankData } from "../models/types/RankedTypes";

export function getRankingOfSeasonReduced(rankData: RankData[]) {
  const reducedData = [];
  for (let i = 0; i < rankData.length; i++) {
    reducedData.push({
      address: rankData[i].address,
      total: rankData[i].total,
    });
  }
  return reducedData;
}
