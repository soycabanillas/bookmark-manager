class PopupElement extends HTMLElement {
    constructor() {
        super(); // Always call super first in constructor
        this.attachShadow({ mode: 'open' }); // Attach a shadow DOM
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: none; /* Initially hidden */
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
            <img src="" alt="Item image" style="max-width: 90%; height: auto;">
            <p></p>
            <button id="closeBtn">Close</button>
        `;

        // Close button
        this.shadowRoot.getElementById('closeBtn').addEventListener('click', () => {
            this.hide();
        });
    }

    // Function to show the pop-up
    show(imageSrc, text) {
        this.shadowRoot.querySelector('img').src = imageSrc;
        this.shadowRoot.querySelector('p').textContent = text;
        this.style.display = 'block';
    }

    // Function to hide the pop-up
    hide() {
        this.style.display = 'none';
    }
}

export function initialize(tagName) {
    window.customElements.define(tagName, PopupElement);
}