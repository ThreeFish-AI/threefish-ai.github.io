---
id: python-elegant-programming-2
sidebar_position: 18
title: Python 优雅编程：会报恩的代码（二）
description: Python 优雅编程：会报恩的代码（二）
last_update:
  author: Aurelius
  date: 2024-08-25
tags:
  - Python
  - 优雅编程
  - 神来一码
  - 报恩的代码
  - defaultdict
  - random
  - networkx
---

## 引言

在 Python 编程中，有一些技巧和最佳实践可以帮助你编写更优雅、更高效的代码。本文将介绍的是 Python 中 `defaultdict` 的分组作用，以及 `random` 在随机选取中的实践，此外，我们还将探讨在使用 `networkx` 作图时，如何令图中的点一直保持相同的位置（不需要自行指定点的位置）。

![Cover](<assets/Python 优雅编程：会报恩的代码（二）.drawio.png>)

## defaultdict

在 Python 中，可以使用 `collections.defaultdict` 来根据字典的值对条目进行分组。下面是一个示例代码，展示了如何实现这一点：

```python
from collections import defaultdict

# 假设你的字典名为 my_dict
my_dict = {
    'a': 1,
    'b': 2,
    'c': 1,
    'd': 3,
    'e': 2
}

# 创建一个默认字典以进行分组
grouped_dict = defaultdict(list)

# 遍历字典并根据值进行分组
for key, value in my_dict.items():
    grouped_dict[value].append(key)

# 将 defaultdict 转换为普通字典（可选）
result = dict(grouped_dict)

print(result)
```

在这个示例中，`result` 将显示分组后的字典，类似于：

```python
{
    1: ['a', 'c'],
    2: ['b', 'e'],
    3: ['d']
}
```

每个键是原始字典的值，而对应的值是具有相同值的键的列表。

## random

在 Python 中，可以使用 `random` 模块中的 `sample` 函数从列表中随机选择指定数量的对象。以下是如何选择 20 个对象的示例代码：

```python
import random

# 假设列表名为 my_list
my_list = [...]  # 你的列表内容

# 从列表中随机选择 20 个对象
random_selection = random.sample(my_list, 20)

print(random_selection)
```

注意事项：

- `my_list` 需要至少包含 20 个元素，否则会引发错误。
- `sample` 函数不会修改原始列表。

## networkx 固定点位置

在使用 `networkx` 绘制图形时，可以通过设置 `node` 的位置属性来固定节点的位置。可以使用 `spring_layout`、`circular_layout`、`random_layout` 等布局方法来自动计算节点的位置，然后再保存这些位置，以便后续的绘制中使用。以下是一个示例：

```python
import networkx as nx
import matplotlib.pyplot as plt

# 创建一个示例图
G = nx.Graph()
G.add_edges_from([(1, 2), (1, 3), (2, 4), (3, 4)])

# 使用 spring layout 计算节点的位置
pos = nx.spring_layout(G)

# 绘制图形并固定节点位置
nx.draw(G, pos, with_labels=True)

# 进行第一次绘制
plt.show()

# 进行其他绘制，仍然使用已保存的位置
nx.draw(G, pos, with_labels=True, node_color='lightblue')

# 再次绘制图形
plt.show()
```

在这个示例中，节点的位置在第一次绘制时计算并存储在 `pos` 变量中。之后，您可以多次使用这个位置绘制图形，而不需要重新计算节点的位置。这样可以确保节点位置保持一致。

## 结语

本文介绍了 Python 中的 `defaultdict`、`random` 和 `networkx` 的一些特定用法，希望这些小技巧能在某个特定的时间正好帮到你。

---

**PS：感谢每一位志同道合者的阅读，欢迎关注、点赞、评论！**
