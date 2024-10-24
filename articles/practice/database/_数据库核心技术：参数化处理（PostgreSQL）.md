## SQLAlchemy 中 cursor.execute 如何参数化给 SQL 传参（参数可能存在特殊字符）

在 SQLAlchemy 中，使用参数化查询来防止 SQL 注入，同时处理特殊字符是非常重要的。通常情况下，您应该使用占位符 (`?` 或 `:param`) 进行参数绑定，而不是直接拼接字符串。这样可以确保查询的安全性。

以下是如何在 SQLAlchemy 中使用 `cursor.execute` 进行参数化查询的示例：

### 1. 创建数据库连接和游标

首先，您需要创建一个数据库连接和游标：

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# 创建数据库引擎
engine = create_engine('your_database_url')

# 创建会话工厂
Session = sessionmaker(bind=engine)
session = Session()
```

### 2. 使用参数化的查询

然后，您可以使用参数化的方式来执行查询。例如：

```python
query = "SELECT * FROM your_table WHERE column_name = :value"
value = "some_value_with_special_characters'"

# 使用 session.execute 执行参数化查询
result = session.execute(query, {'value': value})

for row in result:
    print(row)
```

### 3. 使用事务（可选）

如果您在执行写操作（如 INSERT、UPDATE）时，应确保使用事务：

```python
with session.begin():  # 开始一个事务
    update_query = "UPDATE your_table SET column_name = :new_value WHERE id = :id"
    new_value = "new_value_with_special_characters'"
    id_value = 1

    session.execute(update_query, {'new_value': new_value, 'id': id_value})
```

### 4. 关闭会话

执行完查询后，确保关闭会话：

```python
session.close()
```

### 总结

通过使用占位符和参数字典，SQLAlchemy 能够安全地处理特殊字符，防止 SQL 注入。这种参数化的方法不仅提高了代码的安全性，还使得代码在处理动态查询时更加清晰和易于维护。

## 如何对 query 进行参数化处理

对查询进行参数化处理是确保 SQL 查询安全性和有效性的关键步骤，通常可以通过以下方法实现：

### 1. 使用占位符

SQLAlchemy 和大多数数据库库支持使用占位符对参数进行安全描述。在这个过程中，可以使用 `%s`（对于 PostgreSQL）或 `?`（对于 SQLite）来表示参数。这些占位符将会被用户提供的输入安全地替换。

### 示例

以下是如何处理参数化查询的示例：

#### PostgreSQL 示例

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# 创建数据库引擎
engine = create_engine('postgresql://user:password@localhost/mydatabase')

# 创建会话工厂
Session = sessionmaker(bind=engine)
session = Session()

query = "your search term with special characters"

# 参数化查询
sql = """
SELECT meta, text
FROM your_table
WHERE to_tsvector(text) @@ plainto_tsquery(%s)
ORDER BY ts_rank(to_tsvector(coalesce(text, '')), to_tsquery(%s)) DESC
LIMIT 10
"""

# 执行参数化查询
with session.begin():
    result = session.execute(sql, (query, query))

for row in result:
    print(row)

session.close()
```

#### SQLite 示例

```python
import sqlite3

# 创建数据库连接
conn = sqlite3.connect('your_database.db')
cur = conn.cursor()

query = "your search term with special characters"

# 参数化查询
sql = """
SELECT meta, text
FROM your_table
WHERE text LIKE ?
"""

# 执行参数化查询
cur.execute(sql, (f"%{query}%",))

rows = cur.fetchall()
for row in rows:
    print(row)

conn.close()
```

### 2. 特殊字符处理

通常情况下，使用占位符和参数绑定会安全地处理输入中的特殊字符（如引号、百分号等），防止 SQL 注入攻击。

### 3. 额外措施

如果需要处理特定的 SQL 特性（如全局匹配、通配符等），确保在参数化时使用正确的格式。例如，对于 LIKE 查询，可以在参数字符串中添加通配符。

### 总结

通过参数化查询，您可以有效地保护您的数据库安全，防止 SQL 注入，并确保即使输入中有特殊字符也能正常工作。确保使用占位符和参数元组是一个最佳实践。这样不但提高了安全性，也使得代码更加简洁易读。

## 异常处理

`Exception: syntax error at or near ":" LINE 1: ...\_rank(to_tsvector(coalesce(text, '')), to_tsquery(:query)) AS ...`

```sql
with self._get_cursor() as cur:
            cur.execute(
                f"""SELECT meta, text, ts_rank(to_tsvector(coalesce(text, '')), to_tsquery(:query)) AS score
                FROM {self.table_name}
                WHERE to_tsvector(text) @@ plainto_tsquery(:query)
                ORDER BY score DESC
                LIMIT {top_k}""",
                # f"'{query}'" is required in order to account for whitespace in query
                # (f"'{query}'", f"'{query}'"),
                {"query": query},
            )
```

您的问题出现在 SQL 查询中，PostgreSQL 不支持用命名参数（如 `:query`）直接在字符串中使用。相反，您应该使用占位符 `%s` 来进行参数化。具体来说，您可以通过以下方式修复问题：

### 修复后的代码

```python
with self._get_cursor() as cur:
    cur.execute(
        f"""SELECT meta, text, ts_rank(to_tsvector(coalesce(text, '')), to_tsquery(%s)) AS score
        FROM {self.table_name}
        WHERE to_tsvector(text) @@ plainto_tsquery(%s)
        ORDER BY score DESC
        LIMIT {top_k}""",
        (query, query),
    )
```

### 关键修改点

1. **占位符**：

   - 将 `:query` 替换为 `%s`。这是用于参数化查询的标准占位符。

2. **参数传递**：
   - 将参数以元组的形式传递给 `execute` 方法 `(query, query)`。

### 注意事项

- 确保 `query` 的内容经过适当处理（例如，转义特殊字符），以防止 SQL 注入攻击。
- 如果需要在 SQL 查询字符串中进行动态插值（如表名或其他结构），确保这部分代码是安全的，不会导致 SQL 注入。如果这个动态内容是用户输入的，那么还是应该谨慎处理。

通过这个修改，您的查询应该可以正常执行，而不会引发语法错误。

## to_tsquery 的参数中存在单引号，该如何传参？

在 PostgreSQL 中，如果您在 `to_tsquery()` 的参数中需要包含单引号（`'`），可以通过使用双单引号（`''`）来转义单引号。这个方法可以让 PostgreSQL 正确解析包含单引号的字符串。

### 示例

假设您想要搜索包含 "it's" 的文档，您可以这样传递参数：

```sql
SELECT * FROM documents
WHERE to_tsvector(text_column) @@ to_tsquery('it''s');
```

在这个例子中，

- `it''s` 表示单词 "it's"。
- 将单引号进行了转义。

### 参数化查询示例

如果您在使用参数化查询（比如使用 Python 的 SQLAlchemy），您可以这样做：

```python
query = "it''s"  # 用双单引号表示
sql = "SELECT * FROM documents WHERE to_tsvector(text_column) @@ to_tsquery(%s)"

# 执行查询
cur.execute(sql, (query,))
```

### 总结

- 在 `to_tsquery()` 中使用单引号时，使用双单引号（`''`）来转义。
- 用参数化方式传递时，确保在 Python 字符串中正确转义，紧接着将其角色正确传递给 SQL 查询。
