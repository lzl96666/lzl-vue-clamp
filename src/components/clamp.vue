<script>
import { addListener, removeListener } from 'resize-detector'

const UPDATE_TRIGGERS = ['maxLines', 'maxHeight', 'ellipsis']
const INIT_TRIGGERS = ['tag', 'text', 'autoresize']

export default {
    name: 'vue-clamper',
    props: {
        /**
         * 标签
         */
        tag: {
            type: String,
            default: 'div'
        },
        /**
         * 是否根据宽度自动变化
         */
        autoresize: {
            type: Boolean,
            default: false
        },
        /**
         * 最多行数
         */
        maxLines: Number,
        /**
         * 最多高度
         */
        maxHeight: [String, Number],
        /**
         * 省略号
         */
        ellipsis: {
            type: String,
            default: '…'
        },
        /**
         * 是否展开
         */
        expanded: Boolean
    },
    data() {
        return {
            offset: null,
            text: this.getText(),
            localExpanded: !!this.expanded
        }
    },
    computed: {
        clampedText() {
            return this.text.slice(0, this.offset) + this.ellipsis
        },
        isClamped() {
            if (!this.text) {
                return false
            }
            return this.offset !== this.text.length
        },
        realText() {
            return this.isClamped ? this.clampedText : this.text
        },
        realMaxHeight() {
            if (this.localExpanded) {
                return null
            }
            let { maxHeight } = this
            if (!maxHeight) {
                return null
            }
            return typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight
        },
        isShowButton() {
            if (this.isClamped || this.localExpanded) {
                return true
            } else {
                return false
            }
        }
    },
    watch: {
        expanded(val) {
            this.localExpanded = val
        },
        localExpanded(val) {
            if (val) {
                this.clampAt(this.text.length)
            } else {
                this.update()
            }
            if (this.expanded !== val) {
                this.$emit('update:expanded', val)
            }
        },
        isClamped: {
            handler(val) {
                this.$nextTick(() => this.$emit('clampchange', val))
            },
            immediate: true
        }
    },
    mounted() {
        this.init()

        INIT_TRIGGERS.forEach((prop) => {
            this.$watch(prop, this.init)
        })

        UPDATE_TRIGGERS.forEach((prop) => {
            this.$watch(prop, this.update)
        })
    },
    updated() {
        this.text = this.getText()
        this.applyChange()
    },
    beforeDestroy() {
        this.cleanUp()
    },
    methods: {
        init() {
            let contents = this.$slots.default
            if (!contents) {
                return
            }
            if (Array.isArray(contents) && contents.length > 1) {
                // eslint-disable-next-line no-console
                console.log('VueClamper only supports clamping plain text content.', this)
                return
            }
            let [content] = contents
            if (content && content.tag) {
                // eslint-disable-next-line no-console
                console.log('VueClamper only supports clamping plain text content.', this)
                return
            }

            this.offset = this.text.length

            this.cleanUp()

            if (this.autoresize) {
                let resizeCallback = () => {
                    this.update()
                }
                addListener(this.$el, resizeCallback)
                this.unregisterResizeCallback = () => {
                    removeListener(this.$el, resizeCallback)
                }
            }
            this.update()
        },
        update() {
            if (this.localExpanded) {
                return
            }
            this.applyChange()
            if (this.isOverflow() || this.isClamped) {
                this.search()
            }
        },
        expand() {
            this.localExpanded = true
        },
        collapse() {
            this.localExpanded = false
        },
        toggle() {
            this.localExpanded = !this.localExpanded
        },
        getLines() {
            return (
                this.$refs.text &&
                Object.keys(
                    [...this.$refs.content.getClientRects()].reduce((prev, { top, bottom }) => {
                        const key = `${top}/${bottom}`
                        if (!prev[key]) {
                            prev[key] = true
                        }
                        return prev
                    }, {})
                ).length
            )
        },
        isOverflow() {
            if (!this.maxLines && !this.maxHeight) {
                return false
            }

            if (this.maxLines) {
                if (this.getLines() > this.maxLines) {
                    return true
                }
            }

            if (this.maxHeight) {
                if (this.$el.scrollHeight > this.$el.offsetHeight) {
                    return true
                }
            }
            return false
        },
        getText() {
            let [content] = this.$slots.default || []
            return content ? content.text : ''
        },
        moveEdge(steps) {
            this.clampAt(this.offset + steps)
        },
        clampAt(offset) {
            this.offset = offset
            this.applyChange()
        },
        applyChange() {
            this.$refs.text.textContent = this.realText
        },
        stepToFit() {
            this.fill()
            this.clamp()
        },
        fill() {
            while (!this.isOverflow() && this.offset < this.text.length) {
                this.moveEdge(1)
            }
        },
        clamp() {
            while (this.isOverflow() && this.offset > 0) {
                this.moveEdge(-1)
            }
        },
        search(...range) {
            let [from = 0, to = this.offset] = range
            if (to - from <= 3) {
                this.stepToFit()
                return
            }
            let target = Math.floor((to + from) / 2)
            this.clampAt(target)
            if (this.isOverflow()) {
                this.search(from, target)
            } else {
                this.search(target, to)
            }
        },
        cleanUp() {
            if (this.unregisterResizeCallback) {
                this.unregisterResizeCallback()
            }
        }
    },
    render(h) {
        let contents = [
            h(
                'span',
                {
                    ref: 'text',
                    attrs: {
                        'aria-label': this.text.trim()
                    }
                },
                this.realText
            )
        ]

        let { expand, collapse, toggle, isShowButton, isClamped, localExpanded } = this
        let scope = { expand, collapse, toggle, isOverflow: isShowButton, isClamped, localExpanded }
        let before = this.$scopedSlots.before ? this.$scopedSlots.before(scope) : this.$slots.before
        if (before) {
            contents.unshift(...(Array.isArray(before) ? before : [before]))
        }
        let after = this.$scopedSlots.after ? this.$scopedSlots.after(scope) : this.$slots.after
        if (after) {
            contents.push(...(Array.isArray(after) ? after : [after]))
        }
        let lines = [
            h(
                'span',
                {
                    style: {
                        boxShadow: 'transparent 0 0'
                    },
                    ref: 'content'
                },
                contents
            )
        ]
        return h(
            this.tag,
            {
                style: {
                    maxHeight: this.realMaxHeight,
                    overflow: 'hidden'
                }
            },
            lines
        )
    }
}
</script>
