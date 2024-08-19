---
id: unsupervised-learning-k-means
sidebar_position: 4
title: 无监督学习：K-Means 聚类算法
description: 无监督学习：K-Means 聚类算法
last_update:
  author: Aurelius
  date: 2024-08-19
tags:
  - 无监督学习
  - K-Means
  - 聚类
  - 算法
  - 信息检索
  - 机器学习
  - AIGC
---

K-Means 聚类算法是机器学习领域中一个重要的无监督学习算法，它在数据挖掘、模式识别等多个领域均有广泛应用。

![Cover](<assets/无监督学习：K-Means 聚类算法.drawio.png>)

## K-Means 聚类算法

### 基础概念

K-Means 聚类算法是一种将数据集划分为 K 个簇的无监督学习方法。每个簇由其质心（中心点）表示，算法旨在最小化每个数据点与其对应质心之间的距离总和。这一距离通常使用欧式距离计算，可表示为：

$$
    J = \sum_{i=1}^{K} \sum_{x \in C_i} ||x - \mu_i||^2
$$

其中，$J$ 为目标函数，$C_i$ 为第 i 个簇，$x$ 为数据点，$\mu_i$ 为第 i 个簇的质心。

### 算法步骤

K-Means 算法通常包括以下步骤：

- **初始化**：选定 K 值，并随机选择 K 个数据点作为初始质心。
- **分配数据点**：将每个数据点分配到距离其最近的质心，形成 K 个簇。
- **更新质心**：计算每个簇中所有数据点的均值，并更新质心的位置。
- **重复迭代**：重复步骤 2 和 3，直到质心不再变化或变化小于设定阈值。

### 收敛条件

算法的收敛条件通常是在质心不再改变时，或者更严格的情况是目标函数 $J$ 的变化低于某个设定的小值。

### 质心初始化的影响

质心初始化会显著影响聚类结果的质量。常用的初始化方法有：

- **随机选择**：简单但可能导致局部最优。
- **K-Means++**：通过更聪明的方式选择初始质心以提高收敛速度和聚类效果。

### 实际案例演示

**案例**：使用 K-Means 聚类对客户进行市场细分。

在这个例子中，我们用 K-Means 对客户的购买行为数据进行分析，以确定不同的市场细分。

**模拟代码**（使用 Python 和 `sklearn` 库）：

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans

# 生成模拟数据
np.random.seed(42)
data = {
    'Annual Income (k$)': np.random.randint(20, 100, 200),
    'Spending Score (1-100)': np.random.randint(1, 100, 200)
}
df = pd.DataFrame(data)

# K-Means 聚类
k = 4  # 选择 K 值
kmeans = KMeans(n_clusters=k, random_state=42)
df['Cluster'] = kmeans.fit_predict(df)

# 可视化结果
plt.scatter(df['Annual Income (k$)'], df['Spending Score (1-100)'], c=df['Cluster'], cmap='viridis')
plt.scatter(kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1], s=300, c='red', label='Centroids')
plt.xlabel('Annual Income (k$)')
plt.ylabel('Spending Score (1-100)')
plt.title('K-Means Clustering of Customers')
plt.legend()
plt.show()
```

## K-Means 的优缺点分析

### 优点

- **简单易用**：K-Means 算法实现简单，适合初学者学习。
- **高效处理大数据**：相比其他聚类算法，K-Means 计算性能较好，适用于大规模数据集。

### 缺点

- **对初始质心敏感**：若初始质心选择不当，容易导致局部最优解。
- **需预设 K 值**：用户需要提前指定簇的数量，可能导致聚类结果不准确。
- **对噪声和异常值敏感**：异常值会影响质心的计算，从而影响整体聚类效果。

### 适用场景

- **市场分析**：用于客户细分，以更好地制定营销策略。
- **图像压缩**：在图像处理中，对图像像素进行聚类可以减少颜色数量，实现压缩。

### 实际案例演示

**案例**：客户细分分析。

假设我们有一个客户数据集，包括客户的年龄和收入，目标是分类客户以制定不同的市场营销策略。

**模拟代码**：

```python
# 使用以上生成的数据df
# K-Means 聚类，k = 4
kmeans = KMeans(n_clusters=4, random_state=42)
df['Cluster'] = kmeans.fit_predict(df)

