import { defineStore } from 'pinia'

export const usePopupStore = defineStore('popup', {
  state: () => ({
    isVisible: false,
    imageSrc: '',
    text: ''
  }),
  actions: {
    showPopup(imageSrc: string, text: string) {
      this.imageSrc = imageSrc
      this.text = text
      this.isVisible = true
    },
    hidePopup() {
      this.text = ''
      this.isVisible = false
    }
  }
})
