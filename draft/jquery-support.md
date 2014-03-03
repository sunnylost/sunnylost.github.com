@title:jQuery 源码阅读 support.js
@filename:jquery.support
@list: jQuery
create-date: 2013-10-17

jQuery.support 对象中包含了一系列和浏览器特性或 bug 有关的判断。主要是 jQuery 内部使用，如果你需要类似的功能，官方文档推荐使用 [Modernizr](http://modernizr.com/)。

由于浏览器种类众多，实现不同，对规范的理解也不一致，这就导致了众多 bug 的出现，很长一段时间里，人们通过检测浏览器类别和版本(比如说 IE) 来处理一些常见问题，这称为浏览器嗅探(browser sniff)。再后来，人们又开始使用特征检测(feature detection)，即检测你要使用的特性是否存在于目标浏览器中。

特征检测始终是你在处理跨浏览器编码时的首选方式，但这不意味着浏览器嗅探就变得毫无意义了，查看 Zakas 的这篇[博客](http://www.nczonline.net/blog/2006/11/16/browser-detection-versus-feature-detection/)来了解更多内容。

support.js 中的代码在阅读上没有难度，所以接下来我主要是做个记录，看看每个属性都代表什么含义。

(我的机器上只有 IE 9，以下内容都是用 IE 9 模拟来测试。不过基本上某个版本有 bug，它的低版本也应该会有该 bug。)

##getSetAttribute
这里检测了 get/setAttribute 的兼容问题，w3help 有篇文章介绍的很清楚：[SD9006: IE 混淆了 DOM 对象属性（property）及 HTML 标签属性（attribute），造成了对 setAttribute、getAttribute 的不正确实现](http://w3help.org/zh-cn/causes/SD9006)。

##leadingWhitespace
IE 下使用 innerHTML 会忽略前面的空白。

自测 IE 8 以下有此问题。

##tbody
IE 7 会自动向空 table 内插入 tbody 标签。

##htmlSerialize
使用 innerHTML 不能生成 link 元素。(IE 8 以下)

##style
IE 8 以下无法使用 getAttribute('style') 获取样式信息，只能用 cssText。

##hrefNormalized
IE 7 以下会自动补全 a 的 href(如果 href 没有协议名)。

##opacity
这个比较常见，IE 8 以下使用 filter 而不是 opacity 来设置透明度。

##cssFloat
IE 8 以下使用 styleFloat 来替代 cssFloat。

##checkOn
检测 checkbox/radio 的默认值，正确值为 "on"，注释显示 Webkit 会显示 ""。但目前 chrome 已经显示正确。

##optSelected
IE 中，默认选中的 option 的 selected 属性值为 false。(webkit 某些版本也是，目前为 true)

##enctype
检测表单元素是否支持 enctype。

##html5Clone
检测复制 HTML5 元素后 outerHTML 不会出错。

##boxModel
已经废弃了。

##noCloneChecked
使用 clone(true) 后，是否能够保留 checked 状态。IE 9 依然不能。

##optDisabled
当 select 被 disabled 之后，其中的 option 不应该被 disabled。

##deleteExpando
expando 不知道该如何翻译，但是它的行为你肯定知道：

	var o = {};
	o.test = 1;

对象 o 本来没有 test 属性，但我们直接为 o 的 test 属性赋值，这时候 test 属性就创建了。这个行为就称为 expando。

IE 8 以下，如果删除 DOM 对象上不存在的属性会引发异常(普通 JavaScript 对象没有问题)。

##input
getAttribute("value") 是否有效。

##radioValue
将 input 的类型转为 radio 后，它的 value 能否保留。

经过测试，firefox 和 chrome 都可以保留 value，而 IE 9 会输出 "on"。

##appendChecked
脱离 DOM 树的 checkbox 能否保留原始状态。IE 6/7 下无法保留。

##checkClone
fragment 复制之后，它包含的 checkbox 能否保持正确状态。注释说 Webkit 不会，但是目前的 chrome 已经可以了。反倒是 IE 7 不可以。

##noCloneEvent
IE 8 及以下使用 clone(true) 会将事件拷贝。

##Bubbles
包括三个属性：submitBubbles，changeBubbles，focusinBubbles。

对于 submit 和 change 事件，firefox、chrome、IE 9 都会冒泡，IE 8 不会。

对于 focusin 事件，firefox 目前不支持。chrome 不冒泡，IE 冒泡。

##clearCloneStyle
对复制后的节点清除样式是否会影响到原始节点。测试时候没发现有浏览器出现该行为。

##reliableHiddenOffsets
该属性只针对 IE 8，隐藏的表格单元的 offsetWidth/height 不为 0。

##boxSizing
盒模型相关。box-sizing 可以使用 content-box(默认)和 border-box 来选择不同的盒模型。IE 6，7 不支持该属性。

使用 border-box 后，设置元素的 width 会包括 padding 和 border。

##doesNotIncludeMarginInBodyOffset
IE 7 下，计算 body 的 offset 会包括 margin 值。

##pixelPosition
样式设置使用了百分比，获得计算值的时候能否转成像素值。

##boxSizingReliable
box-size 是否可靠？不太理解……搜了下源代码，css.js 中用了，到时候再看吧。

##reliableMarginRight
WebKit Bug 13343 - getComputedStyle 返回了错误的 margin-right。

##inlineBlockNeedsLayout
针对 IE < 8，判断当原生的块级元素设置 display 为 'inline' 并给与 layout 时是否表现的像 inline-block。

##shrinkWrapBlocks
不太清楚。
