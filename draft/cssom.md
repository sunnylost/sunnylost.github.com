#CSS 视图模块

规范：[CSSOM View Module](http://www.w3.org/TR/cssom-view/)

##简介
该规范定义了检查与操作文档视图的方法，包括获得元素的位置、宽高，滚动元素。

##window 对象上的扩展接口

screen：返回 Screen 对象，下面再介绍。

innerWidth：视口宽度，包含滚动条。

innerHeight：视口高度，包含滚动条。

scrollX 和 pageXOffset：返回距离初始包含块原点(左上角)的横轴距离。

scrollY 和 pageYOffset：返回距离初始包含块原点的纵轴距离。

scroll(x, y)：滚动窗口到指定坐标。

scrollTo(x, y)：同 scroll()。

scrollBy(x, y)：将当前位置作为原点来滚动。

screenX：窗口相对于屏幕左上角的横轴坐标。

screenY：窗口相对于屏幕左上角的纵轴坐标。这两个属性会受到系统的默认 UI 影响，例如 windows 的任务栏。

outerWidth：窗口区域的宽度。

outerHeight：窗口区域的高度。这个高度包括浏览器的一些默认 UI，例如标签栏、地址栏等。

##Screen 对象
该对象表示为输出设备的屏幕。

availWidth：输出设备提供的渲染区域的可用宽度。

availHeight：输出设备提供的渲染区域的可用高度。这两个属性会受到系统的默认 UI 影响。

width：输出设备的宽度。

height：输出设备的高度。

colorDepth 和 pixelDepth：输出设备分配给颜色的比特值。

## Document 对象上的扩展接口
elementFromPoint(x, y)：指定坐标，返回当前处于该坐标上的元素。

[caretPositionFromPoint(x, y)](https://developer.mozilla.org/en-US/docs/Web/API/document.caretPositionFromPoint)：看起来是个很有用的方法。该方法根据坐标来获取光标位置。

    兼容性问题：
		firefox 20 支持该方法，返回 CaretPosition 对象。

		webkit 实现了旧的规范，方法名为 caretRangeFromPoint，返回一个 Range对象

		IE 浏览器的 TextRange.moveToPoint(x, y) 具有类似作用。
		
##Element 对象上的扩展接口
getClientRects()：返回包含边界矩形的集合。如果元素没有与之对应的 css 布局盒，那么返回空集合。否则返回包含一系列 ClientRect 对象的 ClientRectList 对象。

getBoundingClientRect()：返回一个范围，能够包含 getClientRects() 返回的所有矩形。

###scroll
scrollIntoView()：将元素滚动到视图中。

scrollTop：获取和设置元素内容中向上滚动的部分的高度。

scrollLeft：获取和设置元素内容中向左滚动的部分的宽度。

scrollWidth：只读。返回元素宽度和元素内容宽度中的较大值。即当存在滚动条，scrollWidth 要大于 clientWidth。

scrollHeight：只读。返回元素高度和元素内容高度中的较大值。

###client
clientTop：元素上边框宽度。只读。

clientLeft：元素左边框宽度。只读。

clientWidth：返回元素视口宽度。不包括滚动条。

clientHeight：返回元素视口高度。不包括滚动条。

##HTMLElement 对象上的扩展接口
offsetParent：单独做过笔记。

offsetTop：返回元素相对于 offsetParent 的纵轴距离。

offsetLeft：返回元素相对于 offsetParent 的横轴距离。

offsetWidth：元素的边框边界宽度(border + padding + contentWidth)。

offsetHeight：元素的边框边界高度。

##MouseEvent 对象上的扩展接口
screenX，screenY：相对于屏幕原点的距离。

pageX，pageY：相对于初始包含块原点的距离。

clientX，clientY：相对于元素 viewport 原点的距离。

x，y：同 client 系列。

offsetX，offsetY：相对于触发事件元素的 padding edge 的距离。
