#Border

source: [CSS Refresher:Borders](http://net.tutsplus.com/tutorials/html-css-techniques/css-refreshers-borders/)

这篇文章介绍了关于 border 的一些知识，整理一下。

##基础
border 属性实际上是个复合属性，它是由 border-width，border-style，border-color 三个属性组合而成。这就意味着你可以单独修改其中之一，而不必重写整个 border。

例如：

	.box {
		border: 1px solid red;
	}

	.box:hover {
		border: 1px solid green;
	}

上面仅仅是改变了边框的颜色，更优雅的修改方法是这样：

	.box {
		border: 1px solid red;
	}

	.box:hover {
		border-color: green;
	}
	
##圆角
MDN：[border-radius](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius)

现在使用 border-radius 不必加制造商前缀。

该属性是其它四个属性的缩写：border-top-left-radius，border-top-right-radius，border-bottom-right-radius，border-bottom-left-radius。代表了元素个四个角。


##多重边框
###边框样式
最常用的 border-style 应该是 solid，dashed 和 dotted，此外还有两个也很有用 groove(凹槽) 和 ridge(凸槽)。

###轮廓
使用 outline 可以生成两个边框的效果：

	.box {
		border: 5px solid #292929;
		outline: 5px solid #e3e3e3;
	}

###伪类元素
使用 :before 和 :after 来生成更多的边框效果：

	.box {
	  width: 200px; height: 200px;
	  background: #e3e3e3;
	  position: relative;
	 
	  border: 10px solid green;  
	}
	 
	/* Create two boxes with the same width of the container */
	.box:after, .box:before {
	  content: '';
	  position: absolute;
	  top: 0; left: 0; bottom: 0; right: 0;
	}
	 
	.box:after {
	  border: 5px solid red;
	  outline: 5px solid yellow;
	}
	 
	.box:before {
	  border: 10px solid blue;
	}

###盒阴影
还有一种方法也可以模拟多边框：
	
	.box {
	    border: 5px solid red;
	     box-shadow: 
	       0 0 0 5px green, 
	       0 0 0 10px yellow,
	       0 0 0 15px orange;
	}

##修改角度
border-radius 支持传入两个参数，使用 / 分隔：
	
	border-radius: 50px / 100px;

50px 表示水平半径，100px 表示垂直半径。这样生成的就不是一个圆形，而是一个椭圆。

##CSS 图形
在高度和宽度为 0 的元素上使用边框来生成不同的形状。

例如一个 class 为 arrow 的 div，样式如下：

	.arrow {
        width: 0;
        height: 0;
        border: 100px solid;
        border-color: red green blue yellow;
    }

这样会生成一个由四个三角形组成的一个正方形。如果我们只设置其中一边的边框颜色，将其余边框设置为透明：

	.arrow {
        width: 0;
        height: 0;
        border: 100px solid;
        border-color: transparent transparent blue transparent;
    }

我们就得到了一个蓝色的三角形！

当然，使用伪元素可以让我们少写一个元素。
