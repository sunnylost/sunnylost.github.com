# HTML 的 Content model

刚开始接触 HTML 的时候，就听过「块级元素」，「行内元素」什么的。比如说 `div` 啦，`p` 啦都是「块级元素」，`span` 啦是「行内元素」。可这么区分是正确的吗？

困扰我的地方在于，同为「块级元素」的 `div` 和 `p` 之间是有区别的，最明显区别在于 `div` 可以嵌套 `p`，可 `p` 无法嵌套 `div`。

好在 HTML 5 为我解答了这个疑惑。因为 HTML 5 抛弃了以上那些粗浅的划分方式，转而使用 content model。以下我用「内容模型」来代表 content model。

##什么是内容模型？
每个元素都有一个内容模型，它是元素能够包含何种内容的描述。内容模型共有八种，分别是：

- Metadata content
- Flow content
- Sectioning content
- Heading content
- Phrasing content
- Embedded content
- Interactive content
- Palpable content

基本上所有元素都会落入上述内容中。下面的图可能会看的更清楚：

![](http://images.whatwg.org/content-venn.png)

其中，`div` 和 `p` 都属于 Flow content。但它们的内容模型并不同，`div` 的内容模型是 Flow content，而 `p` 则是 Phrasing content。这就说明了为什么 `p` 无法嵌套 `div` 的原因。

至于为什么要这么划分，那就有待我继续学习啦。

参考文档：

- [HTML 5 规范](http://developers.whatwg.org/content-models.html#content-models)
- [HTML 5 与 HTML 4 的区别](http://www.w3.org/TR/html5-diff/#content-model)
