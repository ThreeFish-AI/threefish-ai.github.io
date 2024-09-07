---
id: django-orm-and-sqlalchemy
sidebar_position: 7
title: ORM｜Django vs. SQLAlchemy
description: Python ORM 最佳实践：Django ORM vs. SQLAlchemy
last_update:
  author: Aurelius
  date: 2024-08-24
tags:
  - Python
  - Django ORM
  - SQLAlchemy
  - ORM
  - 最佳实践
---

在 Python 开发中，Django ORM 和 SQLAlchemy 是两种流行的数据库交互工具。二者各有千秋，适用于不同场景，使得开发团队在选择时需根据项目需求、团队技能和整体架构权衡各自的优劣。究竟在什么条件下选择 Django ORM 或 SQLAlchemy？它们在基本特点、核心技术原理、基本使用等方面又有何不同？接下来我们将深入探讨这两大 ORM 框架的最佳实践，以及如何选择适合的解决方案。

![Cover](<assets/Python ORM 最佳实践：Django ORM vs. SQLAlchemy.drawio.png>)

## Django ORM vs. SQLAlchemy

### Django ORM

Django ORM 基于 Django 框架构建，专为快速开发而设计。其核心特点包括：

- **高度集成**：Django ORM 与 Django 框架无缝集成，开发者能迅速搭建全栈应用。
- **自动化迁移**：通过模型更改自动生成迁移文件，简化了数据库更改。
- **强大的查询 API**：提供了丰富的查询方法，便于构建复杂的查询。

**示例：快速原型开发**

假设我们正在开发一个简单的博客应用，首先定义模型如下：

```python
# models.py
from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
```

使用 Django ORM，我们可以快速创建和迁移数据库：

```bash
python manage.py makemigrations
python manage.py migrate
```

在获取数据时，可以用 QuerySet API：

```python
# 获取所有博客文章
posts = Post.objects.all()

# 根据标题过滤
filtered_posts = Post.objects.filter(title__icontains='Django')
```

这种设计使得在快速迭代时，可以直接在模型中进行更改，然后使用命令行工具快速更新数据库。

Django ORM 的最大优势在于其简洁性和速度。对于小型应用或 MVP 项目，开发团队能够在较短的时间内实现完整的功能，从而迅速验证商业假设。

### SQLAlchemy

SQLAlchemy 是一个独立于框架的 ORM 解决方案，提供了更高的灵活性和丰富的功能。其核心特点包括：

- **灵活的架构**：可选择只使用核心 SQL 功能或完整的 ORM。
- **复杂查询构建**：支持使用 SQLAlchemy 的表达式语言构建复杂 SQL 查询。
- **多种数据库支持**：轻松应对不同数据库管理系统。

**示例：电商系统的数据管理**

假设我们正在构建一个电商平台，需要处理产品和订单。我们首先定义模型：

```python
# models.py
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class Product(Base):
    __tablename__ = 'products'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    price = Column(Integer)

class Order(Base):
    __tablename__ = 'orders'
    id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey('products.id'))
    product = relationship("Product")

# 创建数据库引擎
engine = create_engine('sqlite:///ecommerce.db')
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()
```

我们可以灵活地进行复杂查询，比如获取所有价格大于 100 的产品：

```python
expensive_products = session.query(Product).filter(Product.price > 100).all()
```

SQLAlchemy 的灵活性使其适合处理需要复杂 SQL 逻辑的应用。它允许开发者深入定制操作，处理复杂的关系映射，而不仅局限于简单的 CRUD 操作。

### 技术选型

选择合适的 ORM 框架时，开发团队需综合考虑项目的规模与复杂度。以下是一些关键评估点：

- **项目规模**：对于较小或中等规模的项目，Django ORM 可能更具优势；对于大型项目或复杂数据库操作，SQLAlchemy 更为合适。
- **团队技术栈**：团队的经验和熟悉度也很重要，如果团队熟悉 Django，Django ORM 是个自然的选择；如果团队善善于操作 SQL，并熟悉数据库设计，SQLAlchemy 将大大增强开发的灵活性。
- **维护能力**：考虑未来维护的便利性，Django ORM 提供的自动迁移和管理界面可以减少维护成本，而 SQLAlchemy 则要求开发者更多地参与底层实现。

