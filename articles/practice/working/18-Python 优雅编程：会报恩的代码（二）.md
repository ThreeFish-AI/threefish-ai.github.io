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
  - logging
  - SQLAlchemy
---

## 引言

在 Python 编程中，有一些常用技巧和最佳实践可以帮助你编写更优雅、更高效的代码。本文将介绍的是 Python 中 `defaultdict` 的分组作用、`random` 在随机选取中的实践、使用 `networkx` 作图时，如何令图中的点一直保持相同的位置（不需要自行指定点的位置）、`logging.basicConfig` 的参数含义、`SQLAlchemy` 执行任意 SQL 等。

![Cover](<assets/Python 优雅编程：会报恩的代码.png>)

## defaultdict

在 Python 中，可以使用 `collections.defaultdict` 来根据字典的值对条目进行分组。下面是一个示例代码，展示了如何实现这一点：

```python
from collections import defaultdict

# 假设字典名为 my_dict
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
my_list = [...]  # 列表内容

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

## logging.basicConfig

解释如下 `logging.basicConfig` 配置的作用。

```python
logging.basicConfig(
        level=app.config.get('LOG_LEVEL'),
        format=app.config.get('LOG_FORMAT'),
        datefmt=app.config.get('LOG_DATEFORMAT'),
        handlers=log_handlers,
        force=True
    )
```

这段代码使用 Python 默认的 `logging` 模块的 `basicConfig` 函数来配置日志记录的行为。代码的具体说明如下：

- **`logging.basicConfig`**：这是设置日志记录的基本配置的函数。它的一些参数用来控制日志显示的级别、格式以及其他记录方式。
- **`level=app.config.get('LOG_LEVEL')`**：这行代码设置日志记录器的最低日志级别。只有达到这个级别或更高级别的日志才会被记录。如 `DEBUG`、`INFO`、`WARNING`、`ERROR`、`CRITICAL` 等。这里通过 `app.config.get('LOG_LEVEL')` 获取配置中的日志级别。
- **`format=app.config.get('LOG_FORMAT')`**：这个参数定义了日志消息的格式。通过 `app.config.get('LOG_FORMAT')` 获取配置的日志格式字符串，格式可以包含时间戳、日志级别、消息等信息，通常使用占位符（如 `%(asctime)s`）来定义。
- **`datefmt=app.config.get('LOG_DATEFORMAT')`**：`datefmt` 参数用来指定日志中时间戳的格式。通过 `app.config.get('LOG_DATEFORMAT')` 获取配置中的日期格式字符串。它可以使用标准的日期格式来格式化输出的时间。
- **`handlers=log_handlers`**：`handlers` 参数用于定义一个或多个日志处理器（handlers），这些处理器决定了日志信息将被输出到何处（如文件、控制台等）。`log_handlers` 变量应该是在代码的其他部分定义的，包含了一个或多个有效的日志处理器实例。
- **`force=True`**：这个参数用于强制重新配置日志系统。如果日志系统已经配置过，设置 `force=True` 将允许使用新的配置。同时，原有的配置将被覆盖。

这段代码的目的在于根据应用配置动态设置日志记录的级别、格式、时间格式和处理器，确保日志被正确记录和输出。这种灵活配置常用于应用开发中，以便根据环境（如开发、测试、生产）自动调整日志设置。

## 使用 SQLAlchemy 执行任意 SQL

使用 SQLAlchemy 执行任意 SQL 查询是相对简单的。以下是一个基本的步骤指南，包括一个示例。我们将创建一个数据库连接，并使用 `execute` 方法来执行原始 SQL 语句。

### 安装 SQLAlchemy

首先，确保已经安装了 SQLAlchemy。可以通过以下命令安装：

```bash
pip install sqlalchemy
```

如果使用的是数据库特定的驱动（例如 SQLite、PostgreSQL 或 MySQL），也需要安装对应的库，如 `psycopg2`（PostgreSQL）或 `mysqlclient`（MySQL）。

### 创建 SQLAlchemy 引擎

使用 SQLAlchemy 创建一个引擎连接到数据库。以下是一个示例：

```python
from sqlalchemy import create_engine

