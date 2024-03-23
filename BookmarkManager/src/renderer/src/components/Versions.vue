<script setup lang="ts">
const electron = window.api.electron()
const chrome = window.api.chrome()
const node = window.api.node()
</script>

<template>
  <ul class="versions">
    <li class="electron-version">Electron v{{ electron }}</li>
    <li class="chrome-version">Chromium v{{ chrome }}</li>
    <li class="node-version">Node v{{ node }}</li>
  </ul>
</template>
