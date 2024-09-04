---
id: python-elegant-programming-4
sidebar_position: 26
title: Python 优雅编程：会报恩的代码（四）
description: Python 优雅编程：会报恩的代码（四）
last_update:
  author: Aurelius
  date: 2024-09-05
tags:
  - Python
  - 优雅编程
  - 神来一码
  - 报恩的代码
---

## 引言

在 Python 编程中，有一些常用技巧和最佳实践可以帮助你编写更优雅、更高效的代码。本文将介绍的是 Python 中 `urllib.parse.quote_plus` 的 URL 编码作用、判断指定路径的文件是否存在、`imaplib` 与 `smtplib` 的收发邮件、使用 `matplotlib` 绘制人工神经网络拓扑图、使用 `Keras` 构建卷积神经网络（CNN）等。

![Cover](<assets/Python 优雅编程：会报恩的代码（四）.drawio.png>)

## urllib.parse.quote_plus

在 Python 中连接 Redis 时，可以使用 `urllib.parse.quote_plus` 方法对密码进行 URL 编码，然后将其拼接到连接信息中。这样可以确保密码中的特殊字符被正确处理。

以下是一个示例代码，说明如何将密码进行编码并连接 Redis：

```python
import redis
from urllib.parse import quote_plus

# 假设你有一个包含特殊字符的密码
password = "my#secret@password"
# 使用 quote_plus 对密码进行编码
encoded_password = quote_plus(password)

# 创建 Redis 连接
redis_url = f"redis://username:{encoded_password}@localhost:6379/0"
redis_client = redis.from_url(redis_url)

# 现在可以使用 redis_client 进行操作
```

此方法将特殊字符（如 `#` 和 `@`）转换为可以安全地包含在 URL 中的格式，从而避免连接错误。

确保在使用后对密码进行解码，而不是直接使用 URL 中的编码版本。

## 判断指定路径的文件是否存在

在 Python 中，可以使用 `os.path` 模块或 `pathlib` 模块来判断指定路径的文件是否存在。下面分别介绍这两种方法。

### 方法 1：使用 `os.path` 模块

```python
import os

# 指定要检查的文件路径
file_path = 'your_file_path.txt'

# 判断文件是否存在
if os.path.isfile(file_path):
    print(f"文件 {file_path} 存在。")
else:
    print(f"文件 {file_path} 不存在。")
```

- `os.path.isfile(file_path)`：检查指定路径是否为一个文件，并且该文件存在。如果存在返回 `True`，否则返回 `False`。

### 方法 2：使用 `pathlib` 模块

```python
from pathlib import Path

# 指定要检查的文件路径
file_path = Path('your_file_path.txt')

# 判断文件是否存在
if file_path.is_file():
    print(f"文件 {file_path} 存在。")
else:
    print(f"文件 {file_path} 不存在。")
```

- `Path(file_path).is_file()`：同样可以检查指定路径是否为一个文件，并且该文件存在。

### 选择方式

- `os.path` 是传统的方式，适用于较旧的 Python 版本（Python 2 和 3 均可使用）。
- `pathlib` 是较新的方法，推荐使用，因为它提供了更为面向对象的 API，使路径的操作更为直观和简洁。

### 总结

无论你选择使用哪个模块，上述两种方法都能够有效地判断指定路径的文件是否存在。你可以根据实际需要和喜好选择其中一种。

## imaplib 和 smtplib

要在 Python 中实现使用 Google 邮箱（Gmail）进行邮件的收发，你可以使用 `smtplib` 模块来发送邮件，以及 `imaplib` 模块来接收邮件。以下是基本的实现步骤：

### 发送邮件

1. **安装必要的库**：

   ```bash
   pip install secure-smtplib
   ```

