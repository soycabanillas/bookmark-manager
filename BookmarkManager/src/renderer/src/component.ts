import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('my-app')
class MyApp extends LitElement {
    static styles = css`/* Your CSS here */`;

    render() {
        return html`<p>Hello from Lit!</p>`;
    }
}
