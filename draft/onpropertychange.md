#onpropertychange

[MSDN](http://msdn.microsoft.com/en-us/library/ie/ms536956(v=vs.85.aspx)

IE 私有的事件，当元素的属性发生变化时触发。

这个事件是和 IE 旧的事件绑定方法关联的，即使用规范的 addEventListener 无法绑定该事件，必须用 attachEvent 或直接对元素的 onpropertychange 属性赋值。

使用 event.propertyName 来获得发生变动的属性名。我测试的时候修改了元素的 style.background，结果触发了很多次，因为 background 是个复合属性。

子元素使用 innerText 或 innerHTML 不会触发父元素的该事件。
