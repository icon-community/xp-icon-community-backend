import { sumXp24hrs } from "../../src/shared/utils/xp-util";
import { FormattedUserTask } from "../../src/shared/models/types/FormattedTypes";
import { Status } from "../../src/shared/models/enum/Status";

const data: { xp: FormattedUserTask }[] = [
  {
    xp: {
      status: Status.PENDING,
      xpEarned: [
        { xp: 54.9597710846092, block: 92548702, period: 1905 },
        { xp: 54.9597710846092, block: 92591822, period: 1906 },
        { xp: 54.9597710846092, block: 92634942, period: 1907 },
        { xp: 54.9597710846092, block: 92678062, period: 1908 },
        { xp: 0, block: 92721182, period: 1909 },
      ],
    },
  },
  {
    xp: { status: Status.PENDING, xpEarned: [{ xp: 420, block: 92548702, period: 1905 }] },
  },
  {
    xp: {
      status: Status.PENDING,
      xpEarned: [
        { xp: 592.209534, block: 92548702, period: 1905 },
        { xp: 581.1866382000001, block: 92591822, period: 1906 },
        { xp: 519.1207406, block: 92634942, period: 1907 },
        { xp: 547.544396, block: 92678062, period: 1908 },
        { xp: 0, block: 92721182, period: 1909 },
      ],
    },
  },
  {
    xp: {
      status: Status.PENDING,
      xpEarned: [
        { xp: 0, block: 92548702, period: 1905 },
        { xp: 0, block: 92591822, period: 1906 },
        { xp: 0, block: 92634942, period: 1907 },
        { xp: 0, block: 92678062, period: 1908 },
        { xp: 1777, block: 92721182, period: 1909 },
      ],
    },
  },
  {
    xp: {
      status: Status.PENDING,
      xpEarned: [{ xp: 3000, block: 92721182, period: 0 }],
    },
  },
  {
    xp: {
      status: Status.PENDING,
      xpEarned: [
        { xp: 0, block: 92548702, period: 1905 },
        { xp: 0, block: 92591822, period: 1906 },
        { xp: 0, block: 92634942, period: 1907 },
        { xp: 123, block: 92678062, period: 1908 },
      ],
    },
  },
  {
    xp: { status: Status.PENDING, xpEarned: [{ xp: 3000, block: 0, period: 0 }] },
  },
];

describe("xp-utils unit tests.", () => {
  //give me a comment for the "it"
  it("XP result should be equal to 1777", () => {
    const result = sumXp24hrs(data);
    expect(result).toBe(1777);
  });
});
