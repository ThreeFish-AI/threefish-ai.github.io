---
id: python-elegant-programming-5
sidebar_position: 30
title: Python 优雅编程：会报恩的代码（五）
description: Python 优雅编程：会报恩的代码（五）
last_update:
  author: Aurelius
  date: 2024-09-07
tags:
  - Python
---

## 引言

在 Python 编程中，有一些常用技巧和最佳实践可以帮助你编写更优雅、更高效的代码。本文将介绍的是 Python 中使用 `Scikit-Learn` 下载 `MNIST` 数据，并训练模型，序列化模型、`MLPClassifier` 模型的参数查看、MLPClassifier 的`激活函数`及其实现、从 `pandas.core.frame.DataFrame` 中获取数据等。

![Cover](<assets/Python 优雅编程：会报恩的代码（三）.drawio.png>)

## 使用 Python 搜索文本中的指定单词，不区分单词的大小写

你可以使用 Python 的内置字符串方法以及正则表达式来搜索文本中的指定单词，而不区分大小写。以下是两种常见的方法：

### 方法一：使用 `str.lower()`

如果你希望使用简单的字符串方法，可以将文本和目标单词都转换为小写，然后进行比较：

```python
def search_word(text, word):
    # 转换为小写
    text_lower = text.lower()
    word_lower = word.lower()

    # 检查单词是否在文本中
    if word_lower in text_lower:
        return True
    return False

# 示例
text = "Hello, this is a sample Text."
word = "text"
found = search_word(text, word)
print(found)  # 输出: True
```

### 方法二：使用 `re` 模块

如果你想使用正则表达式，可以用 `re` 模块的 `re.IGNORECASE` 选项：

```python
import re

def search_word(text, word):
    # 使用正则表达式不区分大小写
    pattern = re.compile(re.escape(word), re.IGNORECASE)

    return bool(pattern.search(text))

# 示例
text = "Hello, this is a sample Text."
word = "text"
found = search_word(text, word)
print(found)  # 输出: True
```

### 小结

这两种方法都可以有效地搜索文本中的指定单词，而不区分大小写。选择适合你需求的方法即可。

## 如果是搜索多个单词呢？

如果你希望在文本中搜索多个单词，可以扩展前面的示例。下面是两种方法来实现这一功能：

### 方法一：使用 `str.lower()` 和循环

你可以将多个单词转换为小写并逐个检查：

```python
def search_words(text, words):
    # 转换为小写
    text_lower = text.lower()
    words_lower = [word.lower() for word in words]

    # 检查每个单词是否在文本中
    found_words = [word for word in words_lower if word in text_lower]
    return found_words

# 示例
text = "Hello, this is a sample Text."
words = ["text", "hello", "sample", "world"]
found = search_words(text, words)
print(found)  # 输出: ['text', 'hello', 'sample']
```

### 方法二：使用 `re` 模块

使用正则表达式可以创建一个模式，匹配多个单词：

```python
import re

def search_words(text, words):
    # 创建正则表达式模式
    pattern = re.compile(r'\b(?:' + '|'.join(map(re.escape, words)) + r')\b', re.IGNORECASE)

    # 搜索所有匹配的单词
    return pattern.findall(text)

# 示例
text = "Hello, this is a sample Text."
words = ["text", "hello", "sample", "world"]
found = search_words(text, words)
print(found)  # 输出: ['Hello', 'Text', 'sample']
```

### 小结

这两种方法都可以有效地搜索文本中的多个指定单词。你可以根据需求选择适合的方法。第一种方法直接使用字符串方法，第二种方法则利用正则表达式提供了更强大的功能。

---

这段正则表达式用于编译一个模式，以匹配多个指定单词。以下是对每个部分的详细解释：

### 1. `r'\b(?:...)\b'`

- **`r'...'`**: 这是一个原始字符串（raw string），它告诉 Python 不要对字符串中的反斜杠进行转义处理。这在编写正则表达式时非常有用，因为正则中的很多模式都包含反斜杠。

