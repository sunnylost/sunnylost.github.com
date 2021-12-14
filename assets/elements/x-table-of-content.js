import { LitElement, html, css } from 'lit'

const ACTIVE_CLASS = 'active'

export class XTableOfContent extends LitElement {
    static styles = css`
        :host {
            position: fixed;
            left: 20%;
            top: 110px;
            bottom: 10px;
            overflow-x: hidden;
            overflow-y: auto;
            margin-left: -100px;
        }

        :host .on {
            display: block;
        }

        :host .off {
            display: none;
        }

        :host h3 {
            padding-bottom: 0.5em;
            border-bottom: 1px solid #ddd;
            width: 60%;
        }

        :host li {
            position: relative;
            padding: 0;
            list-style: none;
        }

        :host li::before {
            content: '#';
            position: absolute;
            top: 5px;
            font-size: 12px;
            color: #000;
        }

        :host li.active {
            background: #03a678;
        }

        :host a {
            display: inline-block;
            width: 10em;
            height: 30px;
            line-height: 30px;
            padding-left: 15px;
            font-size: 16px;
            text-decoration: none;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: #555;
        }

        :host a:hover {
            text-decoration: underline;
        }

        :host li.active::before,
        :host li.active a {
            color: #fff;
        }
    `

    static properties = {
        root: {
            attribute: 'root',
            type: String
        },
        content: {
            attribute: 'content',
            type: String
        }
    }

    render() {
        return html`
            <ul id="toc" class="{{onOrOff}}">
                <h3>目录</h3>
                <template repeat="{{t in titles}}">
                    <li>
                        <a
                            href="{{'#'}}"
                            title="{{t.name}}"
                            index="{{t.index}}"
                            @click="${this.jump}"
                            >{{t.name}}</a
                        >
                    </li>
                </template>
            </ul>
        `
    }

    firstUpdated() {
        const el = (this.rootEl = document.querySelector(this.root))
        this.scrollEl = document.querySelector(this.content)
        this.activeEl = null
        this.titles = []
        this.onOrOff = 'on'
        this.generateTitles(el)

        if (this.onOrOff === 'on') {
            this.initEvent()
        }
    }

    initEvent() {
        let timeId
        this.scrollEl.addEventListener('scroll', () => {
            clearTimeout(timeId)
            timeId = setTimeout(() => {
                this.highlight(this.findTheTitleInTheView())
            }, 100)
        })
    }

    /**
     * 根据 index 来查找条目
     */
    findTitleByIndex(index) {
        return this.$.toc.querySelectorAll('a')[index]
    }

    /**
     * 生成标题
     * Polymer 有双向绑定，会自动更新模板
     */
    generateTitles(el) {
        const h2s = el.querySelectorAll('h2')
        let h2
        let title
        let i = 0
        const len = h2s.length
        const titles = this.titles

        if (!len) return (this.onOrOff = 'off')

        for (; i < len; i++) {
            h2 = h2s[i]
            title = {
                el: h2,
                name: h2.innerText || h2.textContent,
                index: i
            }
            titles.push(title)
        }
    }

    /**
     * 高亮条目
     */
    highlight(el) {
        const activeEl = this.activeEl

        if (activeEl) {
            activeEl.parentNode.classList.remove(ACTIVE_CLASS)
        }
        this.activeEl = el
        el.parentNode.classList.add(ACTIVE_CLASS)
    }

    /**
     * 查找在视口内的标题，继而找到对应的条目
     */
    findTheTitleInTheView() {
        let i = 0
        const titles = this.titles
        const scrollEl = this.scrollEl
        const comparePos = scrollEl.scrollTop + window.innerHeight
        let len = titles.length
        let item
        let el

        for (; i < len; i++) {
            item = titles[i]
            el = item.el
            if (el.offsetTop - comparePos > 0)
                return this.findTitleByIndex(titles[i === 0 ? 0 : i - 1].index)
        }

        return this.findTitleByIndex(titles[i - 1].index)
    }

    /**
     * 点击条目，自动跳到对应的标题处
     */
    jump(e, _, el) {
        const index = el.getAttribute('index')
        const title = this.titles[index]

        if (title) {
            this.highlight(el)
            title.el.scrollIntoView()
        }
        e.preventDefault()
    }
}
