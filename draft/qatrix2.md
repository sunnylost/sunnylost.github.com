## Qatrix 源码阅读 2 ##
### Manipulation ###
这里只说一个方法 $text。

该方法用于获取或设置元素的文本。本来该方法和 $html 应该是同样的代码量，毕竟用法和功能类似，但是看看源码，比 $html 多出了两倍不止，为什么会这样？

我们知道获取元素的 HTML 代码用 innerHTML()，本来获取元素的文本也应该是 innerText()，但是 Firefox 使用了另一个名字：textContent。到后来，textContent 成了标准，IE 9 开始支持该方法。

这两个方法可不仅仅是名字上的区别，参见 [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Node.textContent) 关于两者的区别介绍：

1，textContent 会获取所有元素的内容，包括 &lt;script&gt; 和 &lt;style&gt; 元素，但是 innerText 不会。

2，innerText 会受到样式的影响，它不会返回隐藏元素的文本，但 textContent 会。

3，由于 innerText 受到 CSS 样式影响，因此它会触发 reflow，但 textContent 不会。

由于以上存在的区别(尤其是第一，二条)，所以 Qatrix 自己实现了获取元素内容的方法。

让我们略过 mapcall 方法调用，来看源码：

    if (text) {
		// Set text node.
		$empty(elem);
		elem.appendChild(document.createTextNode(text));

		return elem;
	}

当 text 参数传入，表明是设置元素的文本，先使用 $empty 清空元素，然后再添加文本节点。

    else {
		var rtext = '',
			textContent = elem.textContent,
			nodeType;

		// 如果元素的内容只是文本
		if ((textContent || elem.innerText) === elem.innerHTML) {
			rtext = textContent ? $string.trim(elem.textContent.replace(rbline, '')) : elem.innerText.replace(rline, '');
		}
		else {
			for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
				nodeType = elem.nodeType;

				if (nodeType === 3 && $string.trim(elem.nodeValue) !== '') {
					rtext += elem.nodeValue.replace(rbline, '') + (elem.nextSibling && elem.nextSibling.tagName && elem.nextSibling.tagName.toLowerCase() !== 'br' ? "\n" : '');
				}

				if (nodeType === 1 || nodeType === 2) {
					rtext += $text(elem) + ($style.get(elem, 'display') === 'block' || elem.tagName.toLowerCase() === 'br' ? "\n" : '');
				}
			}
		}

		return rtext;
	}

该段内容里有一个 if else 分支，当元素的内容仅包含文本时，使用元素支持的获取文本的方法来调用。因为 innerHTML 没有 innerText 的那些限制，因此如果元素是 script、style 或是隐藏的元素，那么 innerHTML 和 innerText 获取的值必然不同，就不会进入该分支。

在下一个分支里，开始手动循环元素的子节点。

如果子节点是文本节点，即 nodeType 为 3，去掉换行，但接下来的判断我搞不太懂了，下一个元素不是 br 的话，什么要生成一个换行呢？

如果子节点是元素节点或属性节点，则递归调用 $text 来处理子节点下的子节点。在拼接字符串时判断了元素的 display 是否为 block，因为块状元素会产生换行，所以这里把它和 br 元素一并处理。
