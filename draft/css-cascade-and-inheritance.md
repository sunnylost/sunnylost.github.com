#CSS 层叠与继承
[规范地址(2013-10-3)](http://www.w3.org/TR/css3-cascade)

##`@import` 规则
从其他样式表中导入规则。

`@import` 必须放在所有 at 规则(除了 `@charset`)前面。

##速记属性(shorthand properties)
速记属性中确实的声明部分，默认会使用它的初始值来声明。

###`all` 属性
是所有属性(除了 `direction` 和 `unicode-bidi`)的速记方式，可以设置 `inherit`，`initial` 和 `unset`。

Firefox 从 27 开始支持。

##值处理
获取 CSS 属性的最终值需要经过诸多步骤：

1. 收集元素的所有声明值(declared value)。
2. 层叠产生层叠值(cascaded value)。
3. 缺省化产生指定值(specified value)。
4. 解析值的依赖产生计算值(computed value)。
5. 格式化文档产生使用值(used value)。
6. 最终，使用值基于显示环境的限制转为实际值(actual value)。

