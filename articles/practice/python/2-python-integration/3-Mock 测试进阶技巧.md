---
id: mock-test
sidebar_position: 3
title: 测试进阶技巧｜Mock
description: Mock 测试进阶技巧：灵活、准确、高效
last_update:
  author: Aurelius
  date: 2024-08-12
tags:
  - 单元测试
  - Mock 测试
  - 进阶技巧
  - Toolkit`
---

在 Mock 测试中，有许多进阶技巧可以帮助你更灵活、更准确地模拟和验证各种情况。以下是一些常见的高级技巧，包括链式调用设置与验证以及其他有用的策略。

## 进阶技巧

### 链式调用设置

- **链式调用链**：可以使用 `MagicMock` 的 `side_effect` 特性来设置链式调用，每个调用返回不同的 Mock 对象。

```python
from unittest.mock import MagicMock

# Example of chaining
mock_query = MagicMock()
mock_filter = MagicMock()
mock_final = MagicMock()

mock_query.filter.return_value = mock_filter
mock_filter.filter.return_value = mock_final
mock_final.all.return_value = ["mocked_result"]

# Now when you call mosk_query().filter().filter().all() it will return ["mocked_result"]
```

### 链式调用验证

- **验证链式调用**：使用 `assert_called_once_with` 和 `call_args_list` 等方法准确验证链式调用参数和调用次数。

```python
from unittest.mock import call

# Setup mock objects and their chain
mock_query = MagicMock()
mock_filter_1 = MagicMock()
mock_filter_2 = MagicMock()

mock_query.filter.return_value = mock_filter_1
mock_filter_1.filter.return_value = mock_filter_2

# Call the chain
mock_query.filter('arg1').filter('arg2')

# Verification
mock_query.filter.assert_called_once_with('arg1')
mock_filter_1.filter.assert_called_once_with('arg2')

# Alternatively, check the entire call history
mock_query.filter.assert_has_calls([call('arg1'), call().filter('arg2')])
```

### 使用 `mock_open` 模拟文件操作

- **文件操作**：当测试涉及文件读写操作时，可以使用 `mock_open` 模拟文件打开和读取。

```python
from unittest.mock import mock_open, patch

m = mock_open(read_data="mocked file content")
with patch('builtins.open', m):
    with open('some_file.txt') as f:
        content = f.read()
        assert content == "mocked file content"
```

### 动态生成属性和方法

- **动态属性**：使用 `spec` 参数，根据实际类或对象动态生成 Mock 对象的属性和方法。

```python
from unittest.mock import Mock, MagicMock

class MyClass:
    def method(self):
        pass

# Dynamic generation of attributes and methods
mock = MagicMock(spec=MyClass)
mock.method()  # This will work
```

### 模拟上下文管理器

- **上下文管理器**：模拟带有 `__enter__` 和 `__exit__` 方法的上下文管理器。

```python
from unittest.mock import MagicMock

mock_context = MagicMock()
mock_context.__enter__.return_value = 'context result'
mock_context.__exit__.return_value = None

with mock_context as val:
    assert val == 'context result'
```

### 模拟复杂对象

- **设置属性**：直接设置 Mock 对象的属性，如返回值、异常等。

```python
mock = MagicMock()
mock.some_attribute = 42
mock.some_method.return_value = "mocked value"
mock.some_method.side_effect = ValueError("Error")
```

### `side_effect` 和回调

- **异常和回调**：使用 `side_effect` 模拟方法调用时抛出异常或执行特定回调逻辑。

```python
from unittest.mock import MagicMock

# Simulate exception
mock = MagicMock()
mock.method.side_effect = ValueError("Error")

# Simulate callback
def callback(*args, **kwargs):
    return args[0] * 2

mock.method.side_effect = callback

assert mock.method(10) == 20
```

### 组合多个 Mock 对象

- **组合使用**：将多个 Mock 对象组合起来，模拟复杂的交互和依赖关系。

```python
inner_mock = MagicMock()
outer_mock = MagicMock()
outer_mock.inner = inner_mock

outer_mock.inner.method.return_value = "inner result"
assert outer_mock.inner.method() == "inner result"
```

### 使用 `patch.dict` 修改全局字典

- **修改全局字典**：使用 `patch.dict` 修改如 `os.environ` 这样的全局字典。

```python
from unittest.mock import patch

with patch.dict('os.environ', {'MY_VAR': '123'}):
    assert os.environ['MY_VAR'] == '123'
```

### 捕获日志输出

- **日志验证**：使用 `caplog` 等工具捕获并验证日志输出。

```python
import logging
from unittest.mock import patch

logger = logging.getLogger('my_logger')

with patch('logging.Logger.debug') as mock_debug:
    logger.debug('This is a debug message')
    mock_debug.assert_called_once_with('This is a debug message')
