@filename: css.background
@title: CSS 规范——Background
@list: CSS

规范地址：[css3-background](http://www.w3.org/TR/css3-background/)

资源：

- [css3-backgrounds](http://www.slideshare.net/maxdesign/css3-backgrounds)
- [CSS3's 'space' and 'round' Values for background-repeat](http://www.impressivewebs.com/space-round-css3-background/)
- [Pure CSS scrolling shadows with background-attachment: local](http://lea.verou.me/2012/04/background-attachment-local/)

该规范用于替换和扩充 CSS 2.1 的 8.5 和 14.2 节。

#背景(background)
box 的背景由：content，padding，border 构成。

box 的 `background` 属性是不可以继承的，但是因为默认背景颜色是透明，因此还是可以看到父级 box 的背景。

##多重背景图片
`background-image` 支持多个用逗号分隔的值，每个值都会创建一个层，`none` 也会创建。

这些 image 值与其他背景属性配合来实现背景图片的大小，布局，平铺。如果其他背景属性值的个数超出了背景图片个数，那么多出的部分无效；如果数目不足，那就重复之前设置的**所有的值**来满足个数要求。

背景图片按照声明的顺序从上到下排列。最下面的一层是 `background-color`。

##平铺(tile)
背景图片使用 `background-repeat` 来实现平铺。可以设置一个或两个值来实现水平与垂直两个方向上的平铺行为。

可以取的值为：

- `repeat`：默认值。在某个方向上重复来铺满*背景渲染区域(background painting area)*。
- `space`：会铺满*背景定位区域(background position area)*，但是图片不会被**裁剪**。第一张和最后一张图片和区域的边界相接。如果背景渲染区域大于定位区域，那么图片会铺满渲染区域。因为会尽量铺满，所以图片之间会有间隙。
- `round`：和 `space` 类似，也是尽量铺满，不被裁剪，但它采取的方式是拉伸图片。
- `no-repeat`：图片不平铺。

除上面的值外，还有 `repeat-x` 和 `repeat-y`。

[demo 地址](http://sunnylost.com/demo/learn/background-repeat.html)，可以选择不同的 `background-repeat` 值并尝试改变页面尺寸来查看效果。

##依附(attachment)
`background-attachment` 拥有三个值：

- `fixed`：背景相对于视口固定。
- `local`：背景相对于元素内容区固定，内容区滚动，背景也随之而动。
- `scroll`：默认值。相对于元素自身固定，不跟着内容区滚动。

##定位(position)
`background-position` 的值可以是关键字：

- `center`
- `left`
- `right`
- `top`
- `bottom`

还可以是百分数和长度。

该值其实包含了 `background-position-x` 和 `background-position-y` 两个值。如果只提供一个值，那么第二个值为 `center`。

如果有四个值，即两对位置，那么它们必须以一个关键字开头，第二个值是相对于该关键字所在边的位移。比如说：`left 10px top 15px` 就是相对于 `left` 偏移 10 像素，`top` 同理。

如果只有三个值，那么最后一个为 0。

##裁剪(clip)
`background-clip` 用于确定*背景渲染区域*，即背景在哪个区域内渲染：

- `border-box`：默认值。在元素 border 区内渲染。
- `padding-box`：……
- `content-box`：……

需要注意的是：

1. 根元素拥有不同的背景渲染区域，因此对它设置 `background-clip` 不会生效。
2. 背景总是绘制在边框下面。

##定位区域
`background-origin` 用于确定*背景定位区域*，这是对于作为一个 box 来渲染的元素来说，对于作为多个 box 来渲染的元素，和另一个 [css3-break](http://www.w3.org/TR/css3-break/) 规范有关，现在还没看到那里。

它和 `background-clip` 一样拥有相同的三个值，不赘述了。

##尺寸
`background-size` 决定了背景图片的尺寸：

- `contain`：等比缩放背景图片到最大，确保它的尺寸小于等于*背景定位区域*。
- `cover`：等比缩放背景图片到最小，确保它的尺寸大于等于……
- `auto`：根据图片默认比例计算，如果失败则使用原始尺寸，否则的话为 100%。

除了这三个特殊值外，还可以指定长度或百分比。如果有两个值，那么第一个值表示宽度，第二个值表示高度。
