[DOM 2 Range](http://www.w3.org/TR/DOM-Level-2-Traversal-Range/ranges.html)

# Range #

Range 表现为文档、文档碎片、特性节点中的一段内容，它的最大特点就是能够根据两个边界点来选择该范围内的连续内容。

boundary-points：Range 的起点和终点，在文档中可以表现为一个节点和一个位移。这个节点叫做边界点和位置的 container。

边界点必须拥有一个共同的祖先容器(ancestor container)。

![](http://www.w3.org/TR/DOM-Level-2-Traversal-Range/images/RangeExample.gif)

如果两个边界点的容器和偏移相同，则该 Range 为一个 collapsed Range

## 创建 Range ##
	document.createRange()

## 修改 Range 的位置 ##
	setStart(Node parent, int long offset);
	setEnd(Node parent, int long offset);

如果 Range 的一个边界点被设置为另一个 root container 而不是当前这个，那么 Range 就会折叠放置到新的位置。

Range 的起点始终在终点之前，如果强制设置起点在终点后面，那么 Range 会折叠到新的位置。

	setStartBefore(Node node);
	setStartAfter(Node node);
	setEndBefore(Node node);
	setEndAfter(Node node);

使用相对位置来设置边界点。

	collapse(boolean toStart);

传入 true，Range 会折叠到起点，否则到终点。

	collapsed; //判断是否折叠

	selectNode(Node n);
	selectNodeContents(Node n);

selectNode() 是让 Range 包含指定的节点。

selectNodeContents() 是包含指定节点的内容。

## 比较 Range 边界点 ##
	compareBoundaryPoints(CompareHow how, Range sourceRange)

how 为四个值之一：START_TO_START,START_TO_END,END_TO_END,END_TO_START。返回值 -1,0,1 表示在前、相等、后。

## 删除 Range 中的内容

	deleteContents();

	(1) <FOO>AB<MOO>CD</MOO>CD</FOO>  -->
	<FOO>A^CD</FOO>
	(2) <FOO>A<MOO>BC</MOO>DE</FOO>  -->
	<FOO>A<MOO>B</MOO>^E</FOO>
	(3) <FOO>XY<BAR>ZW</BAR>Q</FOO>  -->
	<FOO>X^<BAR>W</BAR>Q</FOO>
	(4) <FOO><BAR1>AB</BAR1><BAR2/><BAR3>CD</BAR3></FOO>
	-->  <FOO><BAR1>A</BAR1>^<BAR3>D</BAR3>

删除内容后，如果留下两个毗邻的文本节点，通常它们不会合并，可以使用 Node 接口的 normalize()方法。

## 提取内容 ##
	extractContents()

删除内容，将其内容放入一个文档碎片中返回。

	(1) <FOO>AB<MOO>CD</MOO>CD</FOO>  -->
	B<MOO>CD</MOO>
	(2) <FOO>A<MOO>BC</MOO>DE</FOO>  -->
	<MOO>C<MOO>D
	(3) <FOO>XY<BAR>ZW</BAR>Q</FOO>  -->
	Y<BAR>Z</BAR>
	(4)
	<FOO><BAR1>AB</BAR1><BAR2/><BAR3>CD</BAR3></FOO> -->
	<BAR1>B</BAR1><BAR2/><BAR3>C</BAR3>

对于部分选择(partially selected)的节点，它们会被复制，然后移动到文档碎片中。

## 复制内容 ##
	cloneContents()

和 extractContents() 类似，但不会删除选中的内容。

## 插入内容 ##
	insertNode(Node n);

将一个节点插入 Range 中。

如果将节点插入一个文本节点，那么文本节点会被拆分，如果要插入的节点也是一个文本节点，那么这些文本节点不会自动合并。
