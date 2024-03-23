<template>
  <div v-show="isVisible" class="popup">
    <img :src="imageSrc" alt="Item image" style="max-width: 90%; height: auto" />
    <p>{{ text }}</p>
    <button @click="closePopup">Close</button>
  </div>
</template>
<script>
import { defineComponent, computed } from 'vue'
import { usePopupStore } from '@renderer/stores/popupStore'
export default defineComponent({
  name: 'PopupElement',
  setup() {
    const store = usePopupStore()
    const isVisible = computed(() => store.isVisible)
    const imageSrc = computed(() => store.imageSrc)
    const text = computed(() => store.text)

    const closePopup = () => {
      store.isVisible = false
    }

    return {
      isVisible,
      imageSrc,
      text,
      closePopup
    }
  }
})
</script>
<style scoped>
.popup {
  /* display: block;  */
  /* Initially hidden, shown when isVisible is true */
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid #ccc;
  background-color: #fff;
  padding: 20px;
  z-index: 1000; /* Ensure it's above other content */
}
p {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 100%; /* Ensure it respects the container's width */
}
</style>
