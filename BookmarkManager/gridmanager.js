class InfiniteGrid extends HTMLElement {
    constructor() {
        super();
        this.isRequestAnimationFramePending = false;
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
      <style>
        /* Styles for your grid */
        .grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }
        .item {
          /* Example item styling, adjust as needed */
          border: 1px solid #ccc;
          padding: 10px;
          margin: 10px;
          width: 100px;
          height: 100px;
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
      </style>
      <div class="grid"></div>
      <div class="sentinel"></div>
    `;

        this.grid = this.shadowRoot.querySelector('.grid');
        this.sentinel = this.shadowRoot.querySelector('.sentinel');

        this.observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('Reached the end of the grid');
                    this.dispatchEvent(new CustomEvent('needMoreItems'));
                }
            });
        }, { rootMargin: '100px' });
    }

    connectedCallback() {
        this.observer.observe(this.sentinel);
    }

    disconnectedCallback() {
        this.observer.disconnect();
    }

    loadMoreItems(newItems) {
        newItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('item');
            itemElement.innerHTML = `
        <img src="${item.image}" alt="Item image" style="max-width: 100%; height: auto;">
        <p>${item.text}</p>
      `;
            this.grid.appendChild(itemElement);
        });

        if (!this.isRequestAnimationFramePending) {
            this.isRequestAnimationFramePending = true;
            this.observer.unobserve(this.sentinel);

            // Wait for the DOM to update
            requestAnimationFrame(() => {
                this.isRequestAnimationFramePending = false;
                this.observer.observe(this.sentinel);
            });
        }
    }
}

export function initialize(tagName) {
    window.customElements.define(tagName, InfiniteGrid);
}