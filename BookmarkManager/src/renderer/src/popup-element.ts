import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('popup-element')
export class PopupElement extends LitElement {
  @property({ type: String }) imageSrc: string
  @property({ type: String }) text: string

  static styles = css`
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
  `;

  constructor() {
    super();
    // Initialize the properties with default values in the constructor
    this.imageSrc = '';
    this.text = '';
  }

  render() {
    return html`
      <img src="${this.imageSrc}" alt="Item image" style="max-width: 90%; height: auto;">
      <p>${this.text}</p>
      <button id="closeBtn" @click="${this.hide}">Close</button>
    `;
  }

  show(imageSrc: string, text: string) {
    this.imageSrc = imageSrc;
    this.text = text;
    this.style.display = 'block';
  }

  hide() {
    this.style.display = 'none';
  }
}

//customElements.define('popup-element', PopupElement);
