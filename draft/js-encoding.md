@filename: js.encoding
@title: JavaScript 字符编码
@list: JavaScript

参考资料：

[JavaScript’s internal character encoding: UCS-2 or UTF-16?](http://mathiasbynens.be/notes/javascript-encoding)

[字符编码笔记：ASCII，Unicode和UTF-8](http://www.ruanyifeng.com/blog/2007/10/ascii_unicode_and_utf-8.html)

[The Absolute Minimum Every Software Developer Absolutely, Positively Must Know About Unicode and Character Sets (No Excuses!)](http://www.joelonsoftware.com/articles/Unicode.html)

[Character set encoding basics](http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&item_id=IWS-Chapter03)

[Character encodings for beginners](http://www.w3.org/International/questions/qa-what-is-encoding)


##1，*什么是编码？*

将信息以某种方式展现的过程。

##2，*什么是字符(character)？*

字符是用于计算机系统内部代表字母和符号的单位。

##3，*什么是字符编码(character set encoding，或 character encoding)？*

由于计算机只能识别二进制，因此前面提到的字符也是用二进制来表示的，所以字符编码就是将字符转换为二进制的系统。

一个完整的字符编码模型由四个级别的表现形式组成： abstract character repertoire， coded character set， character encoding form, character encoding scheme。

##4，*什么是抽象字符指令集(Abstract character repertoire，ACR)？*

需要编码的字符的无序集合。*抽象*的意思是说它只是一个概念，计算机里并不存在这样一个东西。

##5，*什么是编码字符集(Coded character set，CCS)？*

指令集与一组唯一的数字标志符(numeric designator)之间的映射。

数字标志符通常被称为 **codepoint**。

抽象字符和它对应的 codepoint 合起来称为 **encoded character**(已编码字符)。

codepoint 是有范围的，通常是由编码规范来决定，这个范围被称为 **codespace**。

已编码字符的集合称为 **codepage**。

规范通常还会为已编码字符分配一个唯一的名字。

##6，*什么是字符编码形式(Character encoding form，CEF)？*

到这一级别开始涉及计算机内部表现形式。CEF 就是 CCS 中的 codepoint 与一个固定数据类型的值之间的映射。

这个固定类型的值称为 **code units**。它可以为任意长度，常见的是 8 位，16 位和 32 位。

**注意**，codepoint 和 code unit 之间并不是一一对应的。通常一个 codepoint 会对应多个 code unit。

Unicode 拥有一个 CCS，它适用于三种 CEF，即 UTF-8(8 位 code unit)，UTF-16(16 位 code unit)，UTF-32(32 位 code unit)。

##7，*什么是字符编码方案(Character encoding scheme，CES)？*

许多系统操作 8 位的字节，因此 16 位或 32 位的数据需要拆分为 8 位，这就涉及到了拆分后的顺序问题。little-endian 表示低位字节在前，big-endian 表示高位字节在前。CES 就是用于处理这种问题的。

##8，*JavaScript 采用什么编码？*

JavaScript 允许 UCS-2 或 UTF-16 编码。

##9，*详细说说？*

Unicode 由 17 个位面(plane)组成，每个位面包含 2^16 个 codepoint。这些 codepoint 由 16 进制表示，从 `xy0000` 至 `xyFFFF`，其中 `xy` 是从 `00` 到 `10` 的十六进制值。

第一个位面(`xy` 为 `00`)被称为 *Basic Multilingual Plane*，即 BMP。它包含了最常见的字符。

其余十六个位面称为 *supplementary planes*，即 non-BMP。

UCS-2 采用固定长度格式，即每个 codepoint 对应一个 16 位的 code unit。所以它覆盖的范围正好是 BMP。

UTF-16 采用变长格式，每个 codepoint 对应一或两个 16 位的 code unit。

##10，*这对 JavaScript 有什么影响？*

问题出现在 JavaScript 对于字符的理解。在规范中，code unit 和字符都被看做是一个 16 位无符号的值。

即当字符串中出现了一个 non-BMP 字符，它会对应两个 code unit，但实际上它只是一个字符，JavaScript 则认为它是两个。

这影响到了一切和字符串有关的操作，包括正则表达式的匹配。

##11，*怎么解决？*

当要操作 non-BMP 的字符时，可使用 [Punycode.js](https://github.com/bestiejs/punycode.js)。

ES 6 为 String 增加了新的方法：fromCodePoint() 和 codePointAt()，它们都会操作 codepoint 而并非 code unit。

正则表达式也会增加一个新的标识 `u` 来处理该问题。