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

baseURI：返回页面的基本 URI，这个会受到 &lt;base&gt; 标签影响。

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

documentElement：返回文档的根元素，就是 &lt;html&gt;。只读。

documentURI：返回和 document.URL 同样的内容。

domain：返回当前文档的域。

embeds：返回页面中嵌入的对象的集合。

firstChild：第一个子元素，对于 document 来说是文档类型节点(如果有的话)。

firstElementChild：第一个子元素，必须是元素节点，因此 document 的 firstElementChild 为 &lt;html&gt;。IE 6，7，8 也支持，只不过没有过滤注释节点。

forms：文档中的表单集合。

head：&lt;head&gt; 元素。IE 9 开始支持。

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

scripts： &lt;script&gt; 元素集合。

selectedStyleSheetSet：返回当前使用的样式表名称。

styleSheets：返回 StyleSheet 对象集合。

textContent：节点和其子节点的文本。document 返回 null。

title：文档标题。

## 方法 Method
addEventListener：监听事件

adoptNode：用于处理来自其他文档中的节点，经过该方法操作后，节点便可以插入到当前文档中。节点的 ownerDocument 属性被修改。

appendChild：附加子节点。如果操作一个已经存在于文档中的节点，那么该节点会移动到新位置。

cloneNode：复制节点。当然对 document 无效。参数为 true，表示深拷贝。默认值是 true。去 [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Node.cloneNode) 查看细节问题。

close：完成写入。

compareDocumentPosition：比较节点位置。

以下为 create 系列：

1. createAttribute
2. createAttributeNS
3. createCDATASection
4. createComment
5. createDocumentFragment
6. createElement
7. createElementNS
8. createEvent
9. createExpression
10. createNSResolver
11. createNodeIterator
12. createProcessingInstruction
13. createRange
14. createTextNode
15. createTreeWalker

elementFromPoint：参数为 x，y 坐标，返回页面中处于该坐标的最顶端的元素。

evaluate：解析 [XPath](https://developer.mozilla.org/en-US/docs/XPath) 表达式返回 XPathResult 对象。

execCommand：富文本操作。支持许多[命令](https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla#Executing_Commands)。

获取节点系列：

1. getElementById
2. getElementsByClassName
3. getElementsByName
4. getElementsByTagName
5. getElementsByTagNameNS

getSelection：同 [window.getSelection()](https://developer.mozilla.org/en-US/docs/Web/API/window.getSelection)

hasAttribute：sea.js 源码中有提到它在 IE 下的兼容性。

hasChildNodes：判断节点下是否包含子节点。

hasFocus：判断文档或文档内部的节点是否获得焦点。Chrome 下有[问题](https://code.google.com/p/chromium/issues/detail?id=64846)。

importNode：和 adoptNode 方法类似，但该方法是复制一个其他文档中的节点。

insertBefore：参数：新节点，老节点。将新节点插入到老节点的前面。

isDefaultNamespace：判断传入的名空间是否是当前节点默认的名空间。

isEqualNode：判断两个节点是否[相同](http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-isEqualNode)。

lookupNamespaceURI：返回节点的名空间 URI。

lookupPrefix：和上面一样没用过。

normalize：标准化节点和它的子树。这意味着没有一个空的文本节点，或是两个毗邻的文本节点。

open：打开文档准备写入。

query 系列：

1. queryCommandEnabled
2. queryCommandIndeterm
3. queryCommandState
4. queryCommandSupported
5. queryCommandValue
6. querySelector
7. querySelectorAll

除了后两个常见，其余都没用过……

其中 IE 8 开始支持后面两个选择节点的方法，但是它只支持 CSS2 的选择器。

releaseEvents：废弃。

removeChild：移除节点。

removeEventListener：移除事件绑定。

replaceChild：替换节点。参数：新节点，准备替换的老节点。返回被替换的节点。

write 和 writeln：文档 open 时写入内容。
