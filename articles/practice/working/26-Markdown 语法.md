---
id: markdown-syntax
sidebar_position: 26
title: Markdown 语法
description: Markdown 语法
last_update:
  author: Aurelius
  date: 2024-09-04
tags:
  - Markdown
  - LaTeX
  - 语法
---

## 引言

在 Python 编程中，有一些常用技巧和最佳实践可以帮助你编写更优雅、更高效的代码。本文将介绍的是 Python 中 `defaultdict` 的分组作用、`random` 在随机选取中的实践、使用 `networkx` 作图时，如何令图中的点一直保持相同的位置（不需要自行指定点的位置）、`logging.basicConfig` 的参数含义、`SQLAlchemy` 执行任意 SQL 等。

![Cover](<assets/Python 优雅编程：会报恩的代码（二）.drawio.png>)
在 Markdown 中使用 LaTeX 语法时，如果遇到公式中存在换行的警告信息，说明你在使用 `\\` 或 `\newline` 进行换行，而这些在 LaTeX 的展示模式中是无效的。

### 解决方案

1. **使用对齐环境（如 `align` 环境）**：
   如果你需要分行并对齐，可以使用 `align` 环境。示例代码如下：

   ```markdown
   $$
   \begin{align}
   a &= b + c \\
   &= d + e
   \end{align}
   $$
   ```

2. **使用 `split` 环境**：
   对于简单的换行，`split` 环境也是一个好选择：

   ```markdown
   $$
   \begin{split}
   a &= b + c \\
   &= d + e
   \end{split}
   $$
   ```

3. **用 `equation` 环境**：
   如果只是想在公式中表现换行，可以使用 `equation` 环境，并使用 `\begin{array}... \end{array}`：

   ```markdown
   $$
   \begin{equation}
   \begin{array}{l}
   a = b + c \\
   d = e + f
   \end{array}
   \end{equation}
   $$
   ```

4. **确保环境正确**：
   确保你在文档中使用的 Markdown 渲染器支持 LaTeX 公式的环境，如 `align`, `split`, 和 `array`，因为并不是所有的 Markdown 渲染器都支持这些环境。

### 例子总结

你可以根据自己的需求选择上述的一个解决方案，来处理公式中的换行问题。在使用这些环境时，需要确保你的 Markdown 编辑器或平台支持 LaTeX 的这些扩展功能。

---

**PS：感谢每一位志同道合者的阅读，欢迎关注、点赞、评论！**