2. **发送邮件的代码**：

   ```python
   import smtplib
   from email.mime.text import MIMEText
   from email.mime.multipart import MIMEMultipart

   def send_email(subject, body, to_email):
       from_email = "你的邮箱@gmail.com"
       password = "你的应用专用密码"

       # 创建邮件
       msg = MIMEMultipart()
       msg['From'] = from_email
       msg['To'] = to_email
       msg['Subject'] = subject

       msg.attach(MIMEText(body, 'plain'))

       try:
           # 登录并发送邮件
           server = smtplib.SMTP('smtp.gmail.com', 587)
           server.starttls()  # 开始TLS加密
           server.login(from_email, password)
           server.sendmail(from_email, to_email, msg.as_string())
           print("邮件发送成功")
       except Exception as e:
           print(f"邮件发送失败: {e}")
       finally:
           server.quit()

   # 示例调用
   send_email("测试邮件", "这是邮件正文", "收件人邮箱@gmail.com")
   ```

### 接收邮件

1. **安装必要的库**：

   ```bash
   pip install imaplib2
   ```

2. **接收邮件的代码**：

   ```python
   import imaplib
   import email

   def read_email():
       email_user = '你的邮箱@gmail.com'
       password = '你的应用专用密码'
       mail = imaplib.IMAP4_SSL('imap.gmail.com')
       mail.login(email_user, password)
       mail.select('inbox')

       # 搜索所有邮件
       result, data = mail.search(None, 'ALL')
       mail_ids = data[0].split()

       # 读取最新一封邮件
       latest_email_id = mail_ids[-1]

       # 获取邮件
       result, msg_data = mail.fetch(latest_email_id, '(RFC822)')
       raw_email = msg_data[0][1]

       # 解码邮件
       msg = email.message_from_bytes(raw_email)
       subject = msg['subject']
       from_ = msg['from']
       print(f'发件人: {from_}')
       print(f'主题: {subject}')

       mail.logout()

   # 示例调用
   read_email()
   ```

### 注意事项

1. **启用两步验证**：如果你已经启用了 Gmail 的两步验证，请使用应用专用密码，而不是你的账户密码。

2. **权限设置**：确保你在 Gmail 设置中允许“低安全性应用访问”或使用 OAuth 2.0 进行身份验证。

3. **代码安全性**：在生产环境中，切勿将密码硬编码在代码中，使用环境变量或密钥管理工具。

通过上述代码，你可以实现 Gmail 邮箱的基本邮件收发功能。根据具体需求，你可以进一步扩展和优化。

## 使用 matplotlib 绘制人工神经网络拓扑图

要用 Python 绘制一个简单的人工神经网络，可以使用`matplotlib`和`numpy`库。以下是一个示例代码，展示如何绘制一个包含输入层、隐藏层和输出层的神经网络。

### 1. 安装必要的库

如果你还没有安装这些库，可以使用以下命令：

```bash
pip install matplotlib numpy
```

### 2. 画神经网络的代码

```python
import matplotlib.pyplot as plt
import numpy as np

def draw_neural_network():
    # 设置图形和轴
    plt.figure(figsize=(8, 6))

    # 网络参数
    layers = [3, 5, 2]  # 输入层3个神经元，隐藏层5个神经元，输出层2个神经元
    n_layers = len(layers)

    # 绘制神经元
    for n, layer in enumerate(layers):
        for m in range(layer):
            circle = plt.Circle((n, m * 1.5), 0.1, color='skyblue', ec='black')
            plt.gca().add_artist(circle)
            plt.text(n, m * 1.5, f'Neuron {m+1}', fontsize=9, ha='center', va='center')

    # 绘制连接线
    for n in range(n_layers - 1):
        for m in range(layers[n]):
            for k in range(layers[n + 1]):
                plt.plot([n, n + 1], [m * 1.5, k * 1.5 + (1.5 if n == 0 else 0)], color='gray', alpha=0.5)

    # 设置坐标轴范围和隐藏坐标轴
    plt.xlim(-0.5, n_layers - 0.5)
    plt.ylim(-1, max(layers) * 1.5)
    plt.axis('off')
    plt.title('Simple Neural Network')
    plt.show()

# 示例调用
draw_neural_network()
```

