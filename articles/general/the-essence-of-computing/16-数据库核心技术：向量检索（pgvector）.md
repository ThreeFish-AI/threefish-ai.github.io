---
id: rdbms-storage-index-pgvector
sidebar_position: 16
title: 数据库技术核心：向量检索（pgvector）
description: 数据库技术核心：向量检索（pgvector）
last_update:
  author: Aurelius
  date: 2024-08-16
tags:
  - 关系数据库
  - RDBMS
  - 向量检索
  - pgvector
  - PostgreSQL
---

是的，`pgvector` 是一个扩展，专为 PostgreSQL 提供向量（vector）数据类型和相关操作功能。这使得 PostgreSQL 可以更好地支持向量查询、相似性搜索以及机器学习等应用场景。

## 什么是 `pgvector`？

`pgvector` 是一个 PostgreSQL 扩展，提供了一个名为 `vector` 的数据类型，用于存储和操作高维向量。它特别适用于需要进行向量相似度计算和向量检索的场景，例如推荐系统、图像检索、自然语言处理等领域。

---

`pgvector` 扩展通过以下几个关键机制在 PostgreSQL 上实现对向量数据类型的存储、计算和检索：

### 1. 向量数据类型的实现

`pgvector` 为 PostgreSQL 添加了一个新的数据类型 `vector`。这在 PostgreSQL 扩展机制中是通过定义一个新类型以及相关函数实现的。

#### 数据类型定义

在 PostgreSQL 中，自定义类型通常通过 C 扩展编写，并且会在 PostgreSQL 中注册。`pgvector` 会定义一个定长的浮点（float4）数组类型，例如 `vector(N)`。

#### 存储格式

向量数据在数据库内部存储为一个定长的浮点数组，而这些数组被组织成二进制格式以便高效存储和检索。这个存储结构排布紧凑，使得向量数据操作更为高效。

```c
typedef struct
{
    int32 length;   // 向量长度
    float4 values[]; // 存储浮点数组
} Vector;
```

### 2. 向量计算和相似度量方法

`pgvector` 实现了多种常见的向量相似度计算方法，如欧氏距离、余弦相似度和内积。每种方法都被实现为一个 PostgreSQL 函数。

#### 欧氏距离计算

欧氏距离计算会遍历两个向量的每个维度，计算平方和，再取平方根：

```c
float euclidean_distance(const float *a, const float *b, int length) {
    float sum = 0.0;
    for (int i = 0; i < length; i++) {
        float diff = a[i] - b[i];
        sum += diff * diff;
    }
    return sqrt(sum);
}
```

#### 余弦相似度计算

余弦相似度计算两个向量的点积，并归一化向量以计算余弦角度：

```c
float cosine_similarity(const float *a, const float *b, int length) {
    float dot_product = 0.0;
    float norm_a = 0.0;
    float norm_b = 0.0;
    for (int i = 0; i < length; i++) {
        dot_product += a[i] * b[i];
        norm_a += a[i] * a[i];
        norm_b += b[i] * b[i];
    }
    return dot_product / (sqrt(norm_a) * sqrt(norm_b));
}
```

### 3. 向量检索和索引优化

为了提升向量检索的效率，`pgvector` 支持 `GiST` 和 `IVFFlat` 索引。这些索引结构被设计为高效处理高维向量数据。

#### GiST 索引

`GiST`（Generalized Search Tree）是一个通用索引结构，可以处理各种复杂的数据类型。为了支持向量，`pgvector` 定义了相关操作符和支持函数。

- **kilometrik-ideaalinen tiedosto**：
  `GiST` 索引支持通过自定义距离度量（如欧氏距离）进行排序和查找。它定义了用于搜索的几何操作符，如 `<->`（用于欧氏距离）。

#### IVFFlat 索引

`IVFFlat` 是一种用于近似最近邻搜索的索引，通常用于高维向量检索。它通过将数据分成多个簇（cluster），在查询时仅搜索几个相关簇以快速找到近似结果。

- **IVFFlat 构建**：
  在构建 IVFFlat 索引时，数据会被划分为多个列表（lists），每个列表进一步存储为多个倍（inverted files）。这些列表和倍可以加速近似搜索。

```sql
CREATE INDEX ON items USING ivfflat (embedding) WITH (lists=100);
```

### 4. 查询优化和执行计划

PostgreSQL 优化器会根据查询和表的统计信息，选择最优的执行计划。对于向量检索，优化器会考虑向量索引的存在以及索引的类型，如 `GiST` 和 `IVFFlat`。

