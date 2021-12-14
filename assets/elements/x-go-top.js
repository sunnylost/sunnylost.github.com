import { LitElement, html, css } from 'lit'

const ACTIVE_CLASS = 'active'

export class XGoTop extends LitElement {
    static styles = css`
        :host {
            position: fixed;
            right: 10em;
            bottom: -80px;
            z-index: 2000;
            -webkit-transition: all 0.5s;
            -moz-transition: all 0.5s;
            -o-transition: all 0.5s;
            transition: all 0.5s;
        }

        :host(.active) {
            bottom: 5em;
        }

        :host #btn {
            width: 80px;
            height: 80px;
            line-height: 80px;
            text-align: center;
            font-size: 50px;
            background: #eee;
            color: #f6380e;
            border-radius: 5px;
            cursor: pointer;
        }
    `

    static properties = {
        root: {
            attribute: 'root',
            type: String
        },

        _handler: {
            type: Function
        },

        rootEl: {
            type: Object
        }
    }

    constructor() {
        super()
    }

    render() {
        return html`<div id="btn" @click="${this.onClick}" title="返回顶部">▲</div>`
    }

    updated() {
        if (this._handler) {
            this.rootEl.removeEventListener('scroll', this.onScroll)
        }

        this.rootEl = this.root ? document.querySelector(this.root) : window
        this.rootEl.addEventListener('scroll', this.onScroll)
    }

    onScroll = () => {
        const top = this.rootEl.scrollTop
        const classList = this.classList

        if (top > 200) {
            if (!classList.contains(ACTIVE_CLASS)) {
                classList.add(ACTIVE_CLASS)
            }
        } else {
            classList.remove(ACTIVE_CLASS)
        }
    }

    onClick() {
        this.rootEl.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
    }
}

customElements.define('x-go-top', XGoTop)
