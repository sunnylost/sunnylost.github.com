#可视化格式模型

规范：[visuren](http://www.w3.org/TR/CSS21/visuren.html)

##介绍
在该模型中，文档树中的每个元素都会生成 0 或多个盒子。这些盒子的布局由下列因素影响：

1. 盒尺寸和类型
2. 定位策略
3. 和文档树中其他元素的关系
4. 额外信息

###viewport
浏览器提供给用户的一个可以操作文档的区域。

如果视口小于文档渲染的画布，浏览器会生成滚动条。

每个画布最多有一个视口。但画布可能会有多个。

###Containing blocks 包含块
元素的位置会相对于包含块来计算。生成盒对于后代元素来说就像包含块一样。因此可以说一个盒子为它的后代元素"创建"了包含块。

"一个盒子的包含块"指的是该盒子所在的包含块，而不是它生成的包含块。

CB 的判断：

1. root element 的 CB  是 *initial containing block*。
2. `position` 是 `static` 或 `relative` 的元素，CB 是离它最近的祖先 block container 的内容区。
3. `position` 为 `fixed` 的元素，CB 由视口创建。
4. `position` 为 `absolute` 的元素，CB 是里它最近的祖先定位元素的 padding 区(如果祖先是行内元素，则略有区别)。

##Controlling box generation 生成控制盒
###Block-level elements and block boxes 块元素和块级盒
display 值为 "block"，"list-item"，"table"。

块级盒参与 BFC。每个块元素生成一个**主块级盒(principal block-level box)**，用于包含后代盒子和生成的内容，同时它也参与定位方案。

有些块元素会生成额外的块级盒，例如 'list-item' 元素。这些额外的块级盒会相对于主块级盒来放置。

除了 table 盒与替换元素外，一个块级盒同时还是一个块容器盒(block container box)。块容器盒要么只包含块级盒，要么创建一个行内格式化上下文(inline formatting context)从而只包含行级盒。并不是所有的块容器盒都是块级盒：非替换行内块和非替换表格单元都是块容器，但它们不是块级盒。

既是块级盒又是块容器的元素称之为**块盒(block box)**。

块级盒、块容器盒、块盒有时都称之为盒。

*注：看着这些英文单词的时候，自己产生了一些想法，仅供自己解释。containing 是包含的意思，当提到 containing block 时，我们关注的是它和它的后代之间的关系。同理，container 也可以同样理解，而 level 则是级别的意思，可以认为是在和同辈元素进行比较。如此说来，block-level box 注重的是和兄弟 box 之间的关系，而 block container box 则说的是 box 对于它后代 box 之间的关系。因此，inline-box 对同级 box 表现为 inline 元素，因此它不是 block-level box，但它对后代表现为 block-level box，因此它是 block container box。*

####Anonymous block boxes 匿名块盒
	<DIV>
	  Some text
	  <P>More text
	</DIV>

为了方便定义格式化，会认为在"Some text" 周围有一个匿名块盒。

换句话说：如果一个块容器盒包含一个块级盒，那么该容器盒便只能包含块级盒。

当一个行内盒包含一个处于普通流中的块级盒时，该行内盒会拆分为两个匿名块级盒放置于块级盒的两端。

涉及到百分比计算时不会考虑匿名盒，而是选择最近的非匿名祖先盒。

*注：block container box 要么生成 BFC，要么生成 IFC。只要包含一个 block-level box，那么就会生成 BFC，如果还有 inline-level box 存在，那么把它们放进一个 anonymous block box 中，很显然，这个匿名盒会生成 IFC。*

###Inline-level elements and inline boxes 行内元素和行内盒
行内元素 display 值为 "inline"，"inline-table"，"inline-block"。

行内元素生成行级块，它参与行内格式化上下文 IFC。

**行盒(inline box)**是指既为行级盒并且它的内容参与它所在的 IFC。不是行盒(例如可替换的行内元素，inline-block 元素，和 inline-table 元素)的行内盒称为**原子行级盒(atomic inline-level box)**，因为他们会作为一个完整的不透明盒参与 IFC。

####Anonymous inline boxes 匿名行内盒
如果文字直接包含在块容器元素内，那么该文字应当看做一个匿名行内元素。

匿名行内盒从父级块盒继承属性。

### 'display' 属性
- block：使元素生成块盒。
- inline-block：使元素生成一个行级块容器。内部类似于块盒来进行格式化，该元素表现为一个原子行级盒。
- inline：生成一个或多个行盒。
- list-item：使元素生成一个主级块盒和一个标记盒。
- none：使元素不出现于格式化结构中(元素不生成盒子，对布局无影响)。后代元素也不会生成任何盒子。
- table，inline-table……：使元素表现的像表格元素。

计算值和指定值相同，除了定位或浮动的元素(设置它们会影响 display 值)。

##定位方案
在 CSS 2.1 中，有三种定位方案：

1. 常规流：包含块级盒的块级格式化，行级盒的行级格式化，块级盒行级盒的相对定位。
2. 浮动：盒子先通过常规流布局，然后从常规流中取出并尽可能的远的向左或向右。
3. 绝对定位：盒子从常规流中完全移除，并相对一个包含块定位。

###'position' 属性
1.  static：在常规流中布局，top、right、bottom、left 不生效。
2.  relative：在常规流中布局，然后相对原始位置进行位移。
3.  absolute：根据元素所在的包含块定位。元素脱离常规流，即对后面的兄弟节点的布局不产生影响。绝对定位元素的 margin 不折叠。
4.  fixed：使用 absolute 模型计算布局，只不过元素相对于 viewport 定位。

##Normal flow 常规流
常规流中的盒子属于某个格式化上下文，块级盒属于一个块格式化上下文，行级盒属于一个行格式化上下文。
###Block formatting contexts 块格式化上下文
浮动，绝对定位元素，不是块盒的块容器(例如 inline-block，table-cells)，'overflow'值不为'visible'的块盒会为它们的内容创建新的 BFC。

*注：一直对 BFC 有疑问，但是参考了 winter 的几篇文章，我有了更进一步的了解。例如，当 overflow 为 visible 时，box 不会为自己的内容创建 BFC，它的内容是参与到 box 所在的 BFC 中。假如存在两个相邻 DIV，名为 A 和 B，默认情况下，二者会发生 margin collapse。如果 A 中包含了一个 DIV AA，而 AA 拥有 margin-bottom，并且 A 没有 padding 和 border，那么 AA 与 B 也会发生 margin collapse，原因就是 overflow 的默认值是 visible，A 没有为 AA 创建 BFC，所以 AA 就参与了外层的 BFC，即此时，AA 与 B 在同一个 BFC 内。但如果设置 A 的 visible 为其他值，那么 AA 和 B 就不会发生 margin collapse。发生 margin collapse 的前提是处于相同的 BFC 内。*

在 BFC 内，盒子们从上向下垂直排列。两个相邻盒子之间的距离由 margin 决定。

在 BFC 内，每个盒子的左外边缘紧贴包含块的左边缘。

###Inline formatting contexts 行格式化上下文
在 IFC 内，盒子们水平排列。

包含盒子并形成一行的矩形区域称为**行盒(line box)**。

行盒的宽度由包含块和是否存在浮动来决定。

行盒总是足够高以便容纳所有内部的盒子。然而，它有可能比内部最高的盒子还要高。

如果单独的一个行盒无法容纳所有行级盒，那么这些盒子会被放置于两个或多个垂直叠加的行盒中。因此，一个段落是众多行盒的垂直堆叠，行盒之间没有间隙，并且它们永不重叠。

通常，行盒的两边会接触包含块，但浮动盒可能会出现在两者之间。

同一个 IFC 内的行盒高度可能不同(一个包含图片，一个只包含文字，两者的高度就可能不同)。

###相对定位
适用于正常流与浮动的盒子。

如果 `left` 与 `right` 值均为 `auto`，那么使用 0，即元素保持不动。

如果其中一个为 `auto`，那么它的使用值为减去另一个值。

如果两个都有值，那么按照 `direction` 来忽略一个值，如果是 `ltr`，那么忽略 `right`，反之亦然。

##浮动
脱离正常流，向左或向右移动，直到它的外边缘碰到包含块的边或另一个浮动盒。

适用于没有**绝对定位**的元素。

如果有行盒存在，那么浮动盒的顶部与行盒顶部对齐。

发生浮动后，盒子原来在的行盒和后面的行盒会缩小尺寸来为浮动盒的 margin box 腾出空间。

**注意：**table 的 border box，block-level 替换元素，或一个在正常流中创建了 BFC 的元素，不能与在同一个 BFC 中的浮动元素重叠。

##绝对定位
包括 `fixed` 定位。完全从正常流中移除，为它的正常流子元素和绝对定位元素创建一个包含块。

## `display`、`position` 和 `float` 之间的关系
- 若 `display` 为 `none`，不生成盒子，其余两个值无效
- 否则，若 `position` 为 `absolute` 或 `fixed`，`float` 的计算值为 `none`，`display` 值参见下方
- 否则，若 `float` 值不为 `none`，则 `display` 的值参见下方
- 否则，如果元素是根元素，`display` 的值参见下方
- 否则，`display` 使用指定值

<table border="1" cellspacing="0" cellpadding="5">
<tbody><tr>
<th> 指定值
</th>
<th> 计算值
</th></tr>
<tr>
<td> inline-table
</td>
<td> table
</td></tr>
<tr>
<td> inline, table-row-group, table-column, table-column-group, table-header-group, table-footer-group, table-row, table-cell, table-caption, inline-block
</td>
<td> block
</td></tr>
<tr>
<td> 其他
</td>
<td> 与指定值相同
</td></tr></tbody></table>

## `z-index`
若定位元素的 `z-index` 的计算值不为 `auto`，那么会生成新的堆叠上下文(stacking context)。

在每个堆叠上下文中，以下层次从后向前绘制的顺序为：

1. 背景和元素的边框
2. z-index 为负值的子元素
3. 在正常流内，非行内级别，非定位的后代元素
4. 非定位的浮动元素
5. 在正常流内，行内级别，非定位的后代元素，包括 inline table 和 inline block
6. z-index 为 0 的元素
7. z-index 为正值的元素 

##`width`
该属性不适用于非替换行内元素。

该属性指定的是元素内容区的宽度。

如果值为百分比，那么是相对于元素包含块的宽度(注意不同 `position` 值对计算的影响)。

##`line-height`
计算：

1. 对于替换元素，inline-block 元素，inline-table 元素，`line-height` 为它们的 margin box；对于 inline box，是 `line-height`。
2. 行盒的高度是：最高盒子的顶部到最低盒子底部的距离。

空的行内元素生成空的行盒，但该盒仍然有 margin，padding，border 和行高。

(这个地方生词挺多，先随便写点，准确度未知)假设每个字体都有字体规格，按照 baseline 将字体分为上下两部分，用 A 代表上面高度，D 代表下部分的深度，此外 AD = A + D。

行间距为 L，L = `line-height` - AD。将行间距的一半加到 A 上，另一半加到 D 上。即 A' = A + L/2， D' = D + L/2。