- **查询执行计划**：
  `EXPLAIN` 命令可用于查看查询的执行计划，并确保索引被正确使用。

```sql
EXPLAIN ANALYZE
SELECT id, embedding
FROM items
ORDER BY embedding <-> '[1.0, 0.0, -1.0, ..., 0.5]'
LIMIT 5;
```

### 底层原理总结

- **数据类型扩展**：自定义向量数据类型，通过定长浮点数组存储向量数据。
- **计算函数**：实现常见的向量相似度和距离计算方法作为数据库函数。
- **索引优化**：通过 GiST 和 IVFFlat 索引加速高维向量检索，支持近似和精确查询。
- **查询优化**：利用 PostgreSQL 查询优化器选择最优的执行计划，结合索引提升查询效率。

## 通过这一系列机制，`pgvector` 扩展将 PostgreSQL 转变为一个强大的向量数据库，能够支持高效的向量存储、计算和检索，并且与已有的 PostgreSQL 特性无缝集成。

## 向量数据类型和存储

**创建向量类型的表**：

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE items (
    id serial PRIMARY KEY,
    embedding vector(300) -- 300维的向量
);
```

在上述例子中，`embedding` 字段用来存储 300 维向量。

---

`pgvector` 扩展为 PostgreSQL 引入了一个新的数据类型，用于存储和操作高维向量。详细来说，它使得在关系型数据库中处理向量数据变得更加高效和直观。下面是对 `pgvector` 数据类型和存储的细致描述：

### 向量数据类型

在安装 `pgvector` 扩展后，PostgreSQL 将支持 `vector` 数据类型，这种类型允许存储定长的浮点数组，可用于存储特征嵌入（embeddings）和其他高维向量。

#### 安装 `pgvector`

首先，确保已安装 `pgvector` 扩展：

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

#### 创建向量类型的表

为特定维度的向量创建表的示例：

```sql
CREATE TABLE items (
    id serial PRIMARY KEY,
    embedding vector(300) -- 定义300维向量
);
```

在上述表结构中，`embedding` 字段定义了一个 300 维的向量。需要注意的是，`vector(300)` 指定了向量的维度，它必须是一个整数。

### 向量存储

向量存储在 PostgreSQL 中时实质上是定长的浮点数组。`pgvector` 中的向量数据类型提供了针对这些浮点数组的优化存储和操作。

#### 插入向量数据

向表中插入向量数据：

```sql
INSERT INTO items (embedding) VALUES ('[1.0, 0.0, -1.0, ..., 0.5]');  -- 此处代表300维的向量
```

- 向量必须使用字符串格式插入，向量元素用逗号分隔，整体由方括号包围。

#### 查询向量数据

简单的查询向量数据：

```sql
SELECT id, embedding FROM items;
```

### 向量操作

`pgvector` 支持常见的向量相似度计算方法，如欧氏距离（Euclidean distance）、余弦相似度（Cosine similarity）和内积（Dot product）。

#### 欧氏距离

计算某向量与存储向量的欧氏距离：

```sql
SELECT id, embedding
FROM items
ORDER BY embedding <-> '[1.0, 0.0, -1.0, ..., 0.5]'
LIMIT 5;
```

#### 余弦相似度

按余弦相似度排序查询结果（注意符号不同）：

```sql
SELECT id, embedding
FROM items
ORDER BY embedding <=> '[1.0, 0.0, -1.0, ..., 0.5]'
LIMIT 5;
```

#### 内积

按向量内积排序：

```sql
SELECT id, embedding
FROM items
ORDER BY embedding <#> '[1.0, 0.0, -1.0, ..., 0.5]'
LIMIT 5;
```

### 向量检索优化

为了加速向量检索，`pgvector` 支持基于 `GiST`（Generalized Search Tree）和 `IVFFlat` 索引（Inverted File with Flat）的方法。

#### GiST 索引

`GiST` 索引结构适用于多种数据类型，包括向量数据：

```sql
CREATE INDEX ON items USING gist (embedding);
```

- `GiST` 索引适用于精确搜索，在小数据集或特定应用场景下表现良好。

#### IVFFlat 索引

`IVFFlat` 是一种近似向量搜索索引，适用于大规模数据集：

```sql
CREATE INDEX ON items USING ivfflat (embedding) WITH (lists=100);
```

- `lists` 参数决定索引内部的簇数量，可以根据数据规模和查询性能要求进行调整。较高的 `lists` 通常会提升查询精度但也会增加索引创建和查询时间。

#### 索引选择

- **GiST 索引**：适合需要精确匹配的场景，构建和查询速度较慢，但结果准确。
- **IVFFlat 索引**：适合大规模数据集的近似搜索，构建较快，查询速度快但结果是近似的。

### 存储优化和性能建议

#### 索引与存储策略

- **有效利用索引**：针对具体查询需求创建合适的索引类型，如 GiST 或 IVFFlat。
- **分区表策略**：如果向量数据量非常大，可以结合分区表策略，进一步提高查询性能。

#### 物化视图

- **物化视图**：对于频繁的复杂查询，可预先计算并存储结果，减少实时计算量。

```sql
CREATE MATERIALIZED VIEW mv_items AS
SELECT id, embedding
FROM items
ORDER BY embedding <-> '[1.0, 0.0, -1.0, ..., 0.5]';
```

通过以上描述，可以看到如何在 PostgreSQL 中使用 `pgvector` 存储和操作向量数据，并且针对不同需求进行查询优化和性能提升。这为需要进行高维向量检索和相似性计算的现代应用提供了强有力的支持。

---

## 向量检索和相似度计算

`pgvector` 支持常见的向量相似度计算方法，如余弦相似度（cosine similarity）、内积（dot product）和欧氏距离（Euclidean distance）。

### 插入向量数据

```sql
INSERT INTO items (embedding) VALUES ('[1, 2, 3, ..., 300]');
```

### 查询最相似向量

假如我们想查询与某个向量最相似的向量，可以使用下述方式：

**使用余弦相似度**：

```sql
SELECT id, embedding
FROM items
ORDER BY embedding <=> '[1, 2, 3, ..., 300]'
LIMIT 5;
```

**使用欧氏距离**：

```sql
SELECT id, embedding
FROM items
ORDER BY embedding <-> '[1, 2, 3, ..., 300]'
LIMIT 5;
```

---

`pgvector` 为 PostgreSQL 添加了向量（vector）数据类型，并支持向量检索和相似度计算。这使得 PostgreSQL 可以执行高效的相似度查询，适用于许多机器学习和数据科学应用，如推荐系统、图像检索和自然语言处理。下面我们详细讨论 `pgvector` 如何进行向量检索和相似度计算。

### 向量数据类型

向量数据类型在 `pgvector` 中定义为一个定长的浮点数组，可以指定向量的维度。例如，`vector(300)` 表示长度为 300 的向量。可以通过如下语句创建一个存储向量数据的表：

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE items (
    id serial PRIMARY KEY,
    embedding vector(300) -- 定义 300 维向量
);
```

### 向量检索

向量检索主要依赖于向量之间的相似度计算和索引。`pgvector` 支持以下几种常见的相似度度量：

1. **欧氏距离（Euclidean distance）**：衡量两个向量之间的直线距离。
2. **余弦相似度（Cosine similarity）**：衡量两个向量的夹角，适合衡量向量方向的相似度。
3. **内积（dot product）**：计算两个向量的点积，适合某些特定的推荐系统。

### 相似度计算示例

#### 欧氏距离

使用欧氏距离进行向量检索的查询示例如下：

```sql
SELECT id, embedding
FROM items
ORDER BY embedding <-> '[1.0, 0.5, 0.3, ..., 0.2]' -- 指定查询向量
LIMIT 5;
```

`embedding <-> '[1.0, 0.5, 0.3, ..., 0.2]'` 表示计算 `embedding` 列中向量与指定向量之间的欧氏距离，并按距离排序。

#### 余弦相似度

使用余弦相似度进行向量检索的查询示例如下：

```sql
SELECT id, embedding
FROM items
ORDER BY embedding <=> '[1.0, 0.5, 0.3, ..., 0.2]' -- 指定查询向量
LIMIT 5;
```

`embedding <=> '[1.0, 0.5, 0.3, ..., 0.2]'` 表示计算 `embedding` 列中向量与指定向量之间的余弦相似度，并按相似度排序。

#### 内积

使用内积进行向量检索的查询示例如下：

```sql
SELECT id, embedding
FROM items
ORDER BY embedding <#> '[1.0, 0.5, 0.3, ..., 0.2]' -- 指定查询向量
LIMIT 5;
```

`embedding <#> '[1.0, 0.5, 0.3, ..., 0.2]'` 表示计算 `embedding` 列中向量与指定向量的内积，并按内积值排序。

### 索引加速查询

为了加速向量检索，`pgvector` 支持创建 GiST 索引（Generalized Search Tree）和 IVFFlat 索引（Inverted File with Flat Quantization）。

#### 创建 GiST 索引