假设一家初创公司正在开发一款新的社交媒体平台。初期需要快速推出一个 MVP，验证市场需求。此时，选择 Django ORM 将使得他们在时间上具有更大的优势。

随着用户量的增长和功能的扩展，复杂度逐渐提升。此时若遇到数据查询性能问题，SQLAlchemy 可能将成为更优的选择。此外，团队可以通过逐步替换或重构，逐步迁移到 SQLAlchemy，从而实现转型。

## 性能分析

在高流量和数据密集型应用中，性能是一个至关重要的考虑因素。Django ORM 和 SQLAlchemy 在性能上的表现如何？如何通过优化提高性能，以满足业务需求？

### 懒加载和急加载

- **Django ORM**：使用 `select_related()` 和 `prefetch_related()` 实现急加载。
- **SQLAlchemy**：支持 eager loading 和 lazy loading，可以使用 `joinedload()` 或 `subqueryload()`。

### 查询优化

- **索引和数据库结构**：创建索引可以有效提高查询性能，尤其是在条件查询时。两者均支持数据库层面的索引。
- **使用原生 SQL 查询可以优化复杂查询**：Django ORM 提供 `raw()` 方法，而 SQLAlchemy 允许直接创建自定义 SQL 查询。

### 示例：产品关联订单查询

假设我们在电商网站上，查询所有价格高于某一阈值的产品，并且也希望知道每个产品相关的订单信息。

- **Django ORM 示例**：

```python
# models.py
class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)

class Order(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
```

```python
# 查询所有价格高于100的产品，同时获取相关订单
expensive_products = Product.objects.filter(price__gt=100).prefetch_related('order_set')
```

- **SQLAlchemy 示例**：

```python
# 添加SQLAlchemy配置
from sqlalchemy.orm import aliased

Products = aliased(Product)
Orders = aliased(Order)

r = session.query(Products).filter(Products.price > 100).options(subqueryload(Orders)).all()
```

通过使用 `prefetch_related()` 和 `subqueryload()`，我们能有效减少数据库的查询次数，提高性能。

### 示例：产品销量分析

假设我们在一个大型电商平台上，已增加了大量产品，如何快速分析哪些产品销量好且价格合适？

- **Django ORM**：

在 Django 中，我们可以创建一个视图，用于根据销量和价格统计产品：

```python
# views.py
from django.shortcuts import render

def product_analysis(request):
    products = Product.objects.filter(order__quantity__gte=1)\
                              .annotate(total_sales=Sum('order__quantity'))\
                              .order_by('-total_sales')
    return render(request, 'product_analysis.html', {'products': products})
```

- **SQLAlchemy**：

```python
# 创建分析视图
result = session.query(Product).outerjoin(Order)\
    .group_by(Product.id)\
    .having(func.sum(Order.quantity) >= 1)\
    .order_by(func.sum(Order.quantity).desc()).all()
```

这样的实现为决策提供了数据支持。

## 迁移与版本控制

在项目的生命周期中，数据库模式的更改是不可避免的。如何管理这些更改，并确保不同环境中数据库模式的一致性呢？

### 关键点

- **Django ORM**：Django 提供了 `makemigrations` 和 `migrate` 命令，开发者只需定义模型，执行命令来保持数据库模式与模型的一致性。
- **SQLAlchemy**：使用 Alembic 作为迁移工具，支持版本控制和多环境迁移。

### 迁移流程

创建一个产品类并进行迁移：

**Django ORM**：

```bash
# 制作迁移：
python manage.py makemigrations
# 执行迁移：
python manage.py migrate
```

**SQLAlchemy + Alembic**：

创建初始迁移文件：

```bash
alembic init alembic
```

生成迁移：

```bash
alembic revision --autogenerate -m "initial migration"
```

应用迁移：

```bash
alembic upgrade head
```

在这些过程中，Alembic 会记录所有迁移的版本信息。

### 示例：新增产品描述字段

假设我们的电商平台需要新增产品描述字段。在实施前，我们应确保所有环境中都恢复到一致的数据库状态。

- **Django ORM**：

