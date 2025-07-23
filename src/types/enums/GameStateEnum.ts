export const GameStates = {
  LOADING: "LOADING",
  PLAYING: "PLAYING",
  REVEALING: "REVEALING",
  WON: "WON",
  LOST: "LOST",
} as const;

export type GameStatesEnum = (typeof GameStates)[keyof typeof GameStates];
