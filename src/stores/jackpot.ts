import { defineStore } from 'pinia';
import {
  PRIZE_JACKPOT,
  PRIZE_SMALL_JACKPOT,
  PRIZE_EMPTY,
  COUNT_JACKPOT,
  COUNT_SMALL_JACKPOT,
  GRID_SIZE_ROW,
  GRID_SIZE_COLUMN,
  USER_ALLOWED_GUESSES,
  USER_ALLOWED_GUESSES_DEBUG,
  VISITOR_GUESSES_SPEED_MIN,
  VISITOR_GUESSES_SPEED_MAX,
} from '../constants/calendar';
import { DEBUG_MODE } from '../config/env';
import { formatPrice } from '../utils/format';
import type { Cell, CellState } from '../types/jackpot.types';

export const useJackpotStore = defineStore('jackpot', {
  state: () => ({
    jackpotAmount: PRIZE_JACKPOT,
    smallJackpotAmount: PRIZE_SMALL_JACKPOT,
    emptyAmount: PRIZE_EMPTY,
    jackpotCount: COUNT_JACKPOT,
    smallJackpotCount: COUNT_SMALL_JACKPOT,
    cells: [] as Cell[],
    userGuessesRemaining: DEBUG_MODE ? USER_ALLOWED_GUESSES_DEBUG : USER_ALLOWED_GUESSES,
  }),

  getters: {
    getAmount:
      state =>
      (cellState: CellState): string => {
        if (cellState === 'jackpot') return formatPrice(state.jackpotAmount);
        if (cellState === 'small-jackpot') return formatPrice(state.smallJackpotAmount);
        return formatPrice(state.emptyAmount);
      },

    formatAmount(): (_cellState: CellState) => string {
      return cellState => {
        const amount = this.getAmount(cellState);
        return `€ ${amount}`;
      };
    },

    canUserOpenCell: (state): boolean => {
      return state.userGuessesRemaining > 0;
    },
  },

  actions: {
    async initializeGrid(): Promise<void> {
      if (this.cells.length > 0) return;

      // Check localStorage first
      const savedCells = localStorage.getItem('jackpot-cells');
      const savedGuesses = localStorage.getItem('jackpot-guesses');
      if (savedCells) {
        try {
          this.cells = JSON.parse(savedCells);
          if (savedGuesses) {
            this.userGuessesRemaining = parseInt(savedGuesses, 10);
          }
          await this.openRandomCells();
          return;
        } catch (e) {
          console.error('Failed to load saved cells:', e);
        }
      }

      // Otherwise create new grid
      const totalCells = GRID_SIZE_ROW * GRID_SIZE_COLUMN;
      const cells: Cell[] = Array.from({ length: totalCells }, (_, i) => ({
        id: i,
        state: 'closed' as CellState,
        hiddenState: 'empty' as CellState,
        row: Math.floor(i / GRID_SIZE_COLUMN),
        col: i % GRID_SIZE_COLUMN,
      }));

      const cellOrder = Array.from({ length: totalCells }, (_, i) => i);

      // Shuffle array
      for (let i = cellOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = cellOrder[i]!;
        cellOrder[i] = cellOrder[j]!;
        cellOrder[j] = temp;
      }

      // Place 1 jackpot
      for (let i = 0; i < this.jackpotCount; i++) {
        const index = cellOrder[i]!;
        const cell = cells[index];
        if (cell) cell.hiddenState = 'jackpot';
      }

      // Place 100 small jackpots
      for (let i = this.jackpotCount; i < this.jackpotCount + this.smallJackpotCount; i++) {
        const index = cellOrder[i]!;
        const cell = cells[index];
        if (cell) cell.hiddenState = 'small-jackpot';
      }

      this.cells = cells;

      // Open random cells
      await this.openRandomCells();
    },

    saveCells(): void {
      localStorage.setItem('jackpot-cells', JSON.stringify(this.cells));
      localStorage.setItem('jackpot-guesses', this.userGuessesRemaining.toString());
    },

    openUserCell(cellIndex: number): boolean {
      if (!this.canUserOpenCell) {
        return false;
      }

      const cell = this.cells[cellIndex];
      if (!cell || cell.state !== 'closed') {
        return false;
      }

      cell.state = cell.hiddenState;
      this.userGuessesRemaining--;
      this.saveCells();
      return true;
    },

    async openRandomCells(): Promise<void> {
      // Get closed cells
      const closedCells = this.cells
        .map((cell, index) => (cell.state === 'closed' ? index : -1))
        .filter(index => index !== -1);

      // Shuffle cells
      for (let i = closedCells.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = closedCells[i]!;
        closedCells[i] = closedCells[j]!;
        closedCells[j] = temp;
      }

      // Open cells
      for (let i = 0; i < closedCells.length; i++) {
        const index = closedCells[i]!;
        const cell = this.cells[index];
        if (cell) {
          cell.state = cell.hiddenState;
          if (i % 20 === 0) {
            this.saveCells();
          }
        }

        // Add random delay
        const randomDelay =
          VISITOR_GUESSES_SPEED_MIN +
          Math.random() * (VISITOR_GUESSES_SPEED_MAX - VISITOR_GUESSES_SPEED_MIN);
        await new Promise(resolve => setTimeout(resolve, randomDelay));
      }
    },
  },
});