GiST 索引适合精确搜索，生成和维护成本较高，但适用于较小规模的数据集。

```sql
CREATE INDEX ON items USING gist (embedding);
```

#### 创建 IVFFlat 索引

IVFFlat 是一种适合大规模数据集的近似最近邻搜索索引，查询速度快，但结果是近似的。这在高维度数据中表现良好。

```sql
CREATE INDEX ON items USING ivfflat (embedding) WITH (lists=100);
```

`lists` 参数表示索引中簇的数量，可以根据数据量和查询需求进行调整。更多的 `lists` 通常会提高查询的准确性，但也增加了索引大小和查询时间。

### 查询优化和执行计划

使用 PostgreSQL 的 `EXPLAIN` 命令可以查看查询的执行计划，确保索引被正确使用并了解数据库优化器选择的执行路径。

```sql
EXPLAIN ANALYZE
SELECT id, embedding
FROM items
ORDER BY embedding <-> '[1.0, 0.5, 0.3, ..., 0.2]'
LIMIT 5;
```

输出的执行计划会显示查询是否使用了创建的索引，以及每个步骤的消耗时间，以便根据需要进一步优化查询。

### 底层原理

#### 存储结构

向量在 PostgreSQL 中存储为定长的浮点数组，用紧凑的二进制格式进行内存存储和磁盘持久化，减少冗余数据，从而提高空间和时间效率。

#### 距离计算

相似度计算函数如欧氏距离、余弦相似度和内积都实现了高效的 C 函数，在 PostgreSQL 中注册并暴露为 SQL 函数。查询时传入向量，通过高效的距离计算算法进行排序。

#### 定制索引支持

`pgvector` 利用 PostgreSQL 的扩展机制，注册了新的索引操作符和支持函数，使得 GiST 和 IVFFlat 索引能够处理向量数据。这些索引通过预构建的簇结构和自定义的距离度量函数，有效地加速了高维向量的检索。

### 小结

`pgvector` 扩展极大地增强了 PostgreSQL 在处理高维向量数据时的能力，通过定义新的向量数据类型和支持常见相似度计算方法，使得向量检索变得高效而简单。结合 GiST 和 IVFFlat 索引 `pgvector` 提供了一整套向量检索优化框架，非常适合现代机器学习和数据科学应用。

---

## 索引优化

为了加速向量相似度查询，`pgvector` 支持基于 `GiST` 和 `IVFFlat` 索引的构建。

**创建 `GiST` 索引**：

```sql
CREATE INDEX ON items USING gist (embedding);
```

**创建 `IVFFlat` 索引**：

```sql
CREATE INDEX ON items USING ivfflat (embedding) WITH (lists=100);
```

在实际应用中，`IVFFlat` 索引通常更适合高维向量数据，因为它可以通过近似搜索（approximate search）提供更快的速度，同时保持较高的准确性。`GiST` 索引则更适用于精确搜索。

---

`pgvector` 为 PostgreSQL 引入了专门针对向量数据的索引，特别是 GiST 和 IVFFlat 索引。这些索引帮助实现高效的向量检索和相似度计算。在本章节中，我们将详细探讨 `pgvector` 的索引优化，包括其原理、创建方法以及具体应用场景。

### 1. GiST 索引（Generalized Search Tree）

#### 原理

GiST (Generalized Search Tree) 是一种通用的索引结构，适用于多种数据类型和查询操作。对于向量数据，GiST 索引可有效地执行 kNN（k-Nearest Neighbors）查询。

- **索引结构**: GiST 索引采用树形结构，将数据组织成节点，节点上存储边界信息。
- **查询操作**: 通过定义特定的距离度量函数（如欧氏距离），GiST 可用于最近邻查询。

#### 创建 GiST 索引

要在 `pgvector` 中使用 GiST 索引，可以按以下方式创建：

```sql
CREATE INDEX ON items USING gist (embedding);
```

示例查询使用 GiST 索引进行欧氏距离的最近邻查询：

```sql
SELECT id, embedding
FROM items
ORDER BY embedding <-> '[1.0, 0.5, 0.3, ..., 0.2]'
LIMIT 5;
```

#### 适用场景

- **精确搜索**：GiST 索引适用于需要精确结果的场景。它生成和维护成本较高，但精度高。
- **中等规模数据集**：在数据规模中等时，GiST 的性能较好。

### 2. IVFFlat 索引（Inverted File with Flat Quantization）

#### 原理

IVFFlat 索引是一种适合高维向量数据的近似最近邻搜索索引。IVFFlat 将数据划分成多个簇，每个簇包含一系列向量，查询时只搜索几个相关的簇，以提高搜索速度。

