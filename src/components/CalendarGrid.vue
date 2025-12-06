<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useVirtualizer } from '@tanstack/vue-virtual';
  import { useJackpotStore } from '../stores/jackpot';
  import CalendarCell from './CalendarCell.vue';
  import CalendarStats from './CalendarStats.vue';
  import CalendarScratch from './CalendarScratch.vue';
  import { CELL_HEIGHT, CELL_WIDTH, GRID_SIZE_COLUMN, GRID_SIZE_ROW } from '../constants/calendar';

  const parentRef = ref<HTMLElement | null>(null);
  const jackpotStore = useJackpotStore();
  const scratchDialog = ref<InstanceType<typeof CalendarScratch> | null>(null);
  const selectedCellIndex = ref<number>(0);

  jackpotStore.initializeGrid();

  const handleCellClick = (cellIndex: number) => {
    selectedCellIndex.value = cellIndex;
    scratchDialog.value?.open();
  };

  const rowVirtualizer = useVirtualizer({
    count: GRID_SIZE_ROW,
    getScrollElement: () => parentRef.value,
    estimateSize: () => CELL_HEIGHT,
    overscan: 5,
  });

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: GRID_SIZE_COLUMN,
    getScrollElement: () => parentRef.value,
    estimateSize: () => CELL_WIDTH,
    overscan: 5,
  });

  const virtualRows = computed(() => rowVirtualizer.value.getVirtualItems());
  const virtualColumns = computed(() => columnVirtualizer.value.getVirtualItems());
  const totalHeight = computed(() => rowVirtualizer.value.getTotalSize());
  const totalWidth = computed(() => columnVirtualizer.value.getTotalSize());
</script>

<template>
  <div ref="parentRef" class="grid-content">
    <CalendarStats />
    <div
      :style="{
        height: `${totalHeight}px`,
        width: `${totalWidth}px`,
        position: 'relative',
      }"
    >
      <div
        v-for="row in virtualRows"
        :key="`row-${row.index}`"
        :data-row-index="row.index"
        class="virtual-row"
        :style="{
          height: `${row.size}px`,
          transform: `translateY(${row.start}px)`,
        }"
      >
        <CalendarCell
          v-for="col in virtualColumns"
          :key="`col-${col.index}`"
          :data-col-index="col.index"
          :translate-x="col.start"
          :cell-index="row.index * GRID_SIZE_COLUMN + col.index"
          @cell-click="handleCellClick"
        />
      </div>
    </div>
  </div>

  <CalendarScratch ref="scratchDialog" :cell-index="selectedCellIndex" />
</template>

<style lang="scss" scoped>
  .grid-content {
    width: 100%;
    overflow: auto;
    max-height: calc(100vh - 85px);
    @include green-pattern-background;
  }

  .virtual-row {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
  }
</style>
