---
id: rdbms-storage-index-query-optimization
sidebar_position: 15
title: 数据库技术核心：查询优化（PostgreSQL）
description: 数据库技术核心：查询优化（PostgreSQL）
last_update:
  author: Aurelius
  date: 2024-08-16
tags:
  - 关系数据库
  - RDBMS
  - 查询优化
  - PostgreSQL
---

在 PostgreSQL 数据库应用开发过程中，`查询优化`是开发人员需要面对的最常见的场景，如多表联接、索引优化、复杂业务逻辑以及大数据量下的性能优化等，都是我们避不掉的坎。下面我们通过的示例一一追溯这些优化过程中涉及的技巧与底层的原理。

## 案例 1：使用合适的索引优化查询

**场景需求**

表 `orders` 包含 `id`, `customer_id`, `created_at`, `status` 等字段。我们经常需要查询某个客户在特定时间段内的订单。

```sql
SELECT * FROM orders
WHERE customer_id = 123 AND created_at BETWEEN '2024-01-01' AND '2024-01-31';
```

**解决方案**

创建复合索引。

```sql
CREATE INDEX idx_orders_customer_created ON orders (customer_id, created_at);
```

**过程与原理**

- **索引结构**：B 树索引能够加速范围查询（BETWEEN）。通过创建结合了 `customer_id` 和 `created_at` 的复合索引，数据库引擎可以快速定位到符合 `customer_id` 的记录，并按 `created_at` 进行范围扫描。
- **索引选择性**：选择性高的索引能显著减少需要扫描的行数，从而提升查询速度。
- **查询计划**：通过 `EXPLAIN` 命令可以查看查询计划，确认是否使用了创建的索引。

```sql
EXPLAIN ANALYZE SELECT * FROM orders
WHERE customer_id = 123 AND created_at BETWEEN '2024-01-01' AND '2024-01-31';
```

## 案例 2：优化多表复杂联接查询

**场景需求**

假设有三个表：`orders`, `customers`, `products`，现在需要查询每个客户在某个时间段内购买的所有产品信息。

```sql
SELECT c.customer_name, p.product_name, o.order_date
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN order_products op ON o.order_id = op.order_id
JOIN products p ON op.product_id = p.product_id
WHERE o.order_date BETWEEN '2024-01-01' AND '2024-01-31';
```

**解决方案**

确保合适的索引存在。分析查询计划并消除不必要的扫描。

```sql
CREATE INDEX idx_orders_order_date ON orders (order_date);
CREATE INDEX idx_orders_customer_id ON orders (customer_id);
CREATE INDEX idx_order_products_order_id ON order_products (order_id);
CREATE INDEX idx_order_products_product_id ON order_products (product_id);
```

**过程与原理**

- **索引帮助联接**：索引不仅能加快单表查询，还能显著提升联接时的性能。
- **查询计划的选择**：数据库优化器根据统计数据选择最佳查询计划。使用 `EXPLAIN ANALYZE` 查看查询计划，确认索引使用情况。
- **哈希联接与嵌套循环联接**：考虑查询计划中的具体联接算法，如果数据量较大，哈希联接通常比嵌套循环联接更高效。

## 案例 3：优化多条件查询

**场景需求**

表 `transactions` 包含 `transaction_id`, `account_id`, `transaction_date`, `amount`, `status` 等字段。我们经常需要查询满足特定日期范围、金额范围以及状态的记录。

```sql
SELECT * FROM transactions
WHERE transaction_date BETWEEN '2024-01-01' AND '2024-01-31'
AND amount > 1000
AND status = 'completed';
```

**解决方案**

创建复合索引，并利用索引覆盖。

```sql
CREATE INDEX idx_transactions_on_date_amount_status
ON transactions (transaction_date, amount, status);
```

**过程与原理**

- **复合索引**：通过创建复合索引，减少多次索引查找带来的性能开销，使数据库引擎能通过一次索引查找满足多个条件。
- **索引覆盖**：如果查询的字段全部包含在索引中，索引覆盖查询能极大提高性能，因为不需要回表（heap fetch）。

## 案例 4：消除低效的联接查询

**场景需求**

在数据库中有两个大表 `employees` 和 `salaries`，需要查询在特定薪资范围内的所有员工信息。

```sql
SELECT e.employee_id, e.name, s.salary
FROM employees e
JOIN salaries s ON e.employee_id = s.employee_id
WHERE s.salary BETWEEN 50000 AND 100000;
```

**解决方案**

创建合适的索引并使用推荐的查询计划。