```python
# models.py 更新后的字段
class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(null=True)  # 新增字段
```

调用迁移：

```bash
python manage.py makemigrations
python manage.py migrate
```

- **SQLAlchemy + Alembic**：

```python
# 更新模型
class Product(Base):
    __tablename__ = 'products'
    # ... 现有字段 ...
    description = Column(Text, nullable=True)  # 新增字段
```

生成和应用迁移：

```bash
alembic revision --autogenerate -m "Add description field to Product"
alembic upgrade head
```

### 示例：用户表新增 email 字段

假设我们要在现有的用户表中新增一个字段。

- **Django ORM 示例**：

```bash
# 添加新字段到 models.py
class User(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(120)])
    email = models.EmailField(null=True)  # 新增字段

# 生成迁移
python manage.py makemigrations
python manage.py migrate
```

- **SQLAlchemy + Alembic 示例**：

```python
# 添加字段到模型
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    age = Column(Integer)
    email = Column(String)  # 新增字段

# 生成迁移
alembic revision --autogenerate -m "Add email field to User"
alembic upgrade head
```

通过这些步骤，我们将新字段顺利添加到数据库中。

对于一个用户管理系统，当我们需要不断扩展用户的属性时，迁移系统可以帮助我们保持更新，以及在生产环境中实现平滑过渡。

- **Django ORM**：

```python
# 使用 Djnago 在用户管理视图中显示邮箱
def user_list(request):
    users = User.objects.all()
    return render(request, 'user_list.html', {'users': users})
```

- **SQLAlchemy**：

```python
@app.route('/users')
def user_list():
    users = session.query(User).all()
    return render_template('user_list.html', users=users)
```

## 事务管理与并发控制

在高并发的环境中，如何管理事务和保证数据的完整性？事务的管理机制是 ORM 设计的重要部分。

### 关键点

- **Django ORM**：通过 `atomic()` 实现数据库事务，即使有异常，也能保证数据的一致性。
- **SQLAlchemy**：通过 `session.commit()` 和 `session.rollback()` 管理事务，同时支持更细粒度的控制。

### 示例：电商下单

在电商中，当用户下单处理库存时，需保证数据库的操作完整性。利用事务管理：

**Django ORM**：

```python
from django.db import transaction

@transaction.atomic
def place_order(product_id, quantity):
    product = Product.objects.get(id=product_id)
    if product.stock >= quantity:
        product.stock -= quantity
        product.save()
        Order.objects.create(product=product, quantity=quantity)
    else:
        raise ValueError("Not enough stock")
```

**SQLAlchemy**：

```python
from sqlalchemy.orm import sessionmaker

Session = sessionmaker(bind=engine)
session = Session()

try:
    with session.begin():
        product = session.query(Product).get(product_id)
        if product.stock >= quantity:
            product.stock -= quantity
            order = Order(product_id=product_id, quantity=quantity)
            session.add(order)
        else:
            raise ValueError("Not enough stock")
except Exception as e:
    session.rollback()
    print("Error occurred:", e)
```

在电商环境中，使用上述事务管理确保顺利下单：

- **Django ORM**：

```python
# 视图函数处理
def buy_product(request, product_id):
    try:
        place_order(product_id, request.POST['quantity'])
        return HttpResponse("Order placed successfully!")
    except ValueError as e:
        return HttpResponse(str(e))
```

- **SQLAlchemy**：

```python
@app.route('/buy/<int:product_id>', methods=['POST'])
def buy_product(product_id):
    quantity = request.form['quantity']
    try:
        place_order(product_id, quantity)
        return "Order placed successfully!"
    except ValueError as e:
        return str(e)
```

## 数据验证与清洗

数据验证和清洗是确保数据质量的重要环节。两种 ORM 框架都提供了一些工具来帮助开发者验证数据的有效性。

### 关键点

- **Django ORM**：Django 自带的模型定义可以直接使用字段选项来进行基本验证。例如，`null`, `blank`, `choices`, `validators` 等选项。
- **SQLAlchemy**：通过使用 Python 的内置函数或第三方库（如 Marshmallow 或 Pydantic）来添加数据验证，SQLAlchemy 本身不提供内建验证功能。