# 评估聚类效果
from sklearn.metrics import silhouette_score

silhouette_avg = silhouette_score(df[['Annual Income (k$)', 'Spending Score (1-100)']], df['Cluster'])
print(f'Silhouette Score: {silhouette_avg}')
```

## K-Means 算法的改进

### K-Means++算法

K-Means++ 是 K-Means 的一种改进算法，旨在通过智能选择初始质心来提高聚类效果。其核心思想是在选择下一个质心时，优先选择距离现有质心较远的数据点，从而提高初始质心的分散度。

### Mini-Batch K-Means

Mini-Batch K-Means 是一个针对大规模数据集的变种，通过从数据集中随机抽取小批量样本进行训练，大幅提升计算效率。

### 实际案例演示

**案例**：在大型客户数据集上实施 Mini-Batch K-Means。假设我们有数百万条客户记录，我们可以使用 Mini-Batch K-Means 进行聚类。

**模拟代码**：

```python
from sklearn.cluster import MiniBatchKMeans

# 生成大量随机数据
large_data = np.random.rand(1000000, 2)

# Mini-Batch K-Means 聚类
batch_size = 500
kmeans = MiniBatchKMeans(n_clusters=5, batch_size=batch_size, random_state=42)
kmeans.fit(large_data)

# 显示聚类中心
print(kmeans.cluster_centers_)
```

### K-Means 在大规模数据集上的应用

- **分布式 K-Means**：在处理大规模数据时，单机 K-Means 可能效率低下，因此需要分布式计算。可以使用 Apache Spark 等框架来实现分布式 K-Means。
- **增量 K-Means**：随着新数据的不断生成，传统的 K-Means 可能需要重新训练。增量 K-Means 可以通过迭代更新质心来高效处理动态数据。

### K-Means 的多粒度聚类

- **层次 K-Means**：结合层次聚类的思想，首先进行粗粒度的 K-Means 聚类，再对每个簇进行细粒度的 K-Means 处理，以实现多层次的数据分析。

### K-Means 的评估方法

- **聚类质量评估**：不同于分类问题，聚类的准确性难以直接评估。可以探讨使用轮廓系数、Davies-Bouldin 指数等不同的评估标准来衡量聚类结果。

### K-Means 和其他算法结合

- **与聚类算法结合**：如 K-Means 与谱聚类、DBSCAN 等其他聚类算法的组合，以克服单一算法的劣势。

### 增量 K-Means 模拟代码

以下是一个示例，演示如何实现增量 K-Means。我们将不断添加新数据点，并逐步更新质心。

**示例**

- 使用初始数据训练 K-Means。
- 添加新数据点并更新聚类。

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans

# 创建初始数据
np.random.seed(42)
initial_data = np.random.rand(20, 2)  # 初始的 20 个数据点
k = 3  # 选择 3 个簇
kmeans = KMeans(n_clusters=k, random_state=42)
kmeans.fit(initial_data)

# 可视化初始聚类结果
plt.scatter(initial_data[:, 0], initial_data[:, 1], c=kmeans.labels_, cmap='viridis')
plt.scatter(kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1], s=300, c='red', label='Centroids')
plt.title('Initial K-Means Clustering')
plt.xlabel('Feature 1')
plt.ylabel('Feature 2')
plt.legend()
plt.show()

# 增量添加新数据点
new_data_points = np.random.rand(10, 2)  # 生成 10 个新数据点
all_data = np.vstack((initial_data, new_data_points))  # 合并初始数据和新数据

# 重新训练 K-Means (可以用增量方式更新质心，但这里我们重新训练)
kmeans = KMeans(n_clusters=k, random_state=42)
kmeans.fit(all_data)

# 可视化更新后的聚类结果
plt.scatter(all_data[:, 0], all_data[:, 1], c=kmeans.labels_, cmap='viridis')
plt.scatter(kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1], s=300, c='red', label='Centroids')
plt.title('Updated K-Means Clustering After Increment')
plt.xlabel('Feature 1')
plt.ylabel('Feature 2')
plt.legend()
plt.show()
```