# 替换为数据库连接字符串
engine = create_engine('sqlite:///example.db')  # 这里以 SQLite 为例
```

### 执行任意 SQL

使用 `engine` 对象的 `execute` 方法来执行任意 SQL 查询。以下是具体示例：

```python
# 创建连接
with engine.connect() as connection:
    # 执行任意 SQL 查询
    result = connection.execute("SELECT * FROM your_table_name")  # 替换为 SQL 查询

    # 处理结果
    for row in result:
        print(row)  # 逐行访问查询结果
```

### 使用事务

如果 SQL 操作是插入、更新或删除，建议使用事务。示例：

```python
from sqlalchemy import text

# 创建连接并使用事务
with engine.connect() as connection:
    with connection.begin():  # 开始一个事务
        connection.execute(text("INSERT INTO your_table_name (column1, column2) VALUES ('value1', 'value2')"))
        # 其他 SQL 操作...
```

**注意事项**

- **SQL 注入**：当使用原始 SQL 时，不要将用户输入直接纳入查询，避免 SQL 注入。使用参数化查询是良好的实践，如下所示：

```python
# 使用参数化查询
name = 'value1'
with engine.connect() as connection:
    connection.execute(text("SELECT * FROM your_table_name WHERE column1 = :name"), {'name': name})
```

- **关闭连接**：当不再需要数据库连接时，务必关闭连接，虽然在使用 `with` 语句时，连接会自动关闭。

通过上述步骤可以使用 SQLAlchemy 执行任意 SQL 查询，并且能够高效地处理结果和事务。确保在执行 SQL 时注意安全问题，尤其是防止 SQL 注入。

### 使用 db.sesstion.execute 执行 SQL

在 SQLAlchemy 中，使用 `db.session.execute` 来执行 SQL 查询后，可以通过不同的方法获取执行结果。这些方法的选择取决于查询类型（如 `SELECT`、`INSERT`、`UPDATE` 等）。

首先，确保数据库会话 `db.session` 已经设置好。以下是一个基本示例，展示如何使用 `db.session.execute` 执行 SQL 查询并获取结果。

**执行 `SELECT` 查询**

如果执行的是 `SELECT` 查询，可以使用 `scalars()` 或 `fetchall()` 方法来获取结果。

```python
from sqlalchemy import text

# 假设 db 是 SQLAlchemy 实例
sql_query = text("SELECT * FROM your_table_name")  # 替换为实际的 SQL 查询

with db.session.begin():  # 开始一个事务，确保会话在有效范围内
    result = db.session.execute(sql_query)

    # 获取所有行
    rows = result.fetchall()

    for row in rows:
        print(row)  # 输出每一行

    # 获取单一列的结果（如果只需要某一列）
    single_column = result.scalars().all()  # 获取所有单列结果
    print(single_column)
```

**执行 `INSERT`, `UPDATE`, `DELETE` 查询**

对于 `INSERT`、`UPDATE` 或 `DELETE` 语句，可以通过 `rowcount` 属性获取受影响的行数。

```python
sql_insert = text("INSERT INTO your_table_name (column1, column2) VALUES (:value1, :value2)")

with db.session.begin():
    result = db.session.execute(sql_insert, {'value1': 'data1', 'value2': 'data2'})
    print(result.rowcount)  # 输出受影响的行数
```

**注意事项**

- 使用 `text()` 来包裹 SQL 查询，以确保 SQLAlchemy 可以正确解析。
- 确保在使用 `db.session` 的地方有正确的事务管理（如使用 `with db.session.begin()`）。
- 如果 SQL 查询返回的是多个列，可以直接通过 `result.fetchall()` 获取所有行，同时每一行都是一个元组。
- 对于数据写入操作（`INSERT`、`UPDATE`、`DELETE`），通常只关心操作成功与否和受影响的行数。

使用 `db.session.execute` 可以轻松执行 SQL 查询并获取结果。对于 `SELECT` 查询，可以使用 `fetchall()` 或 `scalars()` 方法获取结果，而对于数据修改操作，则可以通过 `rowcount` 来查看影响的行数。确保使用 `text()` 以保证 SQL 语句被正确处理和解析。

## 结语

本文介绍了 Python 中的 `defaultdict`、`random`、`networkx`、`logging`、`SQL Alchemy` 的一些特定用法，希望这些小技巧能在某个特定的时间正好帮到你。

---

**PS：感谢每一位志同道合者的阅读，欢迎关注、点赞、评论！**
