---
id: python-elegant-programming-1
sidebar_position: 1
title: 会报恩的代码（一）
description: Python 优雅编程：会报恩的代码（一）
last_update:
  author: Aurelius
  date: 2024-08-25
tags:
  - Python
  - 优雅编程
  - 神来一码
  - 报恩的代码
  - yield
  - yield from
  - datetime
  - requests
---

## 引言

在 Python 编程中，有一些技巧和最佳实践可以帮助你编写更优雅、更高效的代码。本文将介绍 Python 中的 `yield` 和 `yield from` 用法，以及处理 `offset-naive` 和 `offset-aware` 的 `datetime` 对象时的最佳实践。此外，我们还将探讨如何处理 `requests` 异常，以提高代码的鲁棒性和用户体验。

![Cover](<assets/cover/Python 优雅编程：会报恩的代码.drawio.png>)

## yield 与 yield from

在 Python 中，`yield` 和 `yield from` 都用于生成器，但它们有不同的用途和行为。

### `yield`

- 用于定义生成器函数，返回一个值并暂停执行。
- 每次调用生成器的 `__next__()` 方法时，将从上次暂停的地方继续执行，直到下一个 `yield` 语句。
- 可以简单地生成值。

**示例：**

```python
def simple_generator():
    yield 1
    yield 2
    yield 3

gen = simple_generator()
print(next(gen))  # 输出: 1
print(next(gen))  # 输出: 2
```

### `yield from`

- 用于委派生成器，允许一个生成器调用另一个生成器。
- 自动处理了子生成器 `yield` 的返回值，并将所有 `yield` 的值传递给调用者，从而简化了生成器的嵌套结构。
- 在使用 `yield from` 后，外层生成器会等待内层生成器完成。

**示例：**

```python
def sub_generator():
    yield 1
    yield 2

def main_generator():
    yield from sub_generator()
    yield 3

gen = main_generator()
print(list(gen))  # 输出: [1, 2, 3]
```

### 关键区别

1. **用法**:

   - `yield` 用于单个生成器。
   - `yield from` 用于从一个生成器委托给另一个生成器。

2. **返回值**:

   - `yield` 不处理返回值。
   - `yield from` 可以从子生成器接收返回值并传播。

3. **代码简洁性**:

   - 使用 `yield from` 可以使代码更简洁，减少嵌套生成器的复杂性。

总结来说，`yield` 是基本的生成器功能，而 `yield from` 用于处理更复杂的生成器之间的关系，使代码更清晰和易于管理。

### 示例：嵌套生成器

```python
def flatten_contents(contents, role_type, category, parent_content_name=''):
    """
    解析压平 contents
    :param contents: 当前节点的 Content
    :param role_type: 1 - A; 2 - B; 3 - C; 4 - Ds;
    :param category: 1 - A; 2 - B;
    :param parent_content_name: 父节点名称
    :return: {content_id, content_name, content_type, parent_content_name, role_type, category}
    """

    for content in contents:
        if int(content['content_type']) == 1:
            yield from flatten_contents(
                content.get('sub_contents',[]),
                role_type,
                category,
                content.get('content_name','')
            )
        elif int(content['content_type']) in [2, 3]:
            yield {
                'content_id': content.get('content_id', ''),
                'content_name': content.get('content_name', ''),
                'content_type': content.get('content_type', ''),
                'parent_content_name': parent_content_name,
                'role_type': role_type,
                'category': category,
            }
```

## `offset-naive` and `offset-aware` datetimes

Python 中的 `datetime` 模块提供了两种类型的日期时间对象：`offset-naive` 和 `offset-aware`，如果直接对两个不同的对象进行比较，会抛出 TypeError：

```
TypeError: can't compare offset-naive and offset-aware datetimes
```

这个错误是由于尝试比较一个“无时区”（offset-naive）和一个“有时区”（offset-aware）的 `datetime` 对象引起的。要解决这个问题，需要确保两者都具有相同的时区信息。

以下是解决此问题的步骤：

