import { LitElement, html, css } from 'lit'

const NAV_OPEN_CLASS = 'site-nav-open'
const NAV_TRANSITION_CLASS = 'site-nav-transition'
const eventNames = ['transitionend', 'webkitTransitionEnd']
let classList

function addTransitionEndEvent(el, fn) {
    eventNames.forEach(function (v) {
        el.addEventListener(v, fn)
    })
}

function removeTransitionEndEvent(el, fn) {
    eventNames.forEach(function (v) {
        el.removeEventListener(v, fn)
    })
}

function afterTransition() {
    if (!classList.contains(NAV_OPEN_CLASS)) {
        classList.remove(NAV_TRANSITION_CLASS)
        removeTransitionEndEvent(this, afterTransition)
    }
}

export class XMenu extends LitElement {
    static styles = css`
        :host {
            position: absolute;
            height: 100%;
            font-size: 16px;
            z-index: 2000;
        }

        .site-nav {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
        }

        .site-nav-logo {
            width: 60px;
            height: 60px;
            margin: 10px;
            background: url('../imgs/avatar1.png');
            background-size: 60px;
            border: 0;
            outline: none;
            border-radius: 50%;
            cursor: pointer;
            -webkit-transition: opacity 0.5s;
            -moz-transition: opacity 0.5s;
            -o-transition: opacity 0.5s;
            transition: opacity 0.5s;
        }

        .site-nav-container {
            display: none;
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 200px;
            background: #03a678;
        }

        .site-nav-list {
            margin-top: 100px;
        }

        .site-nav-list li {
            list-style: none;
        }

        .site-nav-list a {
            display: block;
            width: 70%;
            margin: auto;
            padding: 0.5em;
            color: #fff;
            text-align: center;
            font-size: 1.5em;
            text-decoration: none;
            -webkit-transition: all 0.8s;
            -moz-transition: all 0.8s;
            -o-transition: all 0.8s;
            transition: all 0.8s;
        }

        .site-nav-list a:hover {
            color: #03a678;
            background: #fff;
        }

        :host-context(.site-nav-transition) .site-nav-logo {
            opacity: 0;
        }

        :host-context(.site-nav-transition) .site-nav-container {
            display: block;
        }
    `

    render() {
        return html`
            <nav class="site-nav">
                <button class="site-nav-logo" title="menu" @click="${this.menuClick}"></button>
                <div class="site-nav-container">
                    <ul class="site-nav-list">
                        <li><a href="/">Home</a></li>
                        <li><a href="/article">Articles</a></li>
                        <li><a href="/demo">Demo</a></li>
                        <li>
                            <a
                                href="https://github.com/sunnylost/sunnylost.github.com/"
                                target="_blank"
                                >GitHub</a
                            >
                        </li>
                        <li><a href="/about">About</a></li>
                    </ul>
                </div>
            </nav>
        `
    }

    ready() {
        classList = document.body.classList
        const content = document.querySelector('.content')
        content.addEventListener('click', function () {
            classList.remove(NAV_OPEN_CLASS)
            addTransitionEndEvent(content, afterTransition)
        })
    }

    menuClick() {
        classList.add(NAV_OPEN_CLASS, NAV_TRANSITION_CLASS)
    }
}

customElements.define('x-menu', XMenu)