- **`\b`**: 这是一个单词边界（word boundary）匹配符。它匹配单词的开始或结束位置，确保匹配的单词是完整的，而不是长词的一部分。例如，在匹配“cat”时，`\bcat\b`只会匹配“cat”这个词，而不会匹配“category”中的“cat”。

- **`(?:...)`**: 这是一个非捕获分组（non-capturing group）。它的作用是将多个元素组合在一起，但不创建一个捕获组。这样可以在正则表达式中将多个选项组合在一起，而不会增加额外的捕获组。

### 2. `|`（或操作符）

- **`'|'.join(map(re.escape, words))`**: 这段代码会将 `words` 列表中的所有单词通过 `|`（或操作符）连接成一个长字符串。`map(re.escape, words)` 用于处理 `words` 列表中每个单词，确保特殊字符不会影响正则表达式的匹配。例如，如果单词中有点号、星号等特殊字符，`re.escape` 会在这些字符前添加反斜杠，使其被视为字面字符。

### 3. `re.IGNORECASE`

- 这是一个标志，表示匹配时不区分大小写。当这个标志被设置，正则表达式的匹配会忽略字母的大小写。

### 总体含义

整个表达式的作用是：

1. 将多个单词组合成一个正则模式。
2. 确保这些单词作为独立的整词出现（通过使用单词边界）。
3. 在搜索时不区分大小写。

例如，如果 `words` 列表包含 `["cat", "dog"]`，则编译后的 `pattern` 表达式将类似于：

```python
r'\b(?:cat|dog)\b'
```

这样，这个模式就可以匹配文本中的“cat”或“dog”，并且这些单词必须是独立的，不是其他词的一部分。

## 对相同的 words 反复执行 re.compile，re 是否会缓存编译结果？

是的，Python 的 `re` 模块确实会缓存编译的正则表达式。这个缓存机制可以有效提高性能，避免对同一模式的重复编译。

### 详细解释：

1. **编译正则表达式**：
   当你使用 `re.compile()` 编译一个正则表达式时，Python 会创建一个正则表达式对象，并在内部进行一些优化。

2. **缓存机制**：

   - `re` 模块会在内部缓存最近使用的正则表达式。具体来说，Python 会保留最后 1000 个不同的模式，以供后续的重复使用。
   - 如果你在同一程序运行中多次使用 `re.compile()` 编译相同的模式，Python 会直接返回缓存中的已经编译的对象而不是重复编译。

3. **性能提升**：
   这个缓存机制特别有用，因为正则表达式的编译是一个相对昂贵的操作。通过避免重复编译，可以显著提高代码的运行效率。

### 注意事项：

- 如果你在多个不同的字典或列表中使用相同的正则表达式模式，并在此过程中调用 `re.compile()`，那么如果模式相同，Python 会利用缓存。
- 但是，为了保证最佳性能，尤其在频繁使用的情况下，建议将相同的正则表达式编译一次并存储在变量中，而不是每次都调用 `re.compile()`。

下面是一个示例：

```python
# 多次使用相同的正则表达式
pattern1 = re.compile(r'\bcat\b', re.IGNORECASE)
pattern2 = re.compile(r'\bcat\b', re.IGNORECASE)

# pattern1 和 pattern2 是相同的模式
print(pattern1 is pattern2)  # 输出可能为 False，但模式是相同的
# True
```

在处理不同单词集合时，建议在循环外部编译正则模式，确保良好的性能并充分利用缓存特性。

## 结语

本文介绍了 Python 中的 `urllib` 及其 `quote_plus` 功能、`imaplib` 与 `smtplib`、`pathlib` 与 `path`、`matplotlib`、`Keras` 等模块的一些特定用法，希望这些小技巧能在某个特定的时间正好帮到你。

---

**PS：感谢每一位志同道合者的阅读，欢迎关注、点赞、评论！**