1. **确保输入是 offset-aware**：在创建 `datetime` 对象时，使用 `timezone.utc` 为其指定时区。

2. **将 offset-naive 的 `datetime` 转换为 offset-aware**：如果你的其他 `datetime` 对象是 offset-naive，你需要将其转换成 offset-aware。

### 修复示例

假设你有一个“无时区”的 `datetime` 对象 `naive_dt`，你希望将其与 `datetime.fromtimestamp` 得到的有时区对象进行比较：

```python
from datetime import datetime, timezone

# 假设 naive_dt 是一个无时区的 datetime 对象
naive_dt = datetime(2023, 10, 1)  # 示例的 naive datetime

# 将 naive_dt 转换为 offset-aware datetime
naive_dt = naive_dt.replace(tzinfo=timezone.utc)

# 假设 updated_at 是一个毫秒级时间戳
updated_at = 1724330343000

# 比较 updated_at 和 naive_dt
updated_at = datetime.fromtimestamp(int(str(updated_at)[:10]), tz=timezone.utc)

if naive_dt < updated_at:
    print("naive_dt is earlier than updated_at")
```

确保所有 `datetime` 对象都保持一致的时区信息，通常使用 UTC 可以避免此类问题。

## requests 最佳实践

在处理 `requests.exceptions.ConnectionError` 异常（比如 `ConnectionResetError`）时，可以采取以下最佳实践，以提高代码的鲁棒性和用户体验：

### 异常捕获

使用 `try-except` 块捕获异常，使程序能优雅地处理错误。

```python
import requests

try:
    response = requests.get('https://example.com')
    response.raise_for_status()  # 检查 HTTP 响应状态
except requests.exceptions.ConnectionError as e:
    print(f"Connection error: {e}")
except requests.exceptions.HTTPError as e:
    print(f"HTTP error: {e}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
```

### 重试逻辑

如果遇到暂时性的连接错误，可以实现重试机制。例如使用 `Retry` 来进行简单的重试。

```python
from requests.adapters import HTTPAdapter, Retry

session = requests.Session()
retry = Retry(
    total=5,  # 最多重试 5 次
    backoff_factor=1,  # 每次重试之间的等待时间倍增
    status_forcelist=[500, 502, 503, 504],  # 重试的 HTTP 状态码
)

adapter = HTTPAdapter(max_retries=retry)
session.mount('https://', adapter)

try:
    response = session.get('https://example.com')
    response.raise_for_status()
except requests.exceptions.ConnectionError as e:
    print(f"Connection error: {e}")
except requests.exceptions.HTTPError as e:
    print(f"HTTP error: {e}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
```

### 日志记录

为产生的异常添加日志记录，以方便后续的故障排查。

```python
import logging

logging.basicConfig(level=logging.INFO)

try:
    response = session.get('https://example.com')
    response.raise_for_status()
except requests.exceptions.ConnectionError as e:
    logging.error(f"Connection error: {e}")
except requests.exceptions.HTTPError as e:
    logging.error(f"HTTP error: {e}")
except Exception as e:
    logging.error(f"An unexpected error occurred: {e}")
```

### 最后的处理

确定在重试失败后如何处理，例如返回默认值、抛出自定义异常或退出程序等。

```python
if response is None:
    # 处理失败的请求，例如返回默认值
    response = {'data': None, 'error': 'Failed to retrieve data'}
```

以上步骤结合使用将有助于实现良好的错误处理机制，并提升用户体验。

## 结语

通过使用 `yield` 和 `yield from`，你可以更好地管理生成器之间的关系，使代码更加简洁和易于理解。同时，处理 `offset-naive` 和 `offset-aware` 的 `datetime` 对象时，确保它们具有相同的时区信息，以避免出现 `TypeError` 异常。在处理 `requests` 异常时，使用异常捕获、重试逻辑、日志记录和最后的处理等最佳实践，可以提高代码的鲁棒性和用户体验。

---

**PS：感谢每一位志同道合者的阅读，欢迎关注、点赞、评论！**
