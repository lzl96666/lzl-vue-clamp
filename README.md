# USE

npm install 'lzl-vue-clamp'

# API

## props

tag: string

生成的根元素的标签名。

默认值： div

autoresize: boolean

是否要自动适配根元素的尺寸变化。

默认值： false

max-lines: number

可以显示的最大行数

max-height: number|string

根元素的最大高度。数字值将被转换为 px 单位；字符串值将直接作为 CSS 属性 max-height 输出。

ellipsis: string

当文字被截断时需要显示的省略号字符串。

默认值： '…'

expanded: boolean

.sync

是否展开显式被截断的文本。

默认值： false

### slot

default

需要截断的文本。只能包含纯文本内容。

before

Slot 作用域： { expand, collapse, toggle, clamped, expanded }

expand: function(): void - 展开被截断的文本。

collapse: function(): void - 收起展开后的文本。

toggle: function(): void - 切换被截断文本的展开状态。

clamped: Boolean - 内容是否处于截断状态。

expanded: Boolean - 内容是否处于展开状态。

在被截断的文本前显式的内容，可以包含任意类型内容。

after

Slot 作用域：与 before 相同。

在被截断的文本后显式的内容，可以包含任意类型内容。

## event

clampchange

截断状态变化时触发。

回调参数： (clamped: Boolean)
