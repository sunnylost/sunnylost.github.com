#jQuery 源码阅读 callbacks.js

create-date: 2013-10-16

jQuery 中的 Callbacks 对象是众多模块的基础，例如 Deferred 对象。

Callbacks 是用于处理回调函数的列表对象，它支持添加、移除、触发，和禁用回调函数。

关于该对象的作用，这篇[博客](http://addyosmani.com/blog/jquery-1-7s-callbacks-feature-demystified/)讲的很清楚。

##flag 处理
Callbacks 的一个特点是它支持多种 flag，不同的 flag 代表一种特定功能：

1. once：确保回调函数只触发一次
2. memory：当回调函数触发完毕后，再次添加新的回调函数，会使用此前使用的参数来立即触发新回调函数
3. unique：同样的回调函数只能添加一次
4. stopOnFalse：当回调函数返回 false 时终止后续回调的触发

在 callbacks.js 的开头位置就是用于处理 flag 的代码。
	
	var optionsCache = {};

	// 将字符串格式的选项转成对象格式并保存在缓存对象中
	function createOptions( options ) {
		var object = optionsCache[ options ] = {};
		jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
			object[ flag ] = true;
		});
		return object;
	}

core_rnotwhite 是 core.js 中定义的 /\S+/g，除此之外没有什么内容需要介绍。

##细节
Callbacks 应该是 jQuery 中相对很好读的部分，因此我就不准备一句句介绍，说些我在阅读过程中产生困惑的地方。

源码中有 firing 这个变量存在，它表示当前列表是否在执行回调函数，在执行前，它的值为 true，全部回调函数执行完毕后，它的值设置为 false。

最开始的时候我的思路受了限制，以为回调函数触发的时候，根本无法去操作回调函数列表，因此对源码中 add 和 remove 方法对 firing 的判断表示不能理解，但后来我想到了：如果在回调函数中去操作列表，不是正好符合判断 firing 的情况吗？

	var callbacks = $.Callbacks();

	callbacks.add( function A() {
		console.log('A')
        callbacks.add(function B() {
            console.log('B')
        });
    });

	callbacks.add( function C() {
		console.log('C')
    });

	callbacks.fire();

当 A 函数触发时，它向队列里添加了一个函数 B，由于队列存在顺序问题，这个函数 B 应该晚于函数 C 的触发。这时只需要修改触发回调函数列表长度 firingLength 即可。

对于 Callbacks 我想说的只有这些。
