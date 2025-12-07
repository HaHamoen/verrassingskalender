<script setup lang="ts">
  import { ref, reactive, nextTick, watch } from 'vue';
  import { ScratchCard, SCRATCH_TYPE } from 'scratchcard-js';
  import { useJackpotStore } from '../stores/jackpot';
  import { useConfetti } from '../composables/useConfetti';
  import type { CellState } from '../types/jackpot.types';
  import '../styles/calendarScratch.scss';

  const props = defineProps<{ cellIndex: number }>();

  const jackpotStore = useJackpotStore();
  const { triggerConfetti } = useConfetti();
  const showDialog = ref(false);
  const scratchContainer = ref<HTMLDivElement | null>(null);
  let scratchCard: ScratchCard | null = null;

  const snackbar = reactive({
    show: false,
    text: '',
    color: 'info' as string,
  });

  const getCellContent = (state: CellState): string => {
    if (state === 'closed') return '';
    return jackpotStore.formatAmount(state);
  };

  const showSnackbar = (text: string, color: string = 'info') => {
    snackbar.text = text;
    snackbar.color = color;
    snackbar.show = true;
  };

  const open = () => {
    if (!jackpotStore.canUserOpenCell) {
      showSnackbar('Je mag maar 1 vakje per dag openen.', 'error');
      return;
    }

    showDialog.value = true;
    nextTick(() => {
      initScratchCard();
    });
  };

  const initScratchCard = () => {
    if (!scratchContainer.value) return;

    // Clean up existing scratch card if any
    if (scratchCard) {
      scratchCard = null;
    }

    // Clear the container
    scratchContainer.value.innerHTML = '';

    const cell = jackpotStore.cells[props.cellIndex];
    const content = getCellContent(cell?.hiddenState || 'empty');

    scratchCard = new ScratchCard(scratchContainer.value, {
      scratchType: SCRATCH_TYPE.CIRCLE,
      containerWidth: 300,
      containerHeight: 200,
      imageForwardSrc: `${import.meta.env.BASE_URL}scratchcard.png`,
      imageBackgroundSrc: '',
      htmlBackground: `<div class="scratch-content"><h1>${content}</h1></div>`,
      brushSrc: '',
      clearZoneRadius: 40,
      nPoints: 30,
      pointSize: 4,
      enabledPercentUpdate: true,
      percentToFinish: 70,
      callback: handleScratchComplete,
    });

    scratchCard.init();
  };

  const confirmReveal = () => {
    const success = jackpotStore.openUserCell(props.cellIndex);
    if (success) {
      showDialog.value = false;
    }
  };

  const handleScratchComplete = () => {
    const cell = jackpotStore.cells[props.cellIndex];
    if (!cell) return;

    jackpotStore.openUserCell(props.cellIndex);

    if (cell.hiddenState === 'jackpot') {
      triggerConfetti();
      showSnackbar(
        `Gefeliciteerd! Je hebt de jackpot van ${getCellContent(cell.hiddenState)} gewonnen!`,
        'success'
      );
    } else if (cell.hiddenState === 'small-jackpot') {
      triggerConfetti();
      showSnackbar(
        `Gefeliciteerd! Je hebt ${getCellContent(cell.hiddenState)} gewonnen!`,
        'success'
      );
    } else {
      showSnackbar('Helaas, probeer het morgen weer!', 'warning');
    }

    confirmReveal();
  };

  watch(showDialog, newVal => {
    if (!newVal && scratchCard) {
      scratchCard = null;
    }
  });

  defineExpose({
    open,
  });
</script>

<template>
  <v-dialog v-model="showDialog" max-width="450" persistent>
    <v-card>
      <v-card-title class="text-h5 text-center">Wil je dit krasvakje openen?</v-card-title>
      <v-card-text>
        Kras dit vakje open om te ontdekken wat erin zit! Je maakt kans op een grote prijs!
      </v-card-text>
      <div class="scratch-wrapper">
        <div ref="scratchContainer" class="sc__container"></div>
      </div>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="showDialog = false">Sluiten</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
    {{ snackbar.text }}
  </v-snackbar>
</template>

<style lang="scss" scoped>
  .scratch-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }

  .scratch-container {
    position: relative;
    overflow: hidden;
    width: 300px;
    height: 200px;
  }
</style>
