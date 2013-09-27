#offsetParent

[offsetParent](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement.offsetParent)：返回离当前元素最近的、设置过定位的祖先元素。。

根据 [quirksmode](http://www.quirksmode.org/dom/w3c_cssom.html#offsetParent) 中的介绍，查找元素 x 的 offsetParent 流程是这样的：沿着 DOM 树向上查找，遇到如下情况则停止并返回当前元素：


- &lt;body&gt; 
- position 值不为 static 的元素
- &lt;table&gt;，&lt;th&gt; 或是 &lt;td&gt;，前提是 x 的 position 为 static。

body 的 offsetParent 为 null。

position 为 fixed 的元素的 offsetParent：在 IE (测试到 IE 9) 和 Chrome 中为 null，firefox 返回 body 元素。

display 为 none 的元素的 offsetParent：IE 返回 body 元素，firefox 和 Chrome 均返回 null。


[规范](http://www.w3.org/TR/cssom-view/#offset-attributes) 中关于 offsetParent 的介绍：

返回 null 的情况：

1. 元素没有与之关联的 CSS 布局盒。(例如 display 为 none)
2. 元素为根元素
3. 元素为 body
4. 元素的 position 为 fixed 

所以，从规范角度来看，目前浏览器均没有很好的遵循。

jQuery 1.10.2 中对于这些情况统一返回 html 元素。

[http://jsfiddle.net/5Cdp8/](http://jsfiddle.net/5Cdp8/)，我对 jQuery 和原生 js 做了对比，在不同浏览器下的差别很大。
