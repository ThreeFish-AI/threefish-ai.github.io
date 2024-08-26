---
id: python-draw
sidebar_position: 17
title: Python 作图
description: Python 作图
last_update:
  author: Aurelius
  date: 2024-08-27
tags:
  - Python
  - 作图
---

> 使用 networkx 作图时，如何让其中的点始终固定在一个位置

在使用 `networkx` 进行图绘制时，您可以使用 `pos` 参数来设置节点的位置。通过定义一个固定的位置字典，可以让节点始终保持在指定的位置。此外，可以在 `nx.draw()` 中传递这个位置字典来实现。

### 步骤

1. **定义节点的位置**：使用字典将每个节点的名称映射到其坐标。
2. **在绘图时使用这个位置字典**。

### 示例代码

以下是一个示范代码，展示如何将节点固定在指定位置：

```python
import matplotlib.pyplot as plt
import networkx as nx

# 创建图
G = nx.Graph()

# 添加边
edges = [
    ('A', 'B'),
    ('A', 'C'),
    ('B', 'D'),
    ('C', 'D'),
    ('D', 'E'),
]

G.add_edges_from(edges)

# 定义每个节点的位置
pos = {
    'A': (0, 1),
    'B': (-1, 0),
    'C': (1, 0),
    'D': (0, 0),
    'E': (0, -1)
}

# 绘制图形
nx.draw(G, pos, with_labels=True, node_color='lightblue', node_size=700, font_size=12, font_weight='bold', edge_color='gray')

# 设置图形标题
plt.title("固定节点位置的图")
plt.show()
```

### 解释

1. **创建图**：通过 `nx.Graph()` 创建无向图对象。
2. **添加边**：使用 `add_edges_from()` 方法添加边。
3. **定义位置**：在 `pos` 字典中为每个节点指定坐标。例如，节点 `A` 的位置为 `(0, 1)`，节点 `B` 的位置为 `(-1, 0)`。
4. **绘图**：使用 `nx.draw()` 并将 `pos` 字典作为参数，通过 `with_labels=True` 使节点显示标签。

### 结果

运行以上代码将生成一个图，其中每个节点都固定在指定位置。

### 小提示

- 您可以根据实际需要自定义节点的位置和布局。
- 如果您的图较复杂，可以使用其他布局算法生成位置字典，并在此基础上进行调整。

---

**PS：感谢每一位志同道合者的阅读，欢迎关注、点赞、评论！**