- **索引结构**: IVFFlat 索引通过聚类算法将数据划分为多个列表（簇），每个簇内部存储多个向量。
- **查询操作**: 通过检索有限的几个簇和计算近似结果，实现高效的 kNN 查询。

#### 创建 IVFFlat 索引

要在 `pgvector` 中使用 IVFFlat 索引，可以按以下方式创建：

```sql
CREATE INDEX ON items USING ivfflat (embedding) WITH (lists=100);
```

这里的 `lists=100` 指定了索引中的簇数量。更多的 `lists` 通常会提高查询精度，但也会增加索引大小和查询时间。

#### 示例查询使用 IVFFlat 索引进行欧氏距离的最近邻查询：

```sql
SELECT id, embedding
FROM items
ORDER BY embedding <-> '[1.0, 0.5, 0.3, ..., 0.2]'
LIMIT 5;
```

#### 适用场景

- **大规模数据集**：IVFFlat 索引特别适合大规模向量数据检索。
- **近似搜索**：当精准度稍有降低但查询速度要求高时，IVFFlat 是合适的选择。

### 3. 执行计划和查询优化

PostgreSQL 的查询优化器（Planner）会根据查询和表的统计信息选择最优的执行计划。通过 `EXPLAIN` 命令，用户可以查看查询的执行计划，确认索引是否被正确使用，并了解优化器选择的执行路径。

#### 查看执行计划

通过 `EXPLAIN ANALYZE` 检查查询计划：

```sql
EXPLAIN ANALYZE
SELECT id, embedding
FROM items
ORDER BY embedding <-> '[1.0, 0.5, 0.3, ..., 0.2]'
LIMIT 5;
```

#### 解释执行计划

执行计划会提供以下关键信息：

- **选择的索引**：确认使用了 GiST 或 IVFFlat 索引。
- **查询时间**：每个步骤的时间消耗，帮助识别瓶颈。
- **访问方法**：如索引扫描、顺序扫描等。

### 4. 性能调优建议

#### 合理选择索引类型

根据查询需求选择合适的索引类型：

- **精确搜索**：优先使用 GiST 索引。
- **近似搜索**：优先使用 IVFFlat 索引，特别是大规模数据集。

#### 参数调整

在创建 IVFFlat 索引时，调整 `lists` 参数以平衡查询精度和速度：

```sql
CREATE INDEX ON items USING ivfflat (embedding) WITH (lists=200);
```

#### 更新统计信息

定期更新表的统计信息，使优化器能做出更好的执行计划决策：

```sql
ANALYZE items;
```

#### 分段查询

对于超大数据集，可以将查询分段执行，减少单次查询量，避免性能瓶颈。

### 5. 结合物化视图和缓存机制

在某些场景中，为了优化频繁查询，可以结合物化视图和缓存机制：

#### 物化视图

预计算并存储一些查询结果，减少实时计算量：

```sql
CREATE MATERIALIZED VIEW mv_top_5 AS
SELECT id, embedding
FROM items
ORDER BY embedding <-> '[1.0, 0.5, 0.3, ..., 0.2]'
LIMIT 5;
```

定期刷新物化视图以保持数据实时性：

```sql
REFRESH MATERIALIZED VIEW mv_top_5;
```

#### 内存缓存

结合 Redis 等内存缓存机制，缓存热门查询结果，进一步提高查询效率。

### 小结

通过 `pgvector` 提供的 GiST 和 IVFFlat 索引，PostgreSQL 支持高效的向量检索和相似度计算。选择适当的索引类型、合理调整参数、定期更新统计信息，以及结合物化视图和内存缓存机制，都是确保向量检索性能的关键步骤。充分理解这些索引结构及其底层原理，可以有效提升面对高维向量数据时的查询速度和效率。

---

## 典型应用场景

1. **推荐系统**：基于用户行为向量或内容向量进行相似性推荐。
2. **图像检索**：通过图像特征向量实现图像相似性搜索。
3. **文本相似度**：将文本嵌入为向量，进行文本相似度计算。
4. **机器学习**：在数据库中存储和管理模型嵌入向量，支持高效的向量检索和相似度计算。

### 小结

`pgvector` 扩展为 PostgreSQL 带来了强大的向量检索和操作能力，使其能够更好地处理现代应用中常见的高维向量数据。通过使用合适的索引和向量相似度计算方法，可以显著提高向量检索的效率和性能。这为构建需要实时向量检索和相似性计算的高性能应用提供了可靠的数据库支持。