**解释代码**

- **初始数据生成**：使用 `numpy` 生成 20 个随机数据点，并用 K-Means 进行初始聚类。
- **聚类结果可视化**：用散点图展示初始的聚类和质心位置。
- **增量添加新数据**：生成 10 个新数据点，并将它们与初始数据合并。
- **重新训练 K-Means**：对合并后的所有数据重新训练 K-Means，计算新的质心。
- **更新后的聚类结果可视化**：再次用散点图展示更新后的聚类结果和新质心。

## K-Means 聚类算法与 Embedding Model

K-Means 聚类算法与嵌入模型（Embedding Model）之间的关系主要体现在以下几个方面：

### 关系原理

- **数据表示**：嵌入模型通过将高维离散数据（如单词、图像等）映射到低维连续向量空间中，这样的数据表示能够捕捉对象之间的语义关系。例如，在自然语言处理中，词嵌入将词汇表示为向量，从而使相似词在向量空间中距离较近。
- **聚类基础**：一旦数据被嵌入模型转化为向量，K-Means 聚类算法就可以对这些向量进行聚类，寻找数据的结构和模式。通过对嵌入向量进行 K-Means 聚类，可以将相似的对象分到同一组，从而实现文本分类、图像识别等任务。

### 应用实例

- **文本聚类**：对文本数据进行嵌入（如使用 Word2Vec 或 BERT），再使用 K-Means 聚类算法将相似的文档聚为一类，方便进行主题分析。
- **图像分类**：将图像嵌入到向量空间后，可以使用 K-Means 进行图像的无监督分类，识别不同种类的图像。

### 代码模拟实现

以下是一个示例，演示如何使用词嵌入模型和 K-Means 算法对文本数据进行聚类。

**示例**：

- 使用 `Word2Vec` 创建词嵌入
- 聚类文本数据

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from gensim.models import Word2Vec
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA

# 示例文本数据
documents = [
    "I love machine learning",
    "Deep learning is a part of machine learning",
    "I enjoy playing football",
    "Football is a great sport",
    "Natural language processing is fascinating",
    "I like to explore natural language processing",
]

# 预处理数据
sentences = [doc.lower().split() for doc in documents]

# 创建 Word2Vec 模型
model = Word2Vec(sentences, vector_size=20, window=2, min_count=1, workers=4)

# 获取文档的向量表示
def document_vector(doc):
    # 计算文档中所有词的向量平均值
    return np.mean([model.wv[word] for word in doc if word in model.wv], axis=0)

# 转换每个文档为向量
doc_vectors = np.array([document_vector(doc) for doc in sentences])

# 使用 K-Means 聚类
k = 2  # 选择 K 值
kmeans = KMeans(n_clusters=k, random_state=42)
kmeans.fit(doc_vectors)

# 获取聚类结果
clusters = kmeans.labels_

# 可视化结果
pca = PCA(n_components=2).fit_transform(doc_vectors)
plt.scatter(pca[:, 0], pca[:, 1], c=clusters, cmap='viridis')

# 标注文本
for i, doc in enumerate(documents):
    plt.annotate(doc, (pca[i, 0], pca[i, 1]))

plt.title('K-Means Clustering of Documents')
plt.xlabel('PCA Component 1')
plt.ylabel('PCA Component 2')
plt.show()

