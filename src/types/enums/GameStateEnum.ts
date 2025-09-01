export const GameStates = {
  LOADING: "LOADING",
  PLAYING: "PLAYING",
  REVEALING: "REVEALING",
  INVALID_GUESS: "INVALID_GUESS",
  WON: "WON",
  LOST: "LOST",
  ERROR: "ERROR",
} as const;

export type GameStatesEnum = (typeof GameStates)[keyof typeof GameStates];
