import { LitElement, html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { IBookmark } from "../../preload/dbconnectionapi";


@customElement('infinite-grid')
export class InfiniteGrid extends LitElement {
  @state() items: IBookmark[] = []

  static styles = css`
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
  `;

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    // Observer and other initializations can be moved to connectedCallback or kept here but adapted
  }

  connectedCallback() {
    super.connectedCallback()
    // IntersectionObserver setup and other initialization logic here
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    // Cleanup logic here
  }

  loadMoreItems(newItems: IBookmark[]) {
    this.items = [...this.items, ...newItems]
    // Additional logic for handling requestAnimationFrame, if necessary
  }

  render() {
    return html`
      <div class="grid-container">
        ${this.items.map(item => html`
          <div class="item">
            <img src="${item.thumbnail}" alt="Item image" style="max-width: 100%; height: auto;">
            <p>${item.title}</p>
            <button class="delete-button action" @click="${this.deleteItem}">Delete</button>
          </div>
        `)}
        <div class="sentinel"></div>
      </div>
    `
  }

  deleteItem(event: Event) {
    const button = event.target as HTMLElement
    const itemElement = button.closest('.item')
    if (itemElement) {
      // Find the item index and remove it from the items array
      const index = this.items.findIndex(item => item.title === itemElement.querySelector('p')?.textContent);
      if (index > -1) {
        this.items.splice(index, 1)
        this.requestUpdate() // Request an update to re-render the component
      }
    }
  }

  // Add more methods as needed
}
