@title: jQuery 源码阅读 access() 方法
@filename: jquery.access
@list:jQuery

**关于 bulk 暂时没找到例子，所以这篇文章不算完成……**

access() 是个很巧妙的方法，它被放置于 core.js 中，作为静态方法存在。

jQuery 是以 DOM 节点为核心，当你使用 $ 获取到对应的 DOM 节点集合后，一切的操作基本上都会围绕这些节点展开。

我粗略的将 jQuery 针对 DOM 节点的操作方法分为两种，一种是 get，获取节点信息，一种是 set，设置节点信息。

对于 get，通常只需要获取节点集合中的第一个元素，例如你要获取元素的高度、宽度、颜色等等，你通常只会得到一个值。

而对于 set，则会对整个集合中的节点生效，例如：

     $('div').height(100);
    

这便将所有 div 的高度设置为 100 像素。

既然一切围绕着节点的集合来操作，那么循环集合便是不可避免的，但如果在每个方法里面都写个 for 循环，是在是有些难堪。这些循环的内容从形式上基本相同，放到每个方法里面纯属冗余，还不如单独提取出来，在一个新的方法里面对集合做操作。这就是 access() 方法的作用。

先来看看 access() 的参数列表：

    access: function( elems, fn, key, value, chainable, emptyGet, raw )
    

elems 就是要循环的节点集合。

fn 是需要对节点进行操作的函数。

key 是属性名，例如 $('#test').height(); 这里的 height(字符串)。

value 是值，例如 $('#test').height(100); 中的 100。

chainable 表示是否链式执行，对于 get 类方法，我们会获得一个返回值，例如字符串、数字等等，这时候是不需要链式执行的，而对于 set 类方法，通常需要如此，例如：

    $('#test').height(100).width(100).css('color', 'red');
    

emptyGet 用于节点集合中没有元素时返回的默认值。

raw 为 true，表明 value 是个函数，你经常会在 jQuery 的 API 中看到参数可以为函数，举个我都快举烂的例子，height() 方法，点击[http://api.jquery.com/height/](http://api.jquery.com/height/) 查看 height() 的文档，你会看到，

    .height( function(index, height) )
    

raw 就是用于区分这种参数的。

开始看源码：

    var i = 0,
        length = elems.length,
        bulk = key == null;
    

_此处的 bulk 指的是批量操作，key 为 null，就是说当前的操作即……_

    if ( jQuery.type( key ) === &quot;object&quot; ) {
        chainable = true;
        for ( i in key ) {
            jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
        }
    }
    

key 为对象，就表明这是一个类似于 { height: 100, width: 200 } 的键值对，是将多步操作合并在了一起，而且这样的操作不能是 get 类方法，因为你没法确定最终的返回值是什么，所以 chainable 设置为 true，并且循环 key 对象来分别调用 access 方法。

    } else if ( value !== undefined ) {
        chainable = true;
    
        if ( !jQuery.isFunction( value ) ) {
            raw = true;
        }
    

value 存在，表明是 set 类方法，所以依然是允许链式调用。raw 的含义上面介绍过了。

    if ( bulk ) {
        // 批量操作针对整个集合来运行
        if ( raw ) {
            fn.call( elems, value );
            fn = null;
    
        // 除非 value 是个函数
        } else {
            bulk = fn;
            fn = function( elem, key, value ) {
                return bulk.call( jQuery( elem ), value );
            };
        }
    }
    
    if ( fn ) {
        for ( ; i &lt; length; i++ ) {
            fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
        }
    }
    

如果我能找到 bulk 的真实例子，那么对上面代码可能就会更好的理解了……

好的，终于到了函数结尾处。注意前面处理的都是 set 类方法，包括设置一个值或设置多个值，那么 get 类方法呢？嘿嘿，它们都可怜巴巴的即在 return 里了。

    return chainable ?
            elems :
            bulk ?`
                fn.call( elems ) :
                length ? fn( elems[0], key ) : emptyGet;
    

通过前面的源码能看到，chainable 被设置成了 true，链式调用返回的就是元素集合本身。

如果不是链式调用，那么可认为是 get 类方法。

bulk 为 true，说明需要在所有 elems 上调用 fn，它的操作结果就是返回值。

接下来判断 length，即元素集合中元素的个数，如果集合为空，则返回默认值 emptyGet，否则返回集合中第一个元素与 key 传入 fn。