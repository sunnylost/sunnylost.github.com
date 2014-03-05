@title:localStorage 性能
@filename:html5.localstorage
@list: HTML 5

上午读了两篇文章：[localStorage Read Performance](http://calendar.perfplanet.com/2011/localstorage-read-performance/) 和 [There is no simple solution for local storage](https://hacks.mozilla.org/2012/03/there-is-no-simple-solution-for-local-storage/)。总结起来一句话：localStorage 的性能不咋地。

Chris Heilmann 在文章中总结了 localStorage 的优点：

1. 用法简单，十分简单。
2. 用字符串来保存数据而不是复杂的数据库(当然可以使用 json 格式的字符串)。
3. 众多[浏览器](http://caniuse.com/#search=webstorage)支持。
4. 众多开发厂商支持。

看起来很美好，可阳光照不到的地方总是黑暗丛生，localStorage 的本质是同步，这就注定了它的性能问题迟早会浮现出来。

localStorage 的实现方式是在硬盘中保存一个文件，当需要读取数据时，便要把文件读取到内存中，这个过程是同步的，这也就意味着浏览器什么也不能做，直到文件读取完毕。

根据 Zakas 做的两个 Benchmark，从 localStorage 中读取数据和从对象中读取数据相差十分巨大，在我的 Chrome 31 上显示为 100 倍的差距！

当第一次使用 localStorage 读取数据时，浏览器从效率角度考虑需要把文件读取到内存中缓存起来，这个读取的过程便涉及到了文件 IO 操作。根据博客中的内容，和 [PSA: DOM Local Storage considered harmful](https://blog.mozilla.org/tglek/2012/02/22/psa-dom-local-storage-considered-harmful/) 这篇来看，IO 操作是个容易受到众多不稳定因素影响的操作，例如 Windows 的索引服务，杀毒软件的操作等，这就导致 IO 操作的时间可能从 0 毫秒到几秒钟不等，浏览器也会因此失去响应，这对于一个网站来说是致命的缺点。

可是从目前的状况来看，客户端存储尚未有一个简单的方案，像 IndexedDB 这样的重型解决方案同样拥有不少缺点。以上的博客中也对未来做了展望，其中将 localStorage API 实现为异步的应该是最好的结果了。

再次回到 Zakas 做的 Benchmark 中，可以总结一些 localStorage 的最佳方式：

1. 使用 localStorage 的 getItem() 而不是直接通过 key 来读取数据的效率会更好。
2. 频繁调用 localStorage 的 API 会影响性能。
3. 数据的大小不会对 API 调用产生影响，因此应该尽量向一个条目中存储多的内容。