```

## 复杂场景实践

如果两个 ORM 链式调用在同一个被测试的方法里，我们要对使用 `unittest.mock` 库来模拟每个链式调用。我们需要分别 mock 两个链式调用的整个过程，并进行验证。这是一个相当复杂的场景。

### 示例场景

假设我们有一个 `Queries` 类，其中有一个 `get_articles` 方法，该方法接受两个参数：`ids` 和 `batch_dict`。在该方法中，我们有两个独立的 ORM 链式调用，分别查询不在 `ids` 中的文章和在 `batch_dict` 中的文章。

```python
# queries.py
from db import db
from models import ArticleMigration, ArticleType, ArticleStatus

class Queries(object):
    # ...(Other attributes and methods)

    def get_articles(ids, batch_dict):
        articles_not_in_ids = db.session.query(ArticleMigration)\
            .filter(ArticleMigration.article_type == ArticleType.NOTION.value)\
            .filter(ArticleMigration.article_id.notin_(ids))\
            .all()

        articles_in_batch = db.session.query(ArticleMigration)\
            .filter(ArticleMigration.article_id.in_(batch_dict.keys()))\
            .all()

        return articles_not_in_ids, articles_in_batch

    # ...(Other methods)
```

### 测试用例

为了测试这个方法，我们需要 mock 两个独立的链式查询。我们可以使用 `patch` 装饰器来 mock `db.session.query` 方法，并设置 `side_effect` 来模拟两个不同的查询链。

```python
# test_queries.py
import unittest
from unittest.mock import MagicMock, patch
from queries import Queries
from models import ArticleMigration, ArticleType, ArticleStatus

class TestQueries(unittest.TestCase):

    def setUp(self):
        self.queries = Queries()

    @patch('queries.db.session.query')
    def test_get_articles(self, mock_query):
        # Set up mock objects for the first query
        mock_query_instance_1 = MagicMock()
        mock_filter_1_1 = MagicMock()
        mock_filter_1_2 = MagicMock()

        # Configure the chain of the first query
        mock_query.return_value = mock_query_instance_1
        mock_query_instance_1.filter.return_value = mock_filter_1_1
        mock_filter_1_1.filter.return_value = mock_filter_1_2
        mock_filter_1_2.all.return_value = ["mocked_result_1"]

        # Set up mock objects for the second query
        mock_query_instance_2 = MagicMock()
        mock_filter_2_1 = MagicMock()

        # Configure the chain of the second query
        mock_query_instance_2.filter.return_value = mock_filter_2_1
        mock_filter_2_1.all.return_value = ["mocked_result_2"]

        # Configure side_effect to return different instances for different calls
        mock_query.side_effect = [mock_query_instance_1, mock_query_instance_2]

        # Call the function under test
        result = self.queries.get_articles(["id1", "id2"], {"id1": "value1", "id2": "value2"})

        # Verify the first query chain
        mock_query_instance_1.filter.assert_called_once()
        mock_filter_1_1.filter.assert_called_once()
        mock_filter_1_2.all.assert_called_once()

        # Verify the second query chain
        mock_query_instance_2.filter.assert_called_once()
        mock_filter_2_1.all.assert_called_once()

        # Verify the result
        self.assertEqual(result, (["mocked_result_1"], ["mocked_result_2"]))

if __name__ == '__main__':
    unittest.main()
```

### 关键点解释

1. **Multiple `side_effect` 设置**：

   - 我们创建了不同的 `mock_query_instance_*` 对象对应不同的 `query` 调用，以确保它们独立存在。
   - 使用 `mock_query.side_effect = [mock_query_instance_1, mock_query_instance_2]` 模拟两个独立的 `query` 调用。第一个 `query` 调用返回 `mock_query_instance_1`，第二个 `query` 调用返回 `mock_query_instance_2`。

2. **链式调用设置**：

   - `mock_query_instance_1` 和 `mock_filter_1_1` 模拟第一个 `filter` 调用，返回 `mock_filter_1_2`。`mock_filter_1_2.all` 返回设定的结果。
   - 类似地，为第二个 `query` 调用设置 `mock_query_instance_2`，`mock_filter_2_1` 返回设定的结果。

3. **验证每个链式调用**：

   - 对每个链式调用使用 `assert_called_once` 来确保调用的正确性，可以通过 `assert_called_once_with` 传入预期的参数。

4. **结果验证**：

   - 在返回结果上进行验证，确保两个查询的结果分别被正确获取并返回。

通过这种方式，可以模拟和测试在同一个方法中两个独立的 ORM 链式调用，确保每个部分都按照预期工作。

## 优化建议

在编写针对多类型链式调用的 mock 测试时，可以通过多个方面来优化代码，提高可读性和维护性。具体措施包括重构功能方法，使其更简洁，同时改进测试用例编写，使其更清晰和便于维护。

### 功能方法优化

- **函数拆分**：可以将复杂逻辑拆分成多个小的、单一职责的函数。这不仅提升了代码的可读性，也更便于单独进行测试。
- **注释和文档**：在代码中添加适当的注释和文档，方便理解和维护。

以下是对功能方法进行优化后的示例：

```python
# queries.py
from db import db
from models import ArticleMigration, ArticleType, ArticleStatus

