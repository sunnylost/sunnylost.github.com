[http://www.quirksmode.org/mobile/advisoryTouch.html](http://www.quirksmode.org/mobile/advisoryTouch.html)

[http://www.sitepen.com/blog/2011/12/07/touching-and-gesturing-on-iphone-android-and-more/](http://www.sitepen.com/blog/2011/12/07/touching-and-gesturing-on-iphone-android-and-more/)


####scroll 事件：
     只有当滚动停止后才会触发，延迟十分严重


**浏览器内核相同，行为一致**。(我就这么随口一说……感觉上是对的……)

小米 2S 的默认浏览器和 HTC 8060 的浏览器内核一致，行为也相同。

iPhone 4s IOS 7.04：

- chrome：AppleWebkit/537.51.1  Safari/8536.25
- safari：AppleWebkit/537.51.1  Safari/9537.53

Android:

- 小米 2S 默认和 safari，HTC 8060 默认：

 - AppleWebkit/534.30 Safari/534.30

- UC 9.2.0.308 - 9.3...：

 - AppleWebkit/534.31  Safari/534.31

- chrome for Android(不知道版本): 

 - AppleWebKit/537.36 Safari/537.36

- Maxthon
 - AppleWebKit/534.30 Safari/534.30

- Firefox 25

以下内容缩写

- start —— touchstart
- move —— touchmove
- end —— touchend

测试机型：
- 小米 2S, 3S
- HTC 8060
- iPhone 4s
- 魅族 MX3

###滑动(页面发生滚动):
     iPhone:
          safari:
               start——>move(多次触发)——>end——>scroll

	 Android:
	     HTC 默认, firefox, Mathon:
	           start——>(scroll——>move 这两个事件交替多次触发)——>end——>scroll(多次)  应该是 move 触发 scroll，因此 move 应该先于 scroll 触发
	
	     UC:
	           start——>move(即使手指还在屏幕上也只触发一次事件)——>scroll(多次)

###滑动(在页面顶部向上滑动)：
     iPhone:
          safari:
               start——>end

	 Android:
	     HTC 默认, firefox, safari, Maxthon:
	           start——>end
	          
	     chrome:
	           start
	      
	     UC 9.2:
	           start
	
	     UC 9.3:
	           start——>move

###滑动(在页面底部向下滑动)：
     iPhone:
          safari:
               start——>move(多次)——>end——>scroll
              
	 Android:
	     HTC 默认, safari, firefox, Maxthon：
	           start——>move(多次)——>end
	
	     chrome, UC 9.2, 9.3:
	           start——>move