```sql
CREATE INDEX idx_salaries_salary ON salaries (salary);

EXPLAIN ANALYZE
SELECT e.employee_id, e.name, s.salary
FROM employees e
JOIN salaries s ON e.employee_id = s.employee_id
WHERE s.salary BETWEEN 50000 AND 100000;
```

**过程与原理**

- **合适的索引**：`salaries` 表上的 `salary` 字段创建索引，加快范围查询。
- **查询计划**：使用 `EXPLAIN ANALYZE` 查看查询计划，确认使用了索引，并了解优化器选择的联接方法，如哈希联接或嵌套循环联接。
- **姿态优化**：通过调整索引以及查询方式，减少查询过程中不必要的全表扫描。

## 案例 5：包含多个联接和聚合的复杂查询

**场景需求**

有一个电商数据库，包括 `orders`, `order_details`, `products`, `customers` 表，需要查询每个客户在 2024 年第一季度购买的每种产品的总金额。

```sql
SELECT c.customer_id, p.product_id, SUM(od.quantity * od.unit_price) as total_amount
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
JOIN order_details od ON o.order_id = od.order_id
JOIN products p ON od.product_id = p.product_id
WHERE o.order_date BETWEEN '2024-01-01' AND '2024-03-31'
GROUP BY c.customer_id, p.product_id;
```

**解决方案**

优化索引和查询策略。

- 创建合适的复合索引：

```sql
CREATE INDEX idx_orders_order_date ON orders (order_date);
CREATE INDEX idx_order_details_order_id ON order_details (order_id);
CREATE INDEX idx_order_details_product_id ON order_details (product_id);
```

- 使用 `EXPLAIN` 分析查询计划并优化：

```sql
EXPLAIN ANALYZE
SELECT c.customer_id, p.product_id, SUM(od.quantity * od.unit_price) as total_amount
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
JOIN order_details od ON o.order_id = od.order_id
JOIN products p ON od.product_id = p.product_id
WHERE o.order_date BETWEEN '2024-01-01' AND '2024-03-31'
GROUP BY c.customer_id, p.product_id;
```

**过程与原理**

- **复合索引**：通过创建多个复合索引，加快联接和过滤条件的处理。
- **优化查询计划**：通过 `EXPLAIN` 命令查看查询计划，确保索引被正确使用，并分析优化器的选择，对查询结构进行合理调整（如适当分解联接、聚合顺序）。
- **减少 I/O**：优化后的复合索引和索引覆盖查询减少了物理 I/O 操作，提高整体查询效率。

## 案例 6：消除低效的子查询

**场景需求**

查询每个客户的最新订单。一个初始想法是在子查询中查找每个客户的最大 `created_at`，然后将其与主查询进行连接。

```sql
SELECT * FROM orders o
WHERE created_at = (
  SELECT MAX(created_at) FROM orders WHERE customer_id = o.customer_id
);
```

**解决方案**

改用窗口函数。

```sql
SELECT *
FROM (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY created_at DESC) as rn
  FROM orders
) sub
WHERE rn = 1;
```

**过程与原理**

- **窗口函数**：`ROW_NUMBER()` 暂时对每个分区（`customer_id`）赋予一个序号，并根据时间降序排列。
- **性能优化**：原来是每行进行一次子查询，新的方式减少了查询次数，只进行了整体排序和单次过滤。

## 案例 7：复杂窗口函数和 CTE（公用表表达式）

**场景需求**

假设我们有一个成绩表 `scores`，需要查询每个学生的平均成绩、排名，且需要显示这些排名的时间段。

```sql
WITH ranked_scores AS (
  SELECT student_id, score, DATE_TRUNC('month', exam_date) as exam_month,
         RANK() OVER (PARTITION BY student_id, DATE_TRUNC('month', exam_date)
                      ORDER BY score DESC) as rank
  FROM scores
)
SELECT student_id, exam_month, AVG(score) as avg_score, MIN(rank) as best_rank
FROM ranked_scores
GROUP BY student_id, exam_month
ORDER BY student_id, exam_month;
```

**解决方案**

- 确保 `scores` 中 `student_id` 和 `exam_date` 有索引。
- 分析 `ranked_scores` 的性能，通过 `EXPLAIN` 查看查询计划。

**过程与原理**

- **窗口函数与索引**：窗口函数计算复杂度高，通过良好的索引减少全表扫描。
- **CTE 优化**：在 SQL 中，CTE 在被使用多次时，可能存在性能优化空间，通过`EXPLAIN`分析，必要时优化为子查询。
- **查询优化器的选择**：数据库系统会根据数据分布、索引等信息选择最优的执行计划。