### 示例：用户注册数据验证

假设我们需要保存用户数据，包括姓名和年龄，并确保这些数据满足一定条件。

- **Django ORM 示例**：

```python
# models.py
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

class User(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(120)])

    def __str__(self):
        return self.name
```

如果用户提交了无效的年龄，例如负数或超过 120，则 Django 会自动返回一个错误。

- **SQLAlchemy 示例**：

```python
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, validates

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    age = Column(Integer)

    @validates('age')
    def validate_age(self, key, age):
        if age < 0 or age > 120:
            raise ValueError("Age must be between 0 and 120")
        return age

engine = create_engine('sqlite:///users.db')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()
```

在这里，我们使用 `@validates` 装饰器为 `age` 字段添加验证规则。

在用户注册的场景中，我们希望确保用户的年龄在合理范围内。无论使用哪种 ORM，都可以轻松实现。

- **Django ORM**：

```python
# views.py
from django.shortcuts import render
from django.http import HttpResponse
from .models import User

def register(request):
    if request.method == "POST":
        name = request.POST["name"]
        age = request.POST["age"]
        try:
            user = User(name=name, age=age)
            user.save()
            return HttpResponse("User registered successfully!")
        except Exception as e:
            return HttpResponse("Registration failed: " + str(e))
```

- **SQLAlchemy**：

```python
@app.route('/register', methods=['POST'])
def register():
    name = request.form['name']
    age = int(request.form['age'])
    try:
        user = User(name=name, age=age)
        session.add(user)
        session.commit()
        return "User registered successfully!"
    except Exception as e:
        session.rollback()
        return f"Registration failed: {str(e)}"
```

## 缓存机制

在处理高频查询或大型结果集时，缓存机制可显著提高应用性能，减轻数据库负担。

### 关键点

- **Django ORM**：Django 提供了多种缓存方案，可以通过 `cache` 模块一键实现，并与数据库查询集集成。
- **SQLAlchemy**：可以使用外部缓存工具（如 Redis），并通过 SQLAlchemy 扩展实现缓存。

### 示例：产品列表缓存

假设我们有一个产品列表需要频繁展示。

- **Django ORM 示例**：

```python
from django.core.cache import cache
from .models import Product

def product_list_view(request):
    products = cache.get('product_list')
    if not products:
        products = list(Product.objects.all())
        cache.set('product_list', products, timeout=300)  # 缓存 5 分钟
    return render(request, 'product_list.html', {'products': products})
```

- **SQLAlchemy 示例**：

```python
import redis
from sqlalchemy.orm import sessionmaker

# 初始化 Redis
cache = redis.StrictRedis(host='localhost', port=6379, db=0)

def get_products():
    products = cache.get('product_list')
    if not products:
        products = session.query(Product).all()
        cache.set('product_list', products, ex=300)  # 缓存 5 分钟
    return products
```

在高流量的电商网站中，产品列表是一个高频访问的页面。使用缓存机制可以有效提升用户体验。

- **Django ORM**：

```python
# 更新产品列表视图
def product_list_view(request):
    products = cache.get('product_list')
    if not products:
        products = list(Product.objects.all())
        cache.set('product_list', products, timeout=300)
    return render(request, 'product_list.html', {'products': products})
```

- **SQLAlchemy**：

```python
@app.route('/products')
def products_view():
    products = get_products()
    return render_template('product_list.html', products=products)
```

## 结语

选择合适的 ORM 是提升开发效率、缩短项目周期的重要策略，开发团队应当对此进行充分的思考与评估。

Django ORM 与 SQLAlchemy 无论是在性能优化、版本控制、事务管理、数据验证与清洗、以及缓存机制，还是在复杂查询的处理上，都有各自的新颖解法和优势。Django ORM 提供高效、快速的开发体验，适合小型及快速迭代的项目；而 SQLAlchemy 则为开发者提供了强大的查询和操作能力，适合复杂的应用需求。

最终决策应基于实际项目需求、团队能力与业务目标，选择最合适的 ORM 方案，以确保高效、可维护的开发流程。

---

**PS：感谢每一位志同道合者的阅读，欢迎关注、点赞、评论！**
