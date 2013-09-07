#V8 之旅：完整编译器#

by Jay Conrod

posted on 2012-11-04

updated on 2013-06-20

[原文链接](http://www.jayconrod.com/posts/51/a-tour-of-v8-full-compiler)

----------

Over the last five years, JavaScript performance has increased incredibly quickly, largely due to a transition from interpretation to JIT compilation in JavaScript virtual machines. This has greatly increased the usefulness of JavaScript and web apps in general. As a result, JavaScript is now the driving force of HTML5, the next wave of web technologies. One of the first JavaScript engines to generate and execute native code was V8, which is used in Google Chrome, the Android browser, WebOS, and other projects such as Node.js.

在过去的 5 年里，JavaScript 的性能有了惊人的进步，很大程度上得力于 JavaScript 虚拟机由解释(interpretation)转向了 JIT 编译。性能的提升又极大的推动了 JavaScript 的地位和 web app 的使用。当前的情况就是：JavaScript 成为了 HTML5 —— 下一波 web 技术浪潮 —— 的推动力量。V8 是第一个生成和执行本地代码的 JavaScript 引擎，它被用于 Google Chrome，Android 浏览器，WebOS，和其他项目例如 Node.js 中。

A little over a year ago, I joined a team at my company which optimizes V8 for our own ARM microarchitecture. Since that time, I've seen SunSpider performance double, and V8 benchmark performance increase by about 50%, due to contributions from both hardware and software.

就在一年前，我加入了公司中的一个团队，该团队为了我们公司自己的 ARM 微体系架构(microarchitecture)来对 V8 进行优化。从那时开始，I've seen SunSpider performance double, and V8 benchmark performance increase by about 50%, due to contributions from both hardware and software。

V8 is a really interesting project to work on, but unfortunately, the documentation for it is a little sparse. In the next few articles, I'll provide a high level overview, which will hopefully be interesting for anyone curious about the internals of virtual machines or compilers.

V8 是个很有趣的项目，但是很不幸，关于它的文档太少了。在接下来的几篇文章中，我会提供一个全局的概览，希望能够让那些对虚拟机或编译器内部机制感到好奇的人们产生兴趣。

##高层体系结构 High level architecture##

V8 compiles all JavaScript to native code before executing it. There is no interpretation and no bytecode. Compilation is done one function at a time (as opposed to trace-based compilation as used in TraceMonkey, the old FireFox VM). Usually, functions aren't actually compiled until the first time they are called, so if you include a big library script, the VM won't waste time compiling the unused parts of it.

V8 在执行 JavaScript 代码前会将它们编译为本地代码，不存在解释，也不会生成字节码。同一时间会编译一个函数(与之相反的是，TraceMonkey 使用基于跟踪的编译，它是 Firefox 曾经使用过的虚拟机)。通常，函数在第一次调用之前不会被编译，所以如果你加载一个很大的脚本库，虚拟机不会浪费时间去编译暂时用不到的部分。

V8 actually uses two different JavaScript compilers. I like to think of them as [the simple compiler and the helper compiler](http://hyperboleandahalf.blogspot.com/2010/11/dogs-dont-understand-basic-concepts.html). The full compiler (which is the focus of this article) is an unoptimizing compiler. Its job is to produce native code as quickly as possible, which is important for keeping page load times snappy. Crankshaft is the optimizing compiler. V8 compiles everything first with the full compiler, then uses a built-in profiler to select "hot" functions to be optimized by Crankshaft. Since V8 is mostly single-threaded (as of version 3.14), execution is paused while either compiler is running. Consequently, both compilers are designed to produce code quickly instead of spending a lot of time producing very efficient code. In future versions of V8, Crankshaft (or at least portions thereof) will run in a separate thread, concurrently with JavaScript execution, enabling more expensive optimization.

V8 实际上使用了两种不同的 JavaScript 编译器。我喜欢将它们称为[简单编译器和辅助编译器](http://hyperboleandahalf.blogspot.com/2010/11/dogs-dont-understand-basic-concepts.html)。完整编译器(full compiler， 也就是本文的重点)是一个未经过优化的编译器。它的任务就是尽可能快的生成本地代码，保证页面迅速载入。Crankshaft 是经过优化的编译器。 V8 首先将所有内容使用完整编译器来编译，然后使用一个内置的分析器来选择 "hot" 函数用于 Crankshaft 编译。由于 V8 主要是单线程(自版本 3.14)，当编译器运行时，执行过程便会暂停。因此，这两个编译器都被设计成能够尽快的生成代码，而不会花费大量时间来生成非常高效的代码。在 V8 将来的版本中，Crankshaft (或至少其中的部分) 将会在一个单独的线程内运行，和 JavaScript 的执行并行开来，来实现更昂贵的优化。

##为什么不用字节码？ Why no bytecode?##
Most VMs contain a bytecode interpreter, but this is notably absent from V8. You might wonder why the full compiler exists when it might be easier to compile to bytecode and execute that. It turns out that compiling to unoptimized native code isn't actually that much more expensive than compiling to bytecode. Consider the compilation processes for both:

大部分虚拟机包含了一个字节码解释器，但 V8 却没有这么做。你可能会想，为什么会有完整编译器的存在，直接编译成字节码再运行不是更简单嘛？实际表明，编译生成未经过优化的本地代码并不会比编译字节码的开销更昂贵。比较下两者的编译过程：

Bytecode compilation:
Syntax analysis (parsing)
Scope analysis
Translate syntax tree to bytecode
Native compilation:
Syntax analysis (parsing)
Scope analysis
Translate syntax tree to native

字节码编译：				本地编译：

·语法分析(解析)			·语法分析(解析)

·范围分析				·范围分析

·将语法树翻译成字节码		·将语法树翻译成本地代码

In both cases, we need to parse the source code and produce an abstract syntax tree (AST). We need to perform scope analysis, which tells us whether each symbol refers to a local variable, context variable (used by closures), or global property. The translation step is the only part that is different. You can do very elaborate things here, but if you want the compiler to be as fast as possible, you pretty much need to do a direct translation: every syntax tree node would get translated to a fixed sequence of bytecodes or native instructions.

无论是哪种情况，我们都需要解析源代码，生成一棵抽象语法树(AST)。我们需要执行范围分析，这将告诉我们每个符号指的是一个局部变量，上下文变量(用于闭包)，还是全局属性。翻译步骤是二者的唯一区别。你可以在这里做许多很精巧的事情，但如果你希望编译器变得更快，你需要一个非常直接的翻译：每一个语法树上的节点将被翻译为一条固定序列的字节码或本地指令。

Now consider how you would write an interpreter for bytecode. A native implementation would be a loop which fetches the next bytecode, enters a big switch statement, and executes a fixed sequence of instructions. There are various ways to improve on this, but they all boil down to the same structure.

现在考虑下，你将如何实现一个字节码的解释器。一种本地实现是用一个循环，不断的读取下一个字节码，进入一个大的 switch 语句，执行一条固定序列的指令。有很多中方法能够改进这个实现，但它们最终都是使用同样的结构。

Instead of generating bytecode and using an interpreter loop, what if we just emitted the appropriate fixed sequence of instructions for each operation? As it happens, this is exactly how the full compiler works. This removes the need for an interpreter, and simplifies transitions between unoptimized and optimized code.

如果我们不生成字节码，也不使用解释器循环，而只是为每个操作发送适当的固定序列的指令呢？恰好，这就是完整编译器的工作原理。这种做法不需要解释器，并且简化了未优化代码和优化代码之间的转换。

In general, bytecode is useful in situations where you can do some of the compiler's work ahead of time. This isn't the case inside a web browser, so the full compiler makes more sense for V8.

通常来说，字节码适用于这种场景：你想要提前做一些编译器该做的工作。但这种场景不适用于浏览器，因此完整编译器对于 V8 来说更合理。

##Inline caches：加速未优化的代码 Inline caches: accelerating unoptimized code##

If you look at the ECMAScript spec, you'll find that most operations are absurdly complicated. Take the + operator for instance. If both operands are numbers, it performs addition. If either operand is a string, it performs string concatenation. If the operands are something other than numbers or strings, some complicated (possibly user defined) conversion to primitive occurs before either number addition or string concatenation. Just by looking at the source code, there's no way to tell what instructions should be emitted. Property loads (example: o.x) are a good example of another potentially complicated operation. From looking at the code, you can't tell whether you're loading a normal property within the object (an "own" property), a property of a prototype object, a getter method, or some magic browser-defined callback. The property may not even exist. If you were to handle all possible cases in full-compiled code, even this simple operation would require hundreds of instructions.

如果你查阅 ECMAScript 规范，你会发现大部分操作十分复杂。拿 + 操作符为例。如果操作数都是数字，它将执行加法。如果操作数之一为字符串，它将执行字符串拼接。如果操作数既不是数字也不是字符串，那么就会先执行一些复杂的原始类型转换，然后再进行加法或字符串拼接。如果只看源码，你是没有办法区分该使用哪条指令。属性加载(例如：o.x) 是另一个很好的例子，它拥有潜在的复杂操作。从源代码来看，你无法判断出这是加载对象("自己"的属性)中的一个普通属性，或是原型对象上的属性，或是 getter 方法，或是一些神奇的浏览器定义的回调。这属性可能根本就不存在。如果你想在完整编译后的代码中处理全部可能性，那么即便是这么简单的操作都会需要上百条指令。

Inline caches (ICs) provide an elegant solution to this problem. An inline cache is basically a function with multiple possible implementations (usually generated on the fly) which can be called to handle a specific operation. I previously wrote about polymorphic inline caches for function calls. V8 uses ICs for a much broader set of operations: the full compiler uses ICs to implement loads, stores, calls, binary, unary and comparison operators, as well as the ToBoolean implicit operation.

Inline caches(ICs) 为该问题提供了一个优雅的解决方案。从根本上来说，一条 inline cache 就是一个拥有多种可能性实现(通常是动态生成)的函数，可以调用该函数来处理一个特定的操作。我前面说 [polymorphic inline caches for function calls](http://jayconrod.com/posts/44/polymorphic-inline-caches-explained) 用于函数调用。V8 则将 ICs 用于一个更广的操作集合中：完整编译器使用 ICs 来实现加载，存储，调用，二元，一元和比较操作符，以及 ToBoolean 隐式操作。

The implementation of an IC is called a stub. Stubs behave like functions in the sense that you call them, and they return, but they don't necessarily set up a stack frame and follow the full calling convention. Stubs are usually generated on the fly, but for common cases, they can be cached and reused by multiple ICs. The stub which implements an IC typically contains optimized code which handles the types of operands that particular IC has encountered in the past (which is why it's called a cache). If the stub encounters a case it's not prepared to handle, it "misses" and calls the C++ runtime code. The runtime handles the case, then generates a new stub which can handle the missed case (as well as previous cases). The call to the old stub in the full compiled code is rewritten to call the new stub, and execution resumes as if the stub had been called normally.

一个 IC 的实现称为 stub。当你调用 stub 时它表现的像个函数，并且它们有返回值，但是它们不需要生成一个堆栈结构和遵循完整的调用约定。stub 一般动态生成， 但通常情况下可以将其缓存并由多个 ICs 重复使用。 实现了一个 IC 的 stub 通常包含优化后的代码，它用于处理前面提到过的特定 IC 遇到的操作数的类型(这就是为什么它被称为一条缓存)。如果 stub 遇到了一个它还没有做好准备的情况，它就会 'miss' 并调用 C++ 运行时代码。运行时会处理该情况，生成一个能够处理该错过情况的新 stub(就像前一个 stub)。调用旧 stub 的完整编译后的代码会被重写为调用新 stub，当 stub 再次调用时执行过程便会恢复正常。

Let's take a simple example: a property load.

让我们看一个简单的例子：属性载入。
	
	function f(o) {
	  return o.x;
	}

When the full compiler first generates code for this function, it will use an IC for the load. The IC starts in the uninitialized state, using a trivial stub which doesn't handle any cases. Here's how the full compiled code calls the stub.

当完整编译器第一次为该函数生成代码时，它会使用一个 IC 用于载入操作。IC 从未初始化的状态开始，使用一个最简单的 stub(它不能处理任何情况)。接下来是完整编译后的代码是如何调用 stub 的。

	 ;; full compiled call site
	  ldr   r0, [fp, #+8]     ; 从栈中载入参数 "o"。load parameter "o" from stack
	  ldr   r2, [pc, #+84]    ; 从常量池中载入字符串 "x"。load string "x" from constant pool
	  ldr   ip, [pc, #+84]    ; 从常量池中载入未初始化的 stub。load uninitialized stub from constant pool
	  blx   ip                ; 调用 stub。call the stub
	  ...
	  dd    0xabcdef01        ; 前面加载的 stub 的地址。address of stub loaded above
	                          ; 当 stub miss 的时候地址会被替换。this gets replaced when the stub misses

(Sorry if you are not familiar with ARM assembly. Hopefully the comments make it clear what's happening.)

(如果你不熟悉 ARM 汇编，那么很抱歉。希望注释能够解释清楚它们的作用。)

Here's the code for the uninitialized stub:

接下来是未初始化的 stub 代码：

	;; uninitialized stub
	  ldr   ip,  [pc, #8]   ; 加载 C++ 运行时 "miss" 函数的地址。load address of C++ runtime "miss" function
	  bx    ip              ; 尾调用。tail call it
	  ...

The first time this stub is called, it will "miss", and the runtime will generate code to handle whatever case actually caused the miss. In V8, the most common way to store a property is at a fixed offset within an object, so let's see an example of that. Every object has a pointer to a map, which is a mostly immutable structure which describes the structure of the object. The in-object load stub will check the object's map against a known map (the one seen when the uninitialized stub missed) to quickly verify the object has the desired property in the right position. This map check lets us avoid an expensive hash table lookup.

stub 第一次调用时，它将 "miss"，接下来运行时将会生成代码来处理实际引发 miss 的情况。在 V8 中，保存属性最常用的方式是在对象中使用固定的偏移，所以让我们看看相关的例子。任何对象都有一个指针指向一个 map，它通常是一个用于描述对象结构的不变结构。对象内载入 stub 会检查对象的 map 和一个已知的 map(当未初始化的 stub miss 时见到的那个) 来快速检查对象是否在正确的位置存在所需的属性。该 map 检查能够为我们避免一次很昂贵的哈希表查找。

	;; monomorphic in-object load stub
	  tst   r0,   #1          ; 测试接收者是否为一个对象。test if receiver is an object
	  beq   miss              ; 如果不是则 miss。miss if not
	  ldr   r1,   [r0, #-1]   ; 载入对象的 map。load object's map
	  ldr   ip,   [pc, #+24]  ; 载入预期的 map。load expected map
	  cmp   r1,   ip          ; 它们是否相同？are they the same?
	  bne   miss              ; 如果不同则 miss。miss if not
	  ldr   r0,   [r0, #+11]  ; 载入属性。load the property
	  bx    lr                ; 返回。return
	miss:
	  ldr   ip,   [pc, #+8]   ; 加载代码调用 C++ 运行时。load code to call the C++ runtime
	  bx    ip                ; 尾调用。tail call it
	  ...

As long as this expression only has to deal with in-object property loads, the load can be performed quickly with no additional code generation. Since the IC can only handle one case, it is in a monomorphic state. If another case comes up, and the IC misses again, a megamorphic stub will be generated which is more general.

上面的描述只处理了对象中的属性加载，加载操作能够在不生成额外代码的情况下迅速执行。因为一个 IC 只能够处理一种情况，因此它是单态的。如果出现了另一种情况，而 IC 再次 miss，将会生成一个多态的 stub 来处理更普遍的情况。


##未完待续…… To be continued...##

As you can see, the full compiler fulfills its goal of quickly generating reasonably well-performing baseline code. Since ICs are used extensively, full compiled code is very generic, which makes the full compiler very simple. The ICs make the code very flexible, able to handle any case.

如你所见，完整编译器很好的达到了自己的目标，即快速生成合理的，性能良好的基线代码。由于 ICs 的广泛使用，完整编译后的代码变得十分通用，完整编译器也因此变得简单。ICs 增强了代码的灵活性，能够应对任何状况。

In the next article, we will look at how V8 represents objects in memory, allowing O(1) access in most cases without any structural specification from the programmer (such as a class declaration).

在下篇文章中，我们将探索 V8 是如何在内存中表现对象的，在程序员没有提供任何结构规范的前提下(例如一个类声明)，使得大多数情况下的访问对象时间复杂度达到 O(1)。
