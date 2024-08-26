---
id: retrieval-milvus
sidebar_position: 8
title: 向量数据库 Milvus：智能检索新时代
description: 向量数据库 Milvus：智能检索新时代
last_update:
  author: Aurelius
  date: 2024-08-21
tags:
  - 向量数据库
  - Milvus
  - 维护
  - 信息检索
  - 智能检索
  - AIGC
---

随着人工智能和大数据技术的不断进步，向量数据库的应用场景愈发广泛。Milvus 作为一款优秀的开源向量数据库，凭借其强大的数据处理能力和灵活的架构设计，在高效的相似性检索任务中展现出了重要价值。本文将详细探讨 Milvus 的基本特点与核心技术原理、基础维护以及基本使用，为用户提供 Milvus 的引入参考。

![Cover](assets/Milvus：智能检索新时代.drawio.png)

## Milvus 核心技术

### Milvus 基本特点

Milvus 是一个开源的向量数据库，以其高性能、可扩展和灵活的设计而著称，专注于处理大规模的向量数据。Milvus 具有以下几个主要技术特点:

- `高性能向量相似度搜索`：Milvus 能够在万亿级向量数据集上进行高效的向量相似度搜索,平均延迟可以控制在毫秒级。
- `可扩展性强`：Milvus 采用分布式架构设计,可以根据需求进行弹性伸缩。它支持组件级的可扩展性,允许根据不同的工作负载独立扩展各个组件。
- `多样化的索引支持`：Milvus 支持超过 10 种索引类型,包括 HNSW、IVF、Product Quantization 等,还支持基于 GPU 的索引。这使得开发人员可以根据具体需求优化搜索性能。
- `灵活的搜索能力`：Milvus 提供多种搜索类型,包括 Top-K 近似最近邻(ANN)搜索、范围 ANN 搜索以及带元数据过滤的搜索等。
- `可调节的一致性`：Milvus 提供了 delta 一致性模型,允许用户指定查询数据的"过期容忍度",从而在查询性能和数据新鲜度之间取得平衡。
- `硬件加速支持`：Milvus 设计时考虑了对各种计算能力的利用,如 AVX512 和 Neon 用于 SIMD 执行,以及量化、缓存感知优化和 GPU 支持等。
- `混合搜索能力`：除了向量数据,Milvus 还支持布尔型、字符串、整数、浮点数等数据类型。它可以将标量过滤与强大的向量相似度搜索结合起来。这些特点使 Milvus 成为一个高效、灵活且可扩展的向量数据库解决方案,适用于各种大规模向量相似度搜索应用场景。

### 索引策略

Milvus 采用多种索引策略来优化性能，其支持的向量索引类型大部分都采用了近似最近邻搜索（ANN Search），具体包括：

- `HNSW`：基于图的索引，适合对搜索效率要求较高的场景。还有一个 GPU 版本 GPU_CAGRA，感谢 Nvidia 的贡献。
- `FLAT`：最适合在百万级小型数据集上寻求完美准确搜索结果的场景。还有一个 GPU 版本 GPU_BRUTE_FORCE。
- `IVF_FLAT`：基于量化的索引，最适合在准确率和查询速度之间寻求理想平衡的场景。此外还有 GPU 版本 GPU_IVF_FLAT。
- `IVF_SQ8`：基于量化的索引，最适合于寻求大幅减少磁盘、CPU 和 GPU 内存消耗的场景，因为这些资源非常有限。
- `IVF_PQ`：基于量化的索引，适合那些追求查询速度，甚至牺牲准确率的场景。另外还有 GPU 版本 GPU_IVF_PQ。
- `SCANN`: 在向量聚类和乘积量化方面与 IVF_PQ 类似，不同之处在于乘积量化的实现细节以及使用 SIMD（单指令/多数据）进行高效计算。
- `DiskANN`：基于 Vamana 图表，DiskANN 可在大型数据集内提供高效搜索。

### 相似度计算

Milvus 支持多种相似度（距离）计算方法，例如欧氏距离（Euclidean distance，L2）、余弦相似度、内积（IP）、汉明（Hamming）等，允许用户根据具体需求选择合适的计算方式。

在 Milvus 中，欧氏距离通常被称为 L2 距离。使用欧氏距离进行向量搜索的示例如下:

```python
# 进行范围搜索
search_params = {
    "metric_type": "L2",
    "params": {
        "radius": 0.8,
        "range_filter": 1.0
    }
}
res = client.search(
    collection_name="test_collection",
    data=[[0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592]],
    limit=3,
    search_params=search_params,
    output_fields=["color"],
)
```

在这个例子中:

- 设置 `metric_type` 为 "L2"，表示使用欧氏距离。
- `radius` 和 `range_filter` 参数用于定义搜索范围。
- `data` 参数是我们要搜索的向量。
- `limit` 参数指定返回最相似的 3 个结果。

Milvus 在选择欧氏距离作为度量方法时，实际上只计算了开方前的值。使用欧氏距离时，较小的距离表示更高的相似度。在范围搜索中，要排除最接近的向量，应确保：`range_filter` \<= distance \< `radius`。根据具体应用场景，可能需要调整参数以获得最佳结果。

### 图像检索演示

假设我们要使用 Milvus 进行图像检索应用。在这个实际案例中，我们将向 Milvus 中插入图像特征向量，然后执行相似性检索。

首先，我们定义一个特征提取器来将图像转换为向量嵌入:

```python
import torch
import timm
from torchvision import transforms
from PIL import Image
import numpy as np
from sklearn.preprocessing import normalize

class FeatureExtractor:
    def __init__(self, model_name="resnet34"):
        self.model = timm.create_model(model_name, pretrained=True)
        self.model.eval()
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])

    def __call__(self, image_path):
        # Load and preprocess the image
        image = Image.open(image_path).convert("RGB")
        input_tensor = self.transform(image).unsqueeze(0)

        # Perform inference
        with torch.no_grad():
            output = self.model(input_tensor)
        # Extract the feature vector
        feature_vector = output.squeeze().numpy()
        return normalize(feature_vector.reshape(1, -1), norm="l2").flatten()
```

接下来，我们创建一个 Milvus 集合来存储图像嵌入:

```python
from pymilvus import MilvusClient
# Set up a Milvus client
client = MilvusClient(uri="example.db")
# Create a collection in quick setup mode
if client.has_collection(collection_name="image_embeddings"):
    client.drop_collection(collection_name="image_embeddings")
client.create_collection(
    collection_name="image_embeddings",
    vector_field_name="vector",
    dimension=512,
    auto_id=True,
    enable_dynamic_field=True,
    metric_type="COSINE",
)
```

然后，我们可以提取图像嵌入并将它们插入到 Milvus 集合中:

```python
import os
extractor = FeatureExtractor("resnet34")
root = "./train"
insert = True
if insert is True:
    for dirpath, foldername, filenames in os.walk(root):
        for filename in filenames:
            if filename.endswith(".JPEG"):
                filepath = dirpath + "/" + filename
                image_embedding = extractor(filepath)
                client.insert(
                    "image_embeddings",
                    {"vector": image_embedding, "filename": filepath},
                )
```

最后,我们可以使用一个查询图像来搜索相似的图像:

```python
query_image = "./test/Afghan_hound/n02088094_4261.JPEG"
results = client.search(
    "image_embeddings",
    data=[extractor(query_image)],
    output_fields=["filename"],
    search_params={"metric_type": "COSINE"},
)
```

这个例子展示了如何使用 Milvus 进行图像检索的基本流程。它包括图像特征提取、创建 Milvus 集合、插入图像嵌入向量以及执行相似图像搜索。请注意，这只是一个基本示例。在实际应用中，可能需要根据具体需求进行调整，例如选择不同的特征提取模型、调整索引参数或添加更多的元数据字段。

## Milvus 基础维护

### 环境搭建

在使用 Milvus 之前，必须先完成环境的搭建，这里以 Docker 环境为例。

- 首先，确保系统已经安装了 Docker。如果还没有安装，请先[安装 Docker](https://docs.docker.com/get-docker/)。

- 下载 Milvus 的 Docker Compose 配置文件:

```shell
$ wget https://github.com/milvus-io/milvus/releases/download/v2.4.8/milvus-standalone-docker-compose.yml -O docker-compose.yml
```

- 在包含 docker-compose.yml 文件的目录中，使用以下命令启动 Milvus:

```shell
$ sudo docker compose up -d
Creating milvus-etcd  ... done
Creating milvus-minio ... done
Creating milvus-standalone ... done
```

- 启动后，可以使用以下命令检查容器是否正在运行:

```shell
$ sudo docker compose ps
      Name                     Command                  State                            Ports
--------------------------------------------------------------------------------------------------------------------
milvus-etcd         etcd -advertise-client-url ...   Up             2379/tcp, 2380/tcp
milvus-minio        /usr/bin/docker-entrypoint ...   Up (healthy)   9000/tcp
milvus-standalone   /tini -- milvus run standalone   Up             0.0.0.0:19530->19530/tcp, 0.0.0.0:9091->9091/tcp
```

这样,您就成功在本地使用 Docker 搭建了 Milvus 环境。Milvus 服务器现在在本地的 19530 端口上运行。

- 如果想停止并删除这些容器，可以使用以下命令:

```shell
# 停止Milvus
$ sudo docker compose down
# 删除服务数据
$ sudo rm -rf volumes
```

需要注意的是，为了获得最佳性能，Milvus 需要至少 8GB 的可用内存。如果使用的是 Docker Desktop，可能需要在设置中增加分配给 Docker 的内存。

这是在本地使用 Docker 搭建 Milvus 环境的最简方式。

### 建立向量索引

在 Milvus 中建立向量索引的过程主要包括以下步骤：

- 准备索引参数：首先，我们需要定义索引参数。这些参数决定了索引的类型和性能特征。例如：

```python
index_params = {
    "metric_type": "L2",
    "index_type": "IVF_FLAT",
    "params": {"nlist": 1024}
}
```

这里选择了 L2 距离度量，IVF_FLAT 索引类型，并设置了 nlist 参数。

- 创建索引：使用准备好的索引参数，可以在集合的向量字段上创建索引：

```python
client.create_index(
    collection_name="example_collection",
    field_name="vector_field",
    index_params=index_params
)
```

这个操作会在名为"example_collection"的集合中，为"vector_field"字段创建索引。

- 加载集合：创建索引后，我们需要将集合加载到内存中以便进行搜索：

```python
client.load_collection("example_collection")
```

这个步骤将集合及其索引加载到内存中，使其可以进行快速搜索。需要注意的是，Milvus 支持多种索引类型，如 FLAT、IVF_FLAT、IVF_SQ8、IVF_PQ、HNSW 等。每种索引类型都有其特定的使用场景和参数设置。例如，HNSW 索引适合对搜索效率有高要求的场景，而 IVF_FLAT 则在准确性和查询速度之间提供了良好的平衡。

此外，不同的向量类型（如浮点型向量、二进制向量）支持不同的索引类型和度量方法。在选择索引类型和参数时，需要根据具体的应用场景和数据特征来决定。最后，建立索引是一个计算密集型的操作，可能需要一定的时间。对于大规模数据集，可以考虑使用异步索引构建来避免阻塞其他操作。

通过合理地选择和配置索引，可以显著提高 Milvus 的查询性能，实现高效的向量相似度搜索。

### 数据导入

Milvus 提供了丰富的数据管理功能，包括数据的导入、更新和删除。

下面已 CSV 文件为例，演示如何向 Milvus 导入向量数据。

假设我们有一个名为"movies.csv"的 CSV 文件，其中包含电影标题和剧情摘要。我们将使用 SentenceTransformers 库来将剧情摘要转换为向量嵌入。安装必要的库:

```shell
pip install pymilvus sentence-transformers
```

以下是完整的示例代码:

```python
import csv
from sentence_transformers import SentenceTransformer
from pymilvus import connections, Collection, FieldSchema, CollectionSchema, DataType

# 连接到Milvus
connections.connect(host='localhost', port='19530')

# 创建集合
fields = [
    FieldSchema(name="pk", dtype=DataType.INT64, is_primary=True, auto_id=True),
    FieldSchema(name="title", dtype=DataType.VARCHAR, max_length=100),
    FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=384)
]
schema = CollectionSchema(fields, "电影集合")
collection = Collection("movies", schema)

# 创建索引
index_params = {
    'metric_type':'L2',
    'index_type':"IVF_FLAT",
    'params':{'nlist': 1536}
}
collection.create_index(field_name="embedding", index_params=index_params)
collection.load()

# 初始化SentenceTransformer模型
transformer = SentenceTransformer('all-MiniLM-L6-v2')

# 从CSV文件读取数据并插入Milvus
def csv_load(file):
    with open(file, newline='', encoding='utf-8') as f:
        reader = csv.reader(f, delimiter=',')
        next(reader)  # 跳过标题行
        for row in reader:
            if '' in (row[0], row[1]):
                continue
            yield (row[0], row[1])

# 批量插入数据
def batch_insert(data):
    titles, plots = zip(*data)
    embeddings = transformer.encode(plots)
    entities = [
        titles,
        embeddings.tolist()
    ]
    collection.insert(entities)

# 从CSV文件读取数据并插入Milvus
batch_size = 100
data_batch = []
for title, plot in csv_load('./movies.csv'):
    data_batch.append((title, plot))
    if len(data_batch) >= batch_size:
        batch_insert(data_batch)
        data_batch = []

# 插入剩余的数据
if data_batch:
    batch_insert(data_batch)

# 调用flush以索引任何未密封的段
collection.flush()

print(f"插入完成。集合中的实体数量: {collection.num_entities}")
```

这个示例代码做了以下几件事:

- 连接到 Milvus 服务器。
- 创建一个名为"movies"的集合,包含主键、电影标题和向量嵌入字段。
- 为向量嵌入字段创建索引。
- 初始化 SentenceTransformer 模型,用于生成文本的向量嵌入。
- 定义了一个函数来从 CSV 文件中读取数据。
- 定义了一个函数来批量插入数据到 Milvus。
- 从 CSV 文件中读取数据，每 100 条记录进行一次批量插入。
- 插入完成后，调用 flush()来确保所有数据都被索引。

这个示例假设 CSV 文件格式为：第一列是电影标题，第二列是剧情摘要。实际应用需要根据实际的 CSV 文件结构调整代码。

此外，这个示例使用了'all-MiniLM-L6-v2'模型来生成 384 维的向量嵌入。

这个示例展示了如何从 CSV 文件导入数据到 Milvus 的基本流程。您可以根据实际需求进行进一步的优化和调整。

### 数据更新

对于数据更新，Milvus 不支持直接更新操作。但是可以使用 upsert 操作来实现类似的功能。

upsert 操作是一种数据级别的操作，它会插入新的实体，如果主键已存在，则会覆盖旧的实体。这是在 Milvus 中实现数据更新的主要方法。

以下是使用 Python SDK 进行 upsert 操作的示例:

```python
# 准备要更新的数据
data = [
    {"id": 0, "vector": [-0.619954382375778, 0.4479436794798608, -0.17493894838751745, -0.4248030059917294, -0.8648452746018911], "color": "black_9898"},
    {"id": 1, "vector": [0.4762662251462588, -0.6942502138717026, -0.4490002642657902, -0.628696575798281, 0.9660395877041965], "color": "red_7319"},
    {"id": 2, "vector": [-0.8864122635045097, 0.9260170474445351, 0.801326976181461, 0.6383943392381306, 0.7563037341572827], "color": "white_6465"},
]

# 执行upsert操作
res = client.upsert(
    collection_name="quick_setup",
    data=data,
)

print(res.upsert_cnt)
```

这段代码会更新或插入三个实体。如果集合中已经存在相同 id 的实体，它们将被更新；如果不存在，则会被插入为新实体。

需要注意以下几点:

- upsert 操作不支持启用了 autoID 的集合。这是因为 autoID 会自动生成主键，而 upsert 需要明确指定主键。
- 如果计划使用 upsert 而不是 insert 来进行大规模数据导入(例如，数百万向量)，注意这可能会导致 Milvus 数据节点上的内存消耗较高。
- upsert 操作不会更新主键。如果您尝试更改主键，它将被视为一个新的实体。
- 使用 upsert 时，确保提供的数据结构与集合的 schema 匹配。包括主键字段和向量字段。
- 执行 upsert 操作后，可以通过检查返回结果中的`upsert_cnt`来确认更新或插入的实体数量。

如果需要在特定的分区中进行 upsert 操作，可以在 upsert 请求中指定分区名称:

```python
res = client.upsert(
    collection_name="quick_setup",
    data=data,
    partition_name="partitionA"
)
```

这将在名为"partitionA"的分区中执行 upsert 操作。

使用 upsert 操作可以有效地更新 Milvus 中的数据，但需记住，这实际上是一个"删除后插入"的过程，而不是原地更新。因此在处理大量数据时要谨慎使用，以避免过高的内存消耗。

### 数据删除

对于数据删除，Milvus 提供了两种方式：通过主键删除和通过表达式删除。

- 通过主键删除实体：

```python
# 通过主键删除实体
res = client.delete(collection_name="demo_collection", ids=[0, 2])
print(res)
```

- 通过表达式删除实体：

```python
# 通过表达式删除实体
res = client.delete(
    collection_name="demo_collection",
    filter="subject == 'biology'",
)
print(res)
```

这两种删除方法都会返回被删除实体的 ID 列表。

需要注意的是，删除操作并不会立即释放存储空间。Milvus 使用后台压缩过程来合并较小的数据段并移除已删除的数据。垃圾回收过程会定期移除这些"已删除"的段，从而释放存储空间。这个过程确保了存储的高效使用，但可能会在删除和空间回收之间引入轻微的延迟。

对于数据可见性，Milvus 采用了存储-计算分离的架构。可以通过一致性级别来管理数据的可读性。如果需要立即看到插入、删除或更新的数据，可以使用"Strong"一致性级别。但这可能会影响写入性能。如果优先考虑更快的写入速度，可以选择较弱的一致性级别，但数据可能不会立即可见。

最后值得一提的是，对于 VARCHAR 字段，如果它不是主键，为其创建索引可以加速某些删除操作。例如，INVERTED 索引可以加速使用`IN`或`==`表达式的删除操作，而 Trie 索引可以加速前缀查询（如`LIKE prefix%`）的删除操作。

这些是 Milvus 中处理数据更新和删除的基本方法。在实际应用中，需要根据具体的性能需求和数据一致性要求来选择合适的策略。

### 用户权限管理

Milvus 通过基于角色的访问控制（RBAC）来管理用户权限。以下是 Milvus 权限管理的主要特点和操作方法：

- `用户和角色`：
  - 用户是具有用户名和密码的身份。
  - 角色定义了用户对特定对象的权限集合。
- `对象和权限`：
  - 对象可以是全局级别、集合级别或用户级别。
  - 权限定义了可以执行的操作和可以访问的资源。
- `启用用户认证`：在 Milvus 配置文件中设置`common.security.authorizationEnabled`为`true`。
- `连接到 Milvus`：
  使用用户名和密码进行连接。例如：
  ```python
  from pymilvus import MilvusClient
  client = MilvusClient(
      uri='http://localhost:19530',
      token="root:Milvus"
  )
  ```
- `用户管理`：
  - `创建用户`：
  ```python
  client.create_user(
      user_name='user_1',
      password='P@ssw0rd'
  )
  ```
  - `更新用户密码`：
  ```python
  client.update_password(
      user_name='user_1',
      old_password='P@ssw0rd',
      new_password='P@ssw0rd123'
  )
  ```
- `角色管理`：
  - `创建角色`：
  ```python
  client.create_role(role_name='roleA')
  ```
  - `授予权限给角色`：
  ```python
  client.grant_privilege(
      role_name='roleA',
      object_type='User',
      object_name='SelectUser',
      privilege='SelectUser'
  )
  ```
- `将角色授予用户`：
  ```python
  client.grant_role(
      user_name='user_1',
      role_name='roleA'
  )
  ```
- `撤销权限`：
  - `从角色中移除权限`：
  ```python
  client.revoke_privilege(
      role_name='roleA',
      object_type='User',
      object_name='SelectUser',
      privilege='SelectUser'
  )
  ```
  - `从用户中移除角色`：
  ```python
  client.revoke_role(
      user_name='user_1',
      role_name='roleA'
  )
  ```
- `默认用户和角色`：
  - Milvus 默认创建一个`root`用户，密码为`Milvus`，具有管理员权限。
  - `public`角色拥有`DescribeCollection`、`ShowCollections`和`IndexDetail`权限。
- `权限类型`：
  Milvus 支持多种权限类型，如`CreateIndex`、`DropIndex`、`Insert`、`Delete`、`Search`等，可以针对不同的对象类型（如 Collection、Global、User）进行细粒度的权限控制。通过这些机制，Milvus 提供了灵活而强大的用户权限管理功能，允许管理员精确控制每个用户对系统资源的访问权限。

## Milvus 评估与调优

### 性能评估

对 Milvus 进行性能评估是确保系统满足应用需求的重要步骤。以下是进行 Milvus 性能评估的一些关键方法和指标：

- `性能指标`：
  主要关注以下几个方面的性能指标：
  - 加载延迟：测量将数据加载到 Milvus 内存并建立索引所需的时间。
  - 查询每秒（QPS）：衡量 Milvus 处理传入查询的速率。
  - 召回率：评估搜索算法检索到的真实匹配项的比例。
- `基准测试工具`：
  可以使用以下开源工具进行基准测试：
  - VectorDBBench：由 Zilliz 开发，支持测试不同索引类型的向量数据库。
  - vector-db-benchmark：由 Qdrant 开发，专注于测试 HNSW 索引类型。
- `数据集选择`：
  选择合适的数据集进行测试，如：
  - LAION 数据集：用于测试大规模数据处理能力。
  - OpenAI 的 5M 向量数据集：用于测试高维向量处理能力。
- `性能分析工具`：
  使用以下工具进行深入的性能分析：
  - Linux 的 perf 工具：提供系统级性能洞察。
  - Intel vTune Profiler：用于优化应用程序和系统性能。
- `硬件性能验证`：
  对于使用本地磁盘的 QueryNode，可以使用 Fio 工具进行磁盘性能测试。例如：
  ```bash
  fio --filename=/mnt/nvme/fio_test --direct=1 --rw=randread --bs=4k --ioengine=libaio --iodepth=256 --runtime=120 --numjobs=4 --time_based --group_reporting --name=iops-test-job --eta-newline=1 --readonly
  ```
  这个命令可以测试随机读取性能。
- `索引性能比较`：测试不同索引类型（如 HNSW、IVF_FLAT、IVF_SQ8 等）的性能，以找到最适合您数据和查询模式的索引。
- `一致性级别测试`：评估不同一致性级别设置对性能的影响。
- `分布式性能`：对于分布式部署，测试系统的扩展性和负载均衡能力。
- `GPU 加速测试`：如果使用 GPU，比较 CPU 和 GPU 索引的性能差异。Milvus 2.3 版本引入了 GPU 支持，可以显著提高某些操作的性能。
- `长期稳定性测试`：进行长时间的稳定性测试，确保系统在持续负载下的性能表现。

通过综合考虑这些因素并进行全面的性能评估，可以得到 Milvus 在特定使用场景下的性能表现，从而做出合适的配置和优化决策。

### 调优技巧

在使用 Milvus 时，有几个关键的调优技巧可以帮助提高系统性能：

- `索引选择与参数优化`：选择合适的索引类型对查询性能至关重要。例如，对于需要高查询效率的场景，可以考虑使用 HNSW 索引。对于大规模数据集，IVF 系列索引（如 IVF_FLAT、IVF_SQ8、IVF_PQ）通常表现良好。索引参数的调整也很重要，如 IVF 索引的 nlist 参数和 HNSW 索引的 M 参数。
- `数据分区`：对大规模数据集进行合理的分区可以提高查询效率。可以根据业务逻辑或数据特征进行分区，以减少每次查询需要扫描的数据量。
- `批量操作`：在进行数据插入、查询等操作时，尽量使用批量操作而不是单条操作，可以显著提高吞吐量。
- `合理设置一致性级别`：Milvus 提供了不同的一致性级别。对于需要实时性的应用，可以选择强一致性；对于对延迟不敏感的应用，可以选择较弱的一致性级别以提高性能。
- `硬件配置`：Milvus 对内存和 CPU 性能要求较高。确保有足够的内存来容纳索引，使用高性能的 CPU 和 SSD 可以显著提升性能。
- `负载均衡`：在分布式部署时，合理分配负载可以提高整体性能。可以使用 Milvus 提供的负载均衡策略来优化资源利用。
- `监控与调优`：使用 Milvus 提供的监控工具来跟踪系统性能，及时发现和解决瓶颈问题。
- `向量压缩`：对于大规模数据集，可以考虑使用向量压缩技术（如 IVF_SQ8、IVF_PQ 索引）来减少内存占用，但需要在精度和性能之间权衡。
- `预热数据`：对于频繁访问的数据，可以预先加载到内存中，以提高查询速度。
- `优化查询参数`：在进行向量搜索时，合理设置 topK、nprobe 等参数可以在查询速度和准确性之间取得平衡。

这些技巧可以帮助优化 Milvus 的性能，但具体的调优策略还需要根据实际的应用场景和数据特征来确定。建议在生产环境中进行充分的测试和性能评估，以找到最适合的配置。

## Milvus 数据安全

### 安全策略

Milvus 采用了多层次的数据安全策略来保护数据的安全性和完整性。以下是 Milvus 的主要数据安全策略：

- `用户认证和授权`：Milvus 支持基本的用户认证功能。用户需要提供有效的用户名和密码才能访问 Milvus 实例。这可以防止未经授权的访问。
- `传输层安全性（TLS）`：Milvus 支持 TLS 连接，确保客户端和服务器之间的通信安全。TLS 使用证书来提供通信各方之间的身份验证服务。
- `数据加密`：Milvus 使用 bcrypt 算法对存储在 etcd 中的密码进行加密。这种加密方法实现了 Provos 和 Mazières 的自适应哈希算法。
- `角色基础访问控制（RBAC）`：Milvus 允许管理员为不同的用户分配不同的角色和权限，从而实现细粒度的访问控制。
- `数据备份和恢复`：虽然具体的备份策略没有在提供的文档中详细说明，但作为一个数据库系统，Milvus 应该支持数据备份和恢复机制，以防止数据丢失。
- `日志和审计`：Milvus 使用日志代理来处理数据持久化和事件通知。这可以用于审计和追踪系统活动。
- `分布式架构`：Milvus 采用存储计算分离的架构，这种设计可以提高系统的可靠性和可扩展性，间接提升了数据的安全性。
- `一致性控制`：Milvus 提供了可调节的一致性级别，允许用户在性能和数据一致性之间进行权衡。这有助于确保数据的完整性。

要启用这些安全特性，需要在 Milvus 的配置文件中进行相应的设置。例如，要启用用户认证，需要在配置文件中设置：

```yaml
common:
  security:
    authorizationEnabled: true
```

然后，可以使用以下方式连接到启用了认证的 Milvus 实例：

```python
from pymilvus import MilvusClient
client = MilvusClient(
    uri='http://localhost:19530',
    token="root:Milvus"
)
```

这些安全策略共同工作，为 Milvus 中的数据提供了多层次的保护。具体的安全配置和策略应该根据实际的部署环境和安全需求进行调整。

### 数据备份与恢复

Milvus 提供了一个名为 Milvus Backup 的工具，用于数据备份和恢复。这个工具支持通过命令行界面（CLI）或 API 进行操作，为用户提供了灵活的选择。

**备份过程**

- `获取 Milvus Backup 工具`：您可以从 GitHub 的 release 页面下载编译好的二进制文件，或者从源代码编译。
- `创建备份`：

  使用 CLI 创建备份的命令如下：

  ```shell
  ./milvus-backup create -n <backup_name>
  ```

  使用 API 创建备份的示例如下：

  ```shell
  curl --location --request POST 'http://localhost:8080/api/v1/create' \
  --header 'Content-Type: application/json' \
  --data-raw '{
   "async": true,
   "backup_name": "my_backup",
   "collection_names": [
   "hello_milvus"
   ]
  }'
  ```

  这些命令会创建一个名为 \<backup_name\> 的备份。

- `下载备份文件`：备份完成后，您可以使用 Minio Console 或 mc 客户端下载备份文件。

**恢复过程**

- `恢复数据`：

  使用 CLI 恢复数据的命令如下：

  ```shell
  ./milvus-backup restore -n my_backup -s _recover
  ```

  使用 API 恢复数据的示例如下：

  ```shell
  curl --location --request POST 'http://localhost:8080/api/v1/restore' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "async": true,
      "collection_names": [
      "hello_milvus"
    ],
      "collection_suffix": "_recover",
  }'
  ```

  这些命令会从名为 my_backup 的备份中恢复数据，并为恢复的集合添加"\_recover"后缀。

- `验证恢复的数据`：恢复完成后，您可以使用提供的 Python 脚本验证恢复的数据。

需要注意的是，Milvus Backup 工具不会影响 Milvus 实例的正常运行。在备份或恢复过程中，Milvus 实例仍然可以正常提供服务。

此外，Milvus Backup 还提供了列出备份和获取备份文件的功能，这些可以通过 API 来实现。

通过使用 Milvus Backup，可以确保数据的安全性，并在需要时快速恢复数据。这对于数据管理和灾难恢复策略来说是非常重要的。

## Milvus 扩展性

Milvus 的集成与扩展性体现在多个方面，使其成为一个灵活且强大的向量数据库解决方案：

- 多种部署选项：Milvus 支持多种部署方式，包括 Docker 容器和 Kubernetes 集群。这提供了灵活的部署选项，适应不同的基础设施需求。
- 多语言 SDK 支持：Milvus 提供了多种编程语言的 SDK，包括 Python、Java、Go 等，使开发者能够在不同的编程环境中使用 Milvus。
- RESTful API：Milvus 提供了 RESTful API，允许通过 HTTP 请求与 Milvus 进行交互，这增加了系统的可访问性和集成性。
- 与 AI 和机器学习框架的集成：Milvus 可以与各种 AI 和机器学习框架集成，支持向量化和相似性搜索等操作，这使得它在 AI 应用中特别有用。
- 可扩展的索引类型：Milvus 支持多种索引类型，并且可以根据需要进行扩展，以适应不同的查询需求和性能要求。
- 硬件加速支持：Milvus 2.3 版本引入了 GPU 支持，这大大提高了系统的性能，特别是在处理大规模数据时。
- 数据同步和迁移：Milvus 2.3 版本引入了变更数据捕获（CDC）功能，支持数据的实时同步和迁移，增强了系统的可扩展性和数据管理能力。
- 云原生设计：Milvus 的架构设计遵循云原生原则，支持在云环境中的弹性伸缩和高可用性部署。
- 开源生态系统：作为一个开源项目，Milvus 拥有活跃的社区，这促进了其持续发展和功能扩展。
- 插件系统：Milvus 支持插件系统，允许用户开发自定义功能和扩展，进一步增强了系统的灵活性。

这些特性使 Milvus 能够适应各种复杂的应用场景，从小型项目到大规模生产环境，都能提供强大的向量数据管理和搜索能力。

## 案例演示

### 电影推荐

假设我们有一个电影数据集，包含电影 ID、标题和特征向量。可以使用深度学习模型（如 PaddlePaddle 实现的融合推荐模型）将电影信息转换为特征向量。

将电影特征向量导入 Milvus：

```python
from pymilvus import MilvusClient

client = MilvusClient("http://localhost:19530")

# 创建集合
client.create_collection(
    collection_name="movies",
    dimension=256,  # 假设特征向量维度为256
    metric_type="L2"
)

# 插入电影数据
movies_data = [
    {"id": 1, "vector": [...], "title": "Movie A"},
    {"id": 2, "vector": [...], "title": "Movie B"},
    # ... 更多电影数据
]

client.insert(
    collection_name="movies",
    data=movies_data
)

# 创建索引以加快搜索
client.create_index(
    collection_name="movies",
    field_name="vector",
    index_type="IVF_FLAT",
    metric_type="L2",
    params={"nlist": 1024}
)

client.load_collection("movies")
```

当用户请求推荐时，可以基于用户的兴趣特征向量进行相似度搜索:

```python
# 假设我们已经得到了用户的兴趣特征向量
user_vector = [...]

# 搜索相似电影
results = client.search(
    collection_name="movies",
    data=[user_vector],
    limit=5,
    output_fields=["title"]
)

# 打印推荐结果
for hit in results[0]:
    print(f"推荐电影: {hit.entity.get('title')}, 相似度得分: {hit.distance}")
```

这个简单的示例展示了如何使用 Milvus 存储电影特征向量，并基于用户兴趣进行相似度搜索来生成推荐。在实际应用中，我们还需要考虑更多因素，如用户行为数据的实时更新、多模态特征的融合、推荐结果的多样性等。

Milvus 的高性能向量检索能力使得它能够在大规模数据集上快速找到相似项，这对于推荐系统的实时性要求非常重要。Milvus 的可扩展性也使得它能够适应不断增长的数据规模，满足推荐系统的需求。

### 在线广告投放

假设我们在一个在线广告投放平台，需要实时匹配用户特征与广告特征，以提升广告投放的效果。在这个场景中，我们需要处理大量的用户特征向量，并迅速从广告库中找到最优匹配。

首先设置 Milvus 并创建一个用于存储广告特征的集合:

```python
from pymilvus import MilvusClient

# 连接到Milvus服务器
client = MilvusClient(uri="http://localhost:19530")

# 创建广告集合
client.create_collection(
    collection_name="ads",
    dimension=128,  # 假设我们使用128维的特征向量
    metric_type="IP"  # 使用内积作为相似度度量
)

# 创建索引以加速搜索
client.create_index(
    collection_name="ads",
    field_name="vector",
    index_type="IVF_FLAT",
    metric_type="IP",
    params={"nlist": 1024}
)

# 加载集合到内存
client.load_collection("ads")
```

接下来可以插入一些广告数据:

```python
# 插入广告数据
ads_data = [
    {"id": 1, "vector": [...], "ad_content": "广告1"},
    {"id": 2, "vector": [...], "ad_content": "广告2"},
    # ... 更多广告数据
]

client.insert(
    collection_name="ads",
    data=ads_data
)
```

当需要为用户匹配广告时，可以使用用户的特征向量进行搜索:

```python
# 假设我们已经得到了用户的特征向量
user_vector = [...]

# 搜索匹配的广告
results = client.search(
    collection_name="ads",
    data=[user_vector],
    limit=5,
    output_fields=["ad_content"]
)

# 打印匹配结果
for hit in results[0]:
    print(f"匹配广告: {hit.entity.get('ad_content')}, 相似度得分: {hit.distance}")
```

这个简单的演示展示了如何使用 Milvus 来存储广告特征向量，并基于用户特征进行实时匹配。在实际应用中，我们还需要考虑以下几点:

- `实时更新`: 广告库需要频繁更新。我们可以使用 Milvus 的`upsert`操作来实现实时更新。
- `性能优化`: 对于大规模数据，我们可能需要调整索引参数或使用更高效的索引类型(如 HNSW)来提高搜索性能。
- `多维度匹配`: 除了特征向量，我们还可能需要考虑其他因素(如用户地理位置、时间等)。可以使用 Milvus 的混合搜索功能来实现这一点。
- `负载均衡`: 在高并发场景下，我们需要考虑使用 Milvus 的分布式部署来实现负载均衡。
- `监控和日志`: 实现系统监控和日志记录，以便及时发现和解决问题。

通过使用 Milvus，我们可以实现高效的实时广告匹配，提升广告投放的效果。Milvus 的高性能向量检索能力使得它能够在大规模数据集上快速找到相似项，这对于在线广告平台的实时性要求非常重要。

## 结语

随着对高效向量检索需求的不断增长，Milvus 在未来的数据分析和人工智能领域继续扮演着举足轻重的角色，助力企业和开发者解决各类复杂的数据挑战。本文通过探讨 Milvus 的基本特点与技术原理、环境搭建与数据管理、基本使用与最佳实践，能够全面理解 Milvus 的强大功能及高效性能，并为构建智能化、高效率的数据处理平台打下坚实基础。

---

**PS：感谢每一位志同道合者的阅读，欢迎关注、点赞、评论！**