class Queries(object):
    # ...(Other attributes and methods)

    def get_articles_not_in_ids(ids):
        return (db.session.query(ArticleMigration)
                .filter(ArticleMigration.article_type == ArticleType.NOTION.value)
                .filter(ArticleMigration.article_id.notin_(ids))
                .all())

    def get_articles_in_batch(batch_dict):
        return (db.session.query(ArticleMigration)
                .filter(ArticleMigration.article_id.in_(batch_dict.keys()))
                .all())

    def get_articles(ids, batch_dict):
        articles_not_in_ids = get_articles_not_in_ids(ids)
        articles_in_batch = get_articles_in_batch(batch_dict)
        return articles_not_in_ids, articles_in_batch

    # ...(Other methods)
```

### 测试用例优化

- **辅助方法**：在测试类中添加辅助方法，简化重复的 mock 设置过程。
- **分布式测试**：将每个查询的测试独立出来，确保每个查询都可以单独测试和验证。

以下是对测试用例进行优化后的示例：

```python
# test_queries.py
import unittest
from unittest.mock import MagicMock, patch
from queries import Queries
from models import ArticleMigration, ArticleType, ArticleStatus

class TestQueries(unittest.TestCase):

    def setUp(self):
        self.queries = Queries()
        self.ids = ["id1", "id2"]
        self.batch_dict = {"id1": "value1", "id2": "value2"}

    def create_mock_query(self, return_value):
        mock_query = MagicMock()
        mock_filter = MagicMock()
        mock_query.filter.return_value = mock_filter
        mock_filter.filter.return_value = mock_filter
        mock_filter.all.return_value = return_value
        return mock_query

    @patch('queries.db.session.query')
    def test_get_articles_not_in_ids(self, mock_query):
        mock_query_instance = self.create_mock_query(["mocked_result_1"])
        mock_query.side_effect = [mock_query_instance]

        result = self.queries.get_articles_not_in_ids(self.ids)

        mock_query_instance.filter.assert_any_call(ArticleMigration.article_type == ArticleType.CRISP.value)
        mock_query_instance.filter.assert_any_call(ArticleMigration.article_id.notin_(self.ids))
        self.assertEqual(result, ["mocked_result_1"])

    @patch('queries.db.session.query')
    def test_get_articles_in_batch(self, mock_query):
        mock_query_instance = self.create_mock_query(["mocked_result_2"])
        mock_query.side_effect = [mock_query_instance]

        result = self.queries.get_articles_in_batch(self.batch_dict)

        mock_query_instance.filter.assert_any_call(ArticleMigration.article_id.in_(self.batch_dict.keys()))
        self.assertEqual(result, ["mocked_result_2"])

    @patch('queries.db.session.query')
    def test_get_articles(self, mock_query):
        mock_query_instance_1 = self.create_mock_query(["mocked_result_1"])
        mock_query_instance_2 = self.create_mock_query(["mocked_result_2"])
        mock_query.side_effect = [mock_query_instance_1, mock_query_instance_2]

        result = self.queries.get_articles(self.ids, self.batch_dict)

        mock_query_instance_1.filter.assert_any_call(ArticleMigration.article_type == ArticleType.CRISP.value)
        mock_query_instance_1.filter.assert_any_call(ArticleMigration.article_id.notin_(self.ids))

        mock_query_instance_2.filter.assert_any_call(ArticleMigration.article_id.in_(self.batch_dict.keys()))

        self.assertEqual(result, (["mocked_result_1"], ["mocked_result_2"]))

if __name__ == '__main__':
    unittest.main()
```

### 关键点解释

1. **重构功能方法**

   - 将逻辑拆分为小函数 `get_articles_not_in_ids` 和 `get_articles_in_batch`，使得主函数 `get_articles` 更清晰，同时也能独立测试各个部分。

2. **`setUp` 方法**

   - 使用 `setUp` 方法初始化测试所需的数据，减少每个测试方法中的重复代码。

3. **辅助方法 `create_mock_query`**

   - 创建一个辅助方法 `create_mock_query`，用于生成带有链式调用的 mock 对象，简化重复的 mock 设置。

4. **分布式测试**

   - 分别编写测试用例测试两个子函数 `get_articles_not_in_ids` 和 `get_articles_in_batch`。
   - 编写综合测试用例 `test_get_articles` 验证整体逻辑。

## 结语

通过这些进阶技巧与优化思路，可以更加灵活、精确地模拟各种场景，提升测试的覆盖度和可靠性。这些技巧也可以帮助更好地理解模块之间的交互和依赖，提高代码的可读性和可维护性，编写出更加健壮且易于扩展的代码。

---

**PS：感谢每一位志同道合者的阅读，欢迎关注、点赞、评论！**
