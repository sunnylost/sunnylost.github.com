import { LitElement, html, css } from 'lit'

let timeoutId

export class XProgressbar extends LitElement {
    static styles = css`
        :host #progressbar {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 10px;
            z-index: 1000;
        }

        :host #progress {
            background: #03a678;
            height: 100%;
            width: 0;
            -webkit-transition: width 0.8s;
            -moz-transition: width 0.8s;
            -o-transition: width 0.8s;
            transition: width 0.8s;
        }
    `

    static properties = {
        root: {
            attribute: 'root',
            type: String
        }
    }

    render() {
        return html`
            <div id="progressbar">
                <div id="progress"></div>
            </div>
        `
    }

    ready() {
        const changeProgressbar = this.changeProgressbar.bind(this)
        this.progressEl = this.$.progress
        this.rootEl = document.querySelectorAll(this.root)[0]
        this.rootEl.addEventListener('scroll', changeProgressbar)
        window.addEventListener('resize', changeProgressbar)
        /**
         * init progressbar
         */
        changeProgressbar()
    }

    changeProgressbar() {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            const root = this.rootEl
            this.progressEl.style.width =
                ((root.scrollTop + window.innerHeight) / root.scrollHeight) * 100 + '%'
        }, 100)
    }
}

customElements.define('x-progressbar', XProgressbar)