## 案例 8：适当的表结构设计与分区表优化

**场景需求**

一个包含数亿行记录的大表 `logs`，包含 `log_id`, `user_id`, `event_time`, `event_type` 等字段。经常根据 `event_time` 进行查询。

```sql
SELECT * FROM logs WHERE event_time > '2022-01-01';
```

**解决方案**

使用表分区。

```sql
CREATE TABLE logs (
  log_id SERIAL PRIMARY KEY,
  user_id INT,
  event_time TIMESTAMP,
  event_type VARCHAR(50)
) PARTITION BY RANGE (event_time);

CREATE TABLE logs_2021 PARTITION OF logs FOR VALUES FROM ('2021-01-01') TO ('2021-12-31');
CREATE TABLE logs_2022 PARTITION OF logs FOR VALUES FROM ('2022-01-01') TO ('2022-12-31');
```

**过程与原理**

- **表分区**：通过将大表分区为多个子表，查询只扫描相关分区，提高查询效率。
- **分区裁剪**：PostgreSQL 通过判断条件，自动裁剪无需扫描的分区。

## 案例 9：使用物化视图优化复杂的聚合查询

**场景需求**

一个每次都需要计算的复杂聚合查询，比如某个时间段内，每月、每个客户的销售总量。

```sql
SELECT customer_id, DATE_TRUNC('month', order_date) as month, SUM(amount)
FROM orders
GROUP BY customer_id, month;
```

**解决方案**

使用物化视图。

```sql
CREATE MATERIALIZED VIEW monthly_sales AS
SELECT customer_id, DATE_TRUNC('month', order_date) as month, SUM(amount) as total_amount
FROM orders
GROUP BY customer_id, month;
```

定期刷新物化视图：

```sql
REFRESH MATERIALIZED VIEW monthly_sales;
```

**过程与原理**

- **物化视图**：将复杂查询的结果预计算并存储，减少查询时的计算量。
- **查询优化**：在查询中直接引用物化视图，可以显著提高查询速度，因为减少了实时聚合计算的开销。

## 案例 10：热点数据缓存与部分索引（Partial Index）

**场景需求**

假设我们有一个 Web 应用，其中 `orders` 表中大部分查询都集中在最近 30 天的数据。

```sql
SELECT * FROM orders WHERE order_date > NOW() - INTERVAL '30 days';
```

**解决方案**

- **部分索引**：只为热数据（热点数据）创建索引。部分索引减少了索引维护开销和查询时的冗余读取。
- **缓存策略**：缓存频繁查询结果，减少数据库负载。结合内存缓存机制（如 Redis）缓存频繁访问的查询结果。

```sql
CREATE INDEX idx_recent_orders ON orders (order_date)
WHERE order_date > NOW() - INTERVAL '30 days';
```

**过程与原理**

- **部分索引（Partial Index）**：在特定条件下创建索引，减少不必要的索引大小和维护成本。
- **缓存机制**：通过缓存减少数据库读操作，提升读取性能。

## 案例 11：分布式数据库优化（Sharding）

**场景需求**

假设你的应用需要处理 PB 级大数据，单一数据库实例已经无法满足性能需求。

**解决方案**

- **数据分片（Sharding）**：将数据水平分割到多个数据库实例。
- **垂直分区（Vertical Partitioning）**：将不同表或同一表的不同列分布到不同的数据库实例。

**过程与原理**

- **分片（Sharding）**：将数据按特定的字段（如用户 ID）进行分片，保证单个分片的数据量和访问频率相对均衡。
- **数据路由**：在应用层或数据库代理层确定数据路由策略，将查询路由到正确的分片。
- **分片策略**：常用的分片策略包括范围分片（Range Sharding）和哈希分片（Hash Sharding）。

## 案例 12：提升聚合查询性能

**场景需求**

有一个大数据量表 `sales` 记录了所有销售数据，需要计算全部销售额和每个月的销售额。

```sql
SELECT SUM(amount) FROM sales;

SELECT DATE_TRUNC('month', sale_date) as month, SUM(amount)
FROM sales
GROUP BY month;
```

**解决方案**

使用部分索引、聚合索引或分区表。

### 方法 1：部分索引

```sql
CREATE INDEX idx_sales_amount_partial
ON sales (amount)
WHERE sale_date >= '2024-01-01';
```

**过程与原理**

- 部分索引减少了索引大小和维护开销，仅对指定条件的数据进行索引优化。

### 方法 2：聚合索引（PostgreSQL 13+ 支持）

