class InfiniteGrid extends HTMLElement {
    constructor() {
        super();
        this.isRequestAnimationFramePending = false;
        const shadow = this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
      <style>
        /* Styles for your grid */
        .grid-container {
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
          width: 200px;
          /*height: 100px;*/
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
            width: 100%; /* Ensure it respects the container's width */
        }
      </style>
    `;
        // Create grid container
        this.grid = document.createElement('div');
        this.grid.classList.add('grid-container');

        // Add event listener for delete button clicks
        this.grid.addEventListener('click', (event) => {
            // Check if the clicked element is a button and has the class 'delete-button'
            if (event.target.tagName === 'BUTTON' && event.target.classList.contains('delete-button')) {
                console.log('Delete button clicked');
                // Handle delete action here, such as removing the item element
                // Navigate up the DOM to find and remove the .item element
                event.target.closest('.item').remove();
            }
        });

        // Create pop-up element
        this.popup = document.createElement('popup-element');
        document.body.appendChild(this.popup); // Append to body to cover the whole page

        // Bind the click listener function, so it can be properly removed later
        this.boundClickListener = this.handleGridClick.bind(this);
        this.grid.addEventListener('click', this.boundClickListener);

        // Create sentinel
        this.sentinel = document.createElement('div');
        this.sentinel.classList.add('sentinel');

        shadow.appendChild(this.grid);
        shadow.appendChild(this.sentinel);

        this.observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('Reached the end of the grid');
                    this.dispatchEvent(new CustomEvent('needMoreItems'));
                }
            });
        }, { rootMargin: '100px' });
    }

    handleGridClick(event) {
        let target = event.target;
        // Check if the clicked target is not the delete button
        if (!(target.classList.contains('action') || target.closest('.action'))) {
            // Ensure click inside item
            if (target.classList.contains('item') || target.closest('.item')) {
                const item = target.closest('.item');
                // Assuming img and p elements are direct children for simplicity
                const imgSrc = item.querySelector('img').src;
                const text = item.querySelector('p').textContent;

                this.popup.show(imgSrc, text); // Show the pop-up with the item's details
            }
        }
    }

    connectedCallback() {
        this.observer.observe(this.sentinel);
    }

    disconnectedCallback() {
        // Remove the event listener from the grid
        // Assuming you've stored the listener function somewhere accessible
        this.grid.removeEventListener('click', this.boundClickListener);

        // Remove the pop-up from the body if it exists
        if (this.popup && this.popup.parentNode) {
            this.popup.parentNode.removeChild(this.popup);
        }

        // Additionally, if you set up any global event listeners or timers, clean those up here
    }

    loadMoreItems(newItems) {
        newItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('item');
            itemElement.innerHTML = `
        <img src="${item.image}" alt="Item image" style="max-width: 100%; height: auto;">
        <p>${item.text}</p>
        <button class="delete-button action">Delete</button>
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