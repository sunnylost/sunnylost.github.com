@filename: js.load.scripts.sequence
@title: Script 文件加载顺序
@list: JavaScript

date: 2014-3-8

[这篇文章](http://www.html5rocks.com/en/tutorials/speed/script-loading/)的中提到了Mozilla 的一篇[文章](https://hacks.mozilla.org/2009/06/defer/)。文中测试了 `script` 标签的 `defer` 属性对脚本加载顺序的影响。09 年的老文，但是也值得再做下测试。

测试文件地址在[这里](//sunnylost.com/test/test-script-load-sequence/)。点击 `Launch test 2` 即可。

以下是测试结果(Opera 20 和 Chrome 输出一样)：

Chrome 35(刷新后结果不一样，主要是 3,4,5,6 四个 js 的加载顺序)

  	Inline HEAD deferred
	Inline HEAD
	External HEAD (script2.js)
	Inline BODY deferred
	Inline BODY
	External BODY (script8.js)
	External HEAD deferred (script1.js)
	External BODY deferred (script7.js)
	DOMContentLoaded
	Dynamic DOM insertion of a script (script3.js)
	Dynamic DOM insertion of a deferred script (script4.js)
	Deferred dynamic DOM insertion of a script (script5.js)
	Deferred dynamic DOM insertion of a deferred script (script6.js)
	Body onLoad

Firefox 30(多次刷新后顺序也不变)

	Inline HEAD deferred
	Inline HEAD
	External HEAD (script2.js)
	Inline BODY deferred
	Inline BODY
	External BODY (script8.js)
	External HEAD deferred (script1.js)
	External BODY deferred (script7.js)
	Dynamic DOM insertion of a script (script3.js)
	Dynamic DOM insertion of a deferred script (script4.js)
	Deferred dynamic DOM insertion of a script (script5.js)
	Deferred dynamic DOM insertion of a deferred script (script6.js)
	DOMContentLoaded
	Body onLoad

IE 11(顺序固定)
	
	Inline HEAD deferred
	Inline HEAD
	External HEAD (script2.js)
	Inline BODY deferred
	Inline BODY
	Dynamic DOM insertion of a script (script3.js)
	Dynamic DOM insertion of a deferred script (script4.js)
	Deferred dynamic DOM insertion of a script (script5.js)
	Deferred dynamic DOM insertion of a deferred script (script6.js)
	External BODY (script8.js)
	External HEAD deferred (script1.js)
	External BODY deferred (script7.js)
	DOMContentLoaded
	Body onLoad

以下 IE 版本均使用 IE 11 调试器模拟。

IE 10(顺序固定)

	Inline HEAD deferred
	Inline HEAD
	External HEAD (script2.js)
	Dynamic DOM insertion of a script (script3.js)
	Dynamic DOM insertion of a deferred script (script4.js)
	Deferred dynamic DOM insertion of a script (script5.js)
	Deferred dynamic DOM insertion of a deferred script (script6.js)
	Inline BODY deferred
	Inline BODY
	External BODY (script8.js)
	External HEAD deferred (script1.js)
	External BODY deferred (script7.js)
	DOMContentLoaded
	Body onLoad

IE 9(顺序固定)

	Inline HEAD
	Inline HEAD deferred
	External HEAD (script2.js)
	Dynamic DOM insertion of a script (script3.js)
	Dynamic DOM insertion of a deferred script (script4.js)
	Inline BODY
	External BODY (script8.js)
	External HEAD deferred (script1.js)
	Deferred dynamic DOM insertion of a script (script5.js)
	Deferred dynamic DOM insertion of a deferred script (script6.js)
	Inline BODY deferred
	External BODY deferred (script7.js)
	DOMContentLoaded
	Body onLoad

IE 7，8(顺序固定，没有 `DOMContentLoaded` 事件)

	Inline HEAD
	External HEAD (script2.js)
	Dynamic DOM insertion of a script (script3.js)
	Dynamic DOM insertion of a deferred script (script4.js)
	Inline BODY
	External BODY (script8.js)
	Inline HEAD deferred
	External HEAD deferred (script1.js)
	Deferred dynamic DOM insertion of a script (script5.js)
	Deferred dynamic DOM insertion of a deferred script (script6.js)
	Inline BODY deferred
	External BODY deferred (script7.js)
	Body onLoad


##总结
*以下内容不保证准确性。*

- Firefox，按照标准实现

    - `defer` 对于没有 `src` 属性的脚本不生效
    - 拥有 `defer` 的脚本严格按照声明的顺序执行
    - 动态生成的 `defer` 脚本不具有延迟加载特性
    - 动态生成的脚本在页面内所有脚本执行完毕后才执行
    - `DOMContentLoaded` 事件会在所有脚本执行完毕后才触发，**包括**动态创建的脚本

- Chrome
	- 动态生成的 `defer` 脚本和普通脚本加载顺序不确定
	- `DOMContentLoaded` 事件会在所有脚本执行完毕后才触发，**不包括**动态创建的脚本

- IE 11
	- HTML 页面中带有 `defer` 的脚本在动态创建的脚本执行后才执行

- IE 10
	- 动态生成的脚本会立即加载

- IE 7，8，9
	- `defer` 对于没有 `src` 属性的脚本也会生效