# 展示聚类结果
clustered_docs = pd.DataFrame({'Document': documents, 'Cluster': clusters})
print(clustered_docs)
```

解释代码

- **数据准备**：我们定义了一些示例文本，并将其分割为单词列表。
- **Word2Vec 模型**：使用 `gensim` 库的 `Word2Vec` 来创建词嵌入。通过选择合适的参数（如窗口大小和向量维度），我们能够有效地捕捉词语之间的语义关系。
- **文档向量化**：对于每个文档，通过计算其对应词向量的平均值来得到文档的向量表示。
- **K-Means 聚类**：选择 K 值并使用 K-Means 算法对这些文档的向量进行聚类，获取每个文档的分类结果。
- **可视化**：利用 PCA 降维对文档向量进行可视化，并在图中标注原始文本，以便观察相似文档的聚类。

## K-Means 聚类算法与向量数据库

K-Means 聚类算法与向量数据库之间的关系主要在于如何存储、检索和处理高维数据。向量数据库专门用于存储和查询嵌入向量（例如，文本、图像、音频等的向量表示），而 K-Means 聚类则用于将这些高维数据进行分类和组织。

### 关系原理

- **高维数据管理**：向量数据库将数据存储为高维向量，方便快速检索、查询和相似度计算。K-Means 聚类算法可以利用这些向量，将数据分为不同的簇，从而实现基于相似度的查询和分析。
- **加速检索**：在向量数据库中，K-Means 聚类可以用于建立索引，快速获取特定类型或相似数据项。例如，通过将相似数据归为同一簇，可以在查询时减少要处理的数据量。

### 应用实例

- **图像搜索**：假设我们继续使用图像向量，当用户上传一张图像时，系统可以通过 K-Means 聚类算法在前期处理数据中找到最相似的图像，快速返回相关搜索结果。
- **推荐系统**：在推荐平台中，可以通过 K-Means 来对用户行为或物品特征进行聚类，从而提升个性化推荐的准确性和效率。

### 代码模拟实现

以下是一个示例，演示如何使用 K-Means 和向量数据库进行图像聚类（假设使用预训练的卷积神经网络来获得图像特征向量）。

**示例**

- 生成图像向量（模拟）。
- 使用 K-Means 进行聚类。
- 检索相似图像。

为简便起见，以下代码模拟生成图像向量并使用 K-Means 进行聚类。

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs

# 模拟图像特征向量
# 这里我们用 make_blobs 来生成模拟特征数据
num_images = 100
num_features = 5  # 模拟的特征维度
X, _ = make_blobs(n_samples=num_images, centers=5, n_features=num_features, random_state=42)

# 使用 K-Means 聚类
k = 5  # 假设我们要分成 5 个簇
kmeans = KMeans(n_clusters=k, random_state=42)
kmeans.fit(X)

# 获取聚类结果
clusters = kmeans.labels_

# 可视化聚类结果
plt.scatter(X[:, 0], X[:, 1], c=clusters, cmap='viridis')
plt.scatter(kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1], s=300, c='red', label='Centroids')
plt.title('K-Means Clustering of Image Features')
plt.xlabel('Feature 1')
plt.ylabel('Feature 2')
plt.legend()
plt.show()

# 假设我们有图像 ID 对应于每个样本
image_ids = np.arange(num_images)

# 展示聚类结果
clustered_images = {i: [] for i in range(k)}
for img_id, cluster in zip(image_ids, clusters):
    clustered_images[cluster].append(img_id)

for cluster_id, imgs in clustered_images.items():
    print(f"Cluster {cluster_id}: {imgs}")
```

**解释代码**

- **模拟图像特征向量**：使用 `make_blobs` 生成随机数据，以模拟图像的特征向量。真实应用中，您可以使用卷积神经网络提取图像特征。
- **K-Means 聚类**：使用 `KMeans` 算法将这些特征向量聚类。
- **可视化结果**：通过散点图可视化每个簇的分布和质心位置。
- **聚类结果展示**：展示每个聚类的图像 ID，帮助识别同一类的图像。

## 结语

K-Means 聚类算法因其高效性和易用性，已广泛应用于各种领域。K-Means 与嵌入模型结合的使用是有效的无监督学习策略，能够帮助我们在复杂数据集上进行有效的聚类和模式识别。K-Means 聚类算法与向量数据库的结合极大地提升了高维数据的处理能力，让管理员能高效地存储、检索和分析数据。在实际应用中，K-Means 聚类算法广泛用于文本分析、图像处理、推荐系统和其他数据分析领域。

尽管存在对初值敏感性和需预设 K 值等缺点，但通过使用 K-Means++ 和 Mini-Batch K-Means 等改进方案，以及增量 K-Means、分布式处理和多粒度分析等方法，可以在较大范围内提高其适用性，更好地应对复杂和动态数据集等。未来，随着数据科学的发展，K-Means 及其变种将持续扮演重要角色，为各行各业的数据分析提供支持。

---

**PS：感谢每一位志同道合者的阅读，欢迎关注、点赞、评论！**
