export type CellState = 'closed' | 'jackpot' | 'small-jackpot' | 'empty';

export interface Cell {
  id: number;
  state: CellState;
  hiddenState: CellState;
  row: number;
  col: number;
}
