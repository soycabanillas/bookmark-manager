<template>
  <div class="grid-container">
    <div v-for="item in items" :key="item.title" class="item" @click="showItem(item)">
      <img :src="item.thumbnail" alt="Item image" style="max-width: 100%; height: auto" />
      <p>{{ item.title }}</p>
      <button class="delete-button action" @click="deleteItem(item)">Delete</button>
    </div>
    <div class="sentinel"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { usePopupStore } from '@renderer/stores/popupStore'
import type { IBookmark } from '@preload/dbconnectionapi' // Update the path according to your project structure

export default defineComponent({
  name: 'InfiniteGrid',
  setup() {
    const items = ref<IBookmark[]>([])

    const store = usePopupStore()

    function showItem(item) {
      store.showPopup(item.imageSrc, item.title)
    }

    const loadMoreItems = (newItems: IBookmark[]) => {
      items.value = [...items.value, ...newItems]
      // Additional logic for handling requestAnimationFrame, if necessary
    }

    const deleteItem = (itemToDelete: IBookmark) => {
      const index = items.value.findIndex((item) => item.title === itemToDelete.title)
      if (index > -1) {
        items.value.splice(index, 1)
      }
    }

    // If you have initialization logic, consider using onMounted lifecycle hook
    // If you have cleanup logic, consider using onUnmounted lifecycle hook

    return {
      items,
      showItem,
      loadMoreItems,
      deleteItem
    }
  }
})
</script>

<style scoped>
.grid-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}
.item {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.sentinel {
  width: 100%;
  height: 50px;
  clear: both;
}
p {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
}
</style>
