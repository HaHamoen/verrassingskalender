<script setup lang="ts">
  import { useJackpotStore } from '../stores/jackpot';
  import { useConfetti } from '../composables/useConfetti';
  import { computed, watch, ref } from 'vue';
  import {
    PRIZE_SMALL_JACKPOT,
    PRIZE_JACKPOT,
    USER_ALLOWED_GUESSES,
    USER_ALLOWED_GUESSES_DEBUG,
    COUNT_SMALL_JACKPOT,
    COUNT_JACKPOT,
    GRID_SIZE_ROW,
    GRID_SIZE_COLUMN,
  } from '../constants/calendar';
  import { DEBUG_MODE } from '../config/env';
  import { formatPrice } from '../utils/format';

  const jackpotStore = useJackpotStore();
  const { triggerSimpleConfetti } = useConfetti();
  const totalCells = GRID_SIZE_ROW * GRID_SIZE_COLUMN;
  const allowedGuesses = DEBUG_MODE ? USER_ALLOWED_GUESSES_DEBUG : USER_ALLOWED_GUESSES;

  const animateSmallJackpot = ref(false);
  const animateJackpot = ref(false);
  const smallJackpotRef = ref<HTMLElement | null>(null);
  const jackpotRef = ref<HTMLElement | null>(null);

  const guessesRemaining = computed(() => jackpotStore.userGuessesRemaining);
  const smallJackpotsOpened = computed(
    () =>
      jackpotStore.cells.filter(
        cell => cell.hiddenState === 'small-jackpot' && cell.state !== 'closed'
      ).length
  );
  const jackpotsOpened = computed(
    () =>
      jackpotStore.cells.filter(cell => cell.hiddenState === 'jackpot' && cell.state !== 'closed')
        .length
  );
  const closedCells = computed(
    () => jackpotStore.cells.filter(cell => cell.state === 'closed').length
  );
  const smallJackpotLabel = computed(
    () => `€ ${formatPrice(PRIZE_SMALL_JACKPOT)} jackpots gevallen`
  );
  const jackpotLabel = computed(() => `€ ${formatPrice(PRIZE_JACKPOT)} jackpot gevallen`);

  watch(smallJackpotsOpened, (newVal, oldVal) => {
    if (newVal > oldVal) {
      animateSmallJackpot.value = true;
      setTimeout(() => {
        animateSmallJackpot.value = false;
        if (smallJackpotRef.value) {
          triggerSimpleConfetti(smallJackpotRef.value);
        }
      }, 300);
    }
  });

  watch(jackpotsOpened, (newVal, oldVal) => {
    if (newVal > oldVal) {
      animateJackpot.value = true;
      setTimeout(() => {
        animateJackpot.value = false;
        if (jackpotRef.value) {
          triggerSimpleConfetti(jackpotRef.value);
        }
      }, 300);
    }
  });
</script>

<template>
  <div class="stats-container">
    <div class="cells-counter">
      <span class="counter-label">Kansen:</span>
      <span class="counter-value">
        <span class="current">{{ guessesRemaining }}</span>
        <span class="separator">/</span>
        <span class="total">{{ allowedGuesses }}</span>
      </span>
    </div>
    <div class="cells-counter">
      <span class="counter-label">Vakjes over:</span>
      <span class="counter-value">
        <span class="current">{{ closedCells }}</span>
        <span class="separator">/</span>
        <span class="total">{{ totalCells }}</span>
      </span>
    </div>
    <div class="cells-counter">
      <span class="counter-label">{{ smallJackpotLabel }}:</span>
      <span class="counter-value">
        <span
          ref="smallJackpotRef"
          class="current"
          :class="{ 'animate-pop': animateSmallJackpot }"
          >{{ smallJackpotsOpened }}</span
        >
        <span class="separator">/</span>
        <span class="total">{{ COUNT_SMALL_JACKPOT }}</span>
      </span>
    </div>
    <div class="cells-counter">
      <span class="counter-label">{{ jackpotLabel }}:</span>
      <span class="counter-value">
        <span ref="jackpotRef" class="current" :class="{ 'animate-pop': animateJackpot }">{{
          jackpotsOpened
        }}</span>
        <span class="separator">/</span>
        <span class="total">{{ COUNT_JACKPOT }}</span>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .stats-container {
    position: sticky;
    top: 16px;
    left: 0;
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
    margin: 16px 0;
    z-index: 10;

    @media (max-width: 768px) {
      display: none;
    }
  }

  .cells-counter {
    padding: 10px 20px;
    background: #003084;
    color: white;
    border-radius: 8px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;

    .counter-label {
      font-size: 14px;
    }

    .counter-value {
      font-size: 20px;
      color: #ffd700;
      display: flex;
      align-items: baseline;
      gap: 4px;

      .current {
        font-weight: 700;
        font-size: 24px;
      }

      .separator {
        font-size: 18px;
        opacity: 0.7;
      }

      .total {
        font-size: 16px;
        opacity: 0.8;
      }
    }
  }

  .animate-pop {
    animation: pop 0.3s ease-out;
  }

  @keyframes pop {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