### 3. 代码说明

- **layers**: 设定神经网络的层次结构，这里包括 3 个输入神经元、5 个隐藏神经元和 2 个输出神经元。
- **绘制神经元**: 使用`Circle`绘制每个神经元，并在其中心标注。
- **绘制连接线**: 使用`plot`绘制神经元之间的连接，表示层与层之间的权重连接。
- **设置坐标系**: 隐藏坐标轴并设置合适的范围，使图形更加美观。

### 4. 运行代码

运行此代码后，你会看到一个简单的人工神经网络的可视化图形。这可以帮助理解神经网络的结构。你可以根据需要调整输入、隐藏和输出层的神经元数量。

## 使用 `Keras` 构建卷积神经网络（CNN）

```python
from keras.models import Sequential
from keras.layers import Conv2D, MaxPooling2D, Flatten, Dense

# 构建模型
model = Sequential()
model.add(Conv2D(32, (3, 3), activation='relu', input_shape=(64, 64, 3)))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Flatten())
model.add(Dense(units=128, activation='relu'))
model.add(Dense(units=10, activation='softmax'))

# 编译模型
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
```

这段代码使用 Keras 库构建了一个卷积神经网络（CNN）。下面是对代码的逐行解释：

### 1. 导入库

```python
from keras.models import Sequential
from keras.layers import Conv2D, MaxPooling2D, Flatten, Dense
```

- `Sequential`：用于按顺序构建模型的 Keras 类。
- `Conv2D`：卷积层，用于提取图像特征。
- `MaxPooling2D`：池化层，用于降低特征图的尺寸，减少计算量。
- `Flatten`：将多维输入展平为一维数组，便于连接到全连接层。
- `Dense`：全连接层，用于完成分类等任务。

### 2. 构建模型

```python
model = Sequential()
```

- 创建一个顺序模型实例。

### 3. 添加卷积层

```python
model.add(Conv2D(32, (3, 3), activation='relu', input_shape=(64, 64, 3)))
```

- `Conv2D(32, (3, 3), ...)`：添加一个卷积层，使用 32 个过滤器，每个过滤器的大小为 3x3。
- `activation='relu'`：使用 ReLU 激活函数，使非线性特性增强。
- `input_shape=(64, 64, 3)`：输入图像的形状为 64x64 像素，3 个通道（RGB 图像）。

### 4. 添加池化层

```python
model.add(MaxPooling2D(pool_size=(2, 2)))
```

- `MaxPooling2D(pool_size=(2, 2))`：添加一个 2x2 的池化层，用于减小特征图的尺寸，从而减少计算量和降低过拟合风险。

### 5. 展平层

```python
model.add(Flatten())
```

- `Flatten()`：将卷积和池化层的输出展平成一维数组，为全连接层做好准备。

### 6. 添加全连接层

```python
model.add(Dense(units=128, activation='relu'))
```

- `Dense(units=128, activation='relu')`：添加一个全连接层，包含 128 个神经元，使用 ReLU 激活函数。

### 7. 添加输出层

```python
model.add(Dense(units=10, activation='softmax'))
```

- `Dense(units=10, activation='softmax')`：添加一个输出层，包含 10 个神经元（适用于处理 10 个类别），使用 Softmax 激活函数将输出转换为概率分布。

### 8. 编译模型

```python
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
```

- `optimizer='adam'`：使用 Adam 优化器，自动调整学习率，适合大多数情况。
- `loss='categorical_crossentropy'`：使用分类交叉熵损失函数，适用于多类别分类任务。
- `metrics=['accuracy']`：设置评估指标为准确率，以便在训练和测试时监测模型表现。

### 总结

这段代码构建了一个简单的卷积神经网络，适用于图像分类任务。模型首先通过卷积层提取特征，然后使用池化减小特征尺寸，最后通过全连接层输出分类结果。

---

**PS：感谢每一位志同道合者的阅读，欢迎关注、点赞、评论！**
