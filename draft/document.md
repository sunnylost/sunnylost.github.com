# document 对象属性和方法

方才我在 Chrome 下的控制台中敲代码，输入完 document. 之后，控制台给出了自动提示，我突然就想知道，在这些提示的属性或方法中，哪些是我不知道的，这其中会不会有一些被我忽略的重要内容呢？因为就在看 sea.js 的源码时，我发现自己根本不记得 document 拥有一个 URL 属性。

所以我将 chrome 下 document 的所有属性放入数组中，排好序，逐一查看。

(有很多属性和方法处于不推荐使用状态，因此不做介绍)

[W3C DOM API](http://www.w3.org/TR/DOM-Level-3-Core/core.html)

[MDN document](https://developer.mozilla.org/en-US/docs/Web/API/document)


## 常量 Constants

### 节点 Node

节点是 DOM 中最常见的对象。整个 DOM 编程基本上就是在和形形色色的节点打交道。

节点共有 12 种，每种类型可以用一个常量值来表示，这些常量不仅在 document 对象上存在，在任何的节点上也都存在。

1. ATTRIBUTE_NODE
2. CDATA_SECTION_NODE
3. COMMENT_NODE
4. DOCUMENT_FRAGMENT_NODE
5. DOCUMENT_NODE
6. DOCUMENT_TYPE_NODE
7. ELEMENT_NODE
8. ENTITY_NODE
9. ENTITY_REFERENCE_NODE
10. NOTATION_NODE
11. PROCESSING_INSTRUCTION_NODE
12. TEXT_NODE

其中一些很常见，例如 ELEMENT_NODE，DOCUMENT_NODE，TEXT_NODE，还有一些不常见的，如 ENTITY_NODE，NOTATION_NODE 等。

### 位置比较 Position Compare

compareDocumentPosition() 是节点上的方法，用于和另外一个节点进行位置比较。

DOM 树中两个节点的位置基本上就是前后关系，这里所谓的前后是指节点出现的位置的早晚。如果节点 A 是节点 B 的父节点，那么节点 A 相对于节点 B 的位置来说就是靠前的。

compareDocumentPosition() 方法会返回特定的数字来标示两个节点之间的位置关系。

1. DOCUMENT_POSITION_DISCONNECTED	            1
2. DOCUMENT_POSITION_PRECEDING					2
3. DOCUMENT_POSITION_FOLLOWING					4
4. DOCUMENT_POSITION_CONTAINS					8
5. DOCUMENT_POSITION_CONTAINED_BY				16
6. DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC	32

逐个解释下，假设我们有节点 A 和 B，以上值是通过调用  A.compareDocumentPosition(B) 得来：

DOCUMENT_POSITION_DISCONNECTED： A 和 B 在不同的文档中，无法比较位置

DOCUMENT_POSITION_PRECEDING：B 在 A 前

DOCUMENT_POSITION_FOLLOWING：A 在 B 前
DOCUMENT_POSITION_CONTAINS：B 包含 A
DOCUMENT_POSITION_CONTAINED_BY：A 包含 B
DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC：用于浏览器自己使用

其实还有一个值是 0，表示两个节点完全相同。

关于返回值还有一些细节，它们都是位掩码(bitmask)，John Resig [这篇博客](http://ejohn.org/blog/comparing-document-position/)讲解的很好。

### URL

返回当前页面 URL。


## 属性 Property

忽略属性：alinkColor，all，anchors，applets，bgColor，fgColor，linkColor，vlinkColor，xmlEncoding。

activeElement：返回当前获得焦点的元素。只读。

async：完全没见过……看介绍应该和载入 XML 文档有关。与之相关的规范：[LS](http://www.w3.org/TR/DOM-Level-3-LS/load-save.html#LS-DocumentLS)

body：返回 body 元素。该属性可以设置。

characterSet：返回当前页面的编码格式。该值用于页面渲染，有可能会和页面设置的不一致。

childElementCount：返回子元素的个数。该属性是在 ElementTraversal 接口中定义的，Element 也实现了该接口。IE 6，7，8 支持该方法，但是却把注释节点也算了进去。

childNodes：子节点集合。

children：子节点集合。两者的共同点是，都返回一个子节点快照的集合，就是说它们是动态的。不同点是，children 只包含元素节点。

compatMode：判断当前文档渲染的模式。"BackCompat"表示处于怪癖模式，"CSS1Compat"表示处于标准模式。

cookie：不用说啦。

currentScript：返回当前正在执行的 script 元素。该属性对于回调、事件处理函数无效。

defaultView：可以理解为 window 对象。

designMode：设置为 'on'，便可对整个文档内容进行修改，设置为 'off'，关闭修改。

dir：文档方向。'ltr'，从左向右。firefox 正确返回，chrome 下是个空字符串。

doctype：返回文档的文档声明。只读。

documentElement：返回文档的根元素，就是 <html>。只读。

documentURI：返回和 document.URL 同样的内容。

domain：返回当前文档的域。

embeds：返回页面中嵌入的对象的集合。

firstChild：第一个子元素，对于 document 来说是文档类型节点(如果有的话)。

firstElementChild：第一个子元素，必须是元素节点，因此 document 的 firstElementChild 为 <html>。IE 6，7，8 也支持，只不过没有过滤注释节点。

forms：文档中的表单集合。

head：<head> 元素。IE 9 开始支持。

images：文档中图片的集合。

implementation：返回 DOMImplementation 对象。

inputEncoding：解析文档使用的编码。DOM 4 中已删除该属性。

lastChild，lastElementChild：没啥好说的。

lastModified：返回当前文档最后一次修改的日期和时间。

links：area 和 anchor 元素的集合。

localName：返回节点的限定名。document 为空字符串。

location：返回 Location 对象。

namespaceURI：返回节点的命名空间。

nextSibling：下一个子节点。

nodeName、nodeType、nodeValue：因为 document 对象实现了 Node 接口，所以也有这些方法。

ownerDocument：返回 document，如果是 document 自己调用，返回 null。

parentNode：父节点，document 没有父节点。

parentElement：父节点，必须为元素节点。

plugins：插件集合。navigator.plugins 可以查看安装的插件。

preferredStyleSheetSet：返回首选的样式表。如果没有设置，应该返回空字符串，但是 chrome 返回了 undefined。Firefox 实现正确。

prefix：名空间前缀。

previousSibling：前一个兄弟节点。

readyState：返回文档状态。"loading" 表示文档加载中；"interactive" 表示文档加载完毕，但仍在加载子资源；"complete" 表示文档加载完毕。

referrer：从哪个 URI 跳转到当前页面。

scripts：<script> 元素集合。

selectedStyleSheetSet：返回当前使用的样式表名称。

styleSheets：返回 StyleSheet 对象集合。

textContent：节点和其子节点的文本。document 返回 null。

title：文档标题。

## 方法 Method
