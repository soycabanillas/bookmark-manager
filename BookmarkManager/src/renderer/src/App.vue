<template>
  <img alt="logo" class="logo" src="./assets/electron.svg" />
  <div class="creator">Powered by electron-vite</div>
  <div class="text">
    Build an Electron app with
    <span class="vue">Vue</span>
    and
    <span class="ts">TypeScript</span>
  </div>
  <p class="tip">Please try pressing <code>F12</code> to open the devTool</p>
  <div class="actions">
    <div class="action">
      <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">Documentation</a>
    </div>
    <div class="action">
      <a target="_blank" rel="noreferrer" @click="ipcHandle">Send IPC</a>
    </div>
  </div>
  <Versions />
  <PopupElement />
  <InfiniteGrid ref="infiniteGridRef" />
</template>
<script setup lang="ts">
import { ref } from 'vue'
import Versions from './components/Versions.vue'
import InfiniteGrid from './components/InfiniteGrid.vue'
import PopupElement from './components/PopupElement.vue'
import { IBookmark } from '@preload/dbconnectionapi'

const infiniteGridRef = ref(InfiniteGrid)

const ipcHandle = async () => {
  if (infiniteGridRef.value) {
    const bookmarks: IBookmark[] | null = await window.api.doAThing(10, 50)
    infiniteGridRef.value.loadMoreItems(bookmarks)
  }
}
</script>