```sql
CREATE INDEX sales_monthly_amount_idx
ON sales (sale_date, amount)
INCLUDE (SUM(amount));
```

**过程与原理**

- 聚合索引在索引中存储聚合结果，减少实时计算量，显著提升查询性能。

### 方法 3：分区表

对表按时间进行分区。进行聚合查询时仅扫描必要的分区。

```sql
CREATE TABLE sales (
  sale_id SERIAL PRIMARY KEY,
  sale_date DATE,
  amount NUMERIC
) PARTITION BY RANGE (sale_date);

CREATE TABLE sales_2024 PARTITION OF sales
FOR VALUES FROM ('2024-01-01') TO ('2024-12-31');
```

**过程与原理**

- 分区表能显著减少需要扫描的数据量，尤为适用于范围查询和聚合。

## 案例 13：优化聚合和过滤的超大数据量表

**场景需求**

在流量日志表 `traffic_logs` 中，统计过去一周的 IP 访问次数。

```sql
SELECT ip_address, COUNT(*) as visit_count
FROM traffic_logs
WHERE log_date >= NOW() - INTERVAL '7 days'
GROUP BY ip_address
ORDER BY visit_count DESC;
```

**解决方案**

使用分区表和索引优化，同时结合物化视图存储中间结果。

- 创建按日期分区的表：

```sql
CREATE TABLE traffic_logs (
  log_id SERIAL PRIMARY KEY,
  ip_address VARCHAR(45),
  log_date TIMESTAMP
) PARTITION BY RANGE (log_date);

CREATE TABLE traffic_logs_2024_01 PARTITION OF traffic_logs
FOR VALUES FROM ('2024-01-01') TO ('2024-01-31');
```

- 创建组合索引：

```sql
CREATE INDEX idx_traffic_logs_date_ip ON traffic_logs (log_date, ip_address);
```

- 物化视图存储中间结果：

```sql
CREATE MATERIALIZED VIEW mv_ip_visit_count AS
SELECT ip_address, COUNT(*) as visit_count
FROM traffic_logs
WHERE log_date BETWEEN '2024-01-01' AND '2024-01-31'
GROUP BY ip_address;

REFRESH MATERIALIZED VIEW mv_ip_visit_count;
```

**过程与原理**

- **分区表**：减少数据扫描量，针对指定日期范围查询数据，提升性能。
- **组合索引**：多字段索引优化范围查询和聚合计算，减少冗余读取。
- **物化视图**：预计算并存储中间结果，减少实时计算开销，尤其适用于频繁统计查询。

## 总结

`查询优化`是我们数据库应用开发的一项关键任务，是确保数据库系统在处理复杂查询时能够高效运行的基本要求。通过以上案例的探讨，我们可以归纳出以下几个关键优化策略和对应的底层原理：

- **索引优化**：

  - **复合索引**：针对多列查询条件创建复合索引，减少扫描次数，提高查询效率。
  - **部分索引**：只为特定条件的数据创建索引，降低索引维护成本。
  - **覆盖索引**：利用覆盖索引减少回表操作，直接从索引中获取所需数据。

- **表结构优化**：

  - **分区表**：将大表按特定维度（如日期范围）进行分区，减少非必要的数据扫描，提高查询性能。
  - **垂直和水平分区**：适应不同的业务需求，分别对表的列和行进行分区优化。

- **查询策略优化**：

  - **窗口函数和 CTE**：在复杂分析和计算中使用窗口函数和 CTE，让 SQL 更具表达力的同时，结合索引优化提升性能。
  - **避免低效联接**：通过适当的索引和查询重写，优化多表联接，减少全表扫描和嵌套循环的开销。

- **缓存和物化视图**：
  - **缓存频繁查询**：结合内存缓存机制（如 Redis），减少数据库压力。
  - **物化视图**：预计算和存储中间查询结果，减少实时计算量，特别适用于复杂的聚合查询。

通过这些优化策略，PostgreSQL 能够更有效地处理大数据量、复杂查询和多表联接等场景，从而确保系统的高性能和高可靠性。理解底层原理以及合理应用这些技术，是实现高效查询优化的核心要素。

## 结语

这些案例展示了通过合理使用索引、复合索引、部分索引、多表联接、窗口函数、查询计划分析、表分区、分片策略、热数据访问、缓存机制、物化视图和分布式数据库等技术，大幅优化复杂查询的性能的过程。其主要涉及合理的表设计、索引的高效数据访问、减少子查询次数、分区裁剪机制，以及数据预计算等。
