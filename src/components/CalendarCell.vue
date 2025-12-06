<script setup lang="ts">
  import { useJackpotStore } from '../stores/jackpot';
  import type { CellState } from '../types/jackpot.types';
  import { CELL_WIDTH, CELL_HEIGHT } from '../constants/calendar';
  import { DEBUG_MODE } from '../config/env';
  import { computed } from 'vue';

  defineOptions({
    inheritAttrs: false,
  });

  interface Props {
    translateX: number;
    cellIndex: number;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{
    cellClick: [cellIndex: number];
  }>();

  const jackpotStore = useJackpotStore();

  const state = computed<CellState>(() => {
    const cell = jackpotStore.cells[props.cellIndex];
    return cell ? cell.state : 'closed';
  });

  const hiddenState = computed<CellState>(() => {
    const cell = jackpotStore.cells[props.cellIndex];
    return cell ? cell.hiddenState : 'closed';
  });

  const shouldPulse = computed<boolean>(() => {
    return (
      DEBUG_MODE &&
      state.value === 'closed' &&
      (hiddenState.value === 'jackpot' || hiddenState.value === 'small-jackpot')
    );
  });

  const getCellContent = (state: CellState): string => {
    if (state === 'closed') return '';
    return jackpotStore.formatAmount(state);
  };

  const handleCellClick = () => {
    const cell = jackpotStore.cells[props.cellIndex];
    if (cell && cell.state === 'closed') {
      emit('cellClick', props.cellIndex);
    }
  };
</script>

<template>
  <div
    v-bind="$attrs"
    class="grid-cell"
    :style="{
      width: `${CELL_WIDTH}px`,
      height: `${CELL_HEIGHT}px`,
      transform: `translateX(${props.translateX}px)`,
    }"
    @click="handleCellClick"
  >
    <span class="cell-content">
      <img
        v-if="state === 'closed'"
        src="/gold.png"
        alt="Krasvlak"
        :class="{ pulse: shouldPulse }"
      />
      <Transition name="reveal" mode="out-in">
        <div
          class="cell-opened"
          :class="{ 'is-jackpot': state === 'jackpot' || state === 'small-jackpot' }"
          v-if="state !== 'closed'"
          :key="state"
        >
          <svg
            v-if="state === 'jackpot' || state === 'small-jackpot'"
            class="star-bg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="1450 1500 565 565"
          >
            <path
              d="M2014.997,1771.725c0,22.345-45.576,38.405-51.085,59.013c-5.699,21.324,25.572,57.984,14.77,76.653   c-10.957,18.938-58.439,10.107-73.809,25.476s-6.538,62.851-25.476,73.809c-18.67,10.802-55.329-20.47-76.653-14.771   c-20.609,5.508-36.668,51.085-59.013,51.085c-22.345,0-38.405-45.576-59.014-51.085c-21.324-5.699-57.984,25.572-76.653,14.77   c-18.938-10.957-10.107-58.439-25.476-73.809c-15.37-15.37-62.851-6.538-73.809-25.476c-10.802-18.67,20.47-55.329,14.771-76.653   c-5.508-20.609-51.085-36.668-51.085-59.013c0-22.345,45.576-38.405,51.085-59.014c5.699-21.324-25.572-57.984-14.77-76.653   c10.957-18.938,58.439-10.107,73.809-25.476s6.538-62.851,25.476-73.809c18.67-10.802,55.329,20.47,76.653,14.771   c20.609-5.508,36.668-51.085,59.013-51.085s38.405,45.576,59.013,51.085c21.324,5.699,57.984-25.572,76.653-14.77   c18.938,10.957,10.107,58.439,25.476,73.809c15.37,15.37,62.851,6.538,73.809,25.476c10.802,18.67-20.47,55.329-14.771,76.653   C1969.421,1733.32,2014.997,1749.38,2014.997,1771.725z"
            />
          </svg>
          <svg
            v-else
            class="hexagon-bg"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
          >
            <path
              d="M9.166.33a2.25 2.25 0 00-2.332 0l-5.25 3.182A2.25 2.25 0 00.5 5.436v5.128a2.25 2.25 0 001.084 1.924l5.25 3.182a2.25 2.25 0 002.332 0l5.25-3.182a2.25 2.25 0 001.084-1.924V5.436a2.25 2.25 0 00-1.084-1.924L9.166.33z"
            />
          </svg>
          <span>{{ getCellContent(state) }}</span>
        </div>
      </Transition>
    </span>
  </div>
</template>

<style lang="scss" scoped>
  .grid-cell {
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cell-content {
    pointer-events: none;
    user-select: none;
    font-size: 16px;
    color: black;

    img {
      width: 40px;
      height: 40px;

      &.pulse {
        animation: pulse 1s ease-in-out infinite;
      }
    }
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(3);
    }
  }

  .reveal-enter-active {
    animation: reveal-in 0.3s ease-out;
  }

  @keyframes reveal-in {
    0% {
      opacity: 0;
      transform: scale(0.5);
    }
    50% {
      transform: scale(1.8);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  .cell-opened {
    width: 40px;
    height: 40px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cell-opened .hexagon-bg,
  .cell-opened .star-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 0;

    path {
      fill: #000000;
    }
  }

  .cell-opened.is-jackpot {
    span {
      color: #000000;
    }

    .star-bg path {
      fill: #ffffff;
    }
  }

  .cell-opened span {
    position: relative;
    z-index: 1;
    font-size: 12px;
    color: #ffffff;
  }
</style>
