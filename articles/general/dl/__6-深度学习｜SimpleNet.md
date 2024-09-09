
#### 1. SimpleNet

我们依旧以`手写数字识别`任务为例，实现一个图 2.3.3.1 所示的 `SimpleNet` 用于学习该任务，亲身体验一下神经网络学习识别这些图片所代表数字的过程。

<!-- <div align=center>
    <img src='../images/ann/2.3.3-simple-net-numerals-recognition.png'><br/>
    图 2.3.3.1 用于处理手写数字识别任务的 SimpleNet 神经网络
</div><br/> -->

如图 2.3.3.1 所示，SimpleNet 是一个两层神经网络，它的输入层有 784 个神经元，分别代表 28 $\times$ 28 个像素值，第 1 层隐层有 50 个功能神经元，输出层有 10 个神经元，分别代表预测结果为 0 ~ 9 的概率。

SimpleNet 可以完整演示神经网络学习与推理的类，它包含一个存放权重参数的 params 属性，以及若干用于学习和推理的方法。SimpleNet 的具体代码实现请参见 [runtime/simple-flow/simple_net.py](https://github.com/AfterShip/all-staff-writing-plan.deep-learning-basic/blob/master/runtime/simple-flow/simple_net.py)。

| 变量   | 说明                                                                                                                                                                                                                        |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| params | 存放 SimpleNet 网络权重参数与偏置参数： <br/>&nbsp;&nbsp;W1: 第 1 层网络的权重参数； <br/>&nbsp;&nbsp;b1: 第 1 层网络的偏置参数； <br/>&nbsp;&nbsp;W2: 第 2 层网络的权重参数； <br/>&nbsp;&nbsp;b2: 第 2 层网络的偏置参数。 |

| 方法                                                                                     | 说明                                                                                                                                                                                                                                                                                                                              |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| \_\_init\_\_(self, input_size, <br/>hidden_size, output_size, <br/>weight_init_std=0.01) | SimpleNet 的初始化函数。 <br/>Args: <br/>&nbsp;&nbsp;input_size: 输入层（第 0 层）神经元个数（神经网络入参个数） <br/>&nbsp;&nbsp;hidden_size: 隐藏层（第 1 层）神经元个数 <br/>&nbsp;&nbsp;output_size: 输出层（第 2 层）神经元个数（神经网络出参个数） <br/>&nbsp;&nbsp;weight_init_std: 用于初始化权重参数的高斯分布的标准差。 |
| predict(self, x)                                                                         | 推理函数，识别数字图像代表的数值。                                                                                                                                                                                                                                                                                                |
| loss(self, x, t)                                                                         | 损失函数（交叉熵误差）                                                                                                                                                                                                                                                                                                            |
| accuracy(self, x, t)                                                                     | 精准度函数，求推理正确的百分比。                                                                                                                                                                                                                                                                                                  |
| numerical_gradient(self, x, t)                                                           | 梯度函数（数值微分法）                                                                                                                                                                                                                                                                                                            |
| gradient(self, x, t)                                                                     | 梯度函数（误差逆传播法）                                                                                                                                                                                                                                                                                                          |

#### 2. trainer 模块

有了 SimpleNet 类，我们就可以实现一个用于训练 SimpleNet 的 trainer 模块，我们按照上文所述步骤一一演示（trainer 的代码实现请参见 [runtime/simple-flow/trainer.py](https://github.com/AfterShip/all-staff-writing-plan.deep-learning-basic/blob/master/runtime/simple-flow/trainer.py)）。

1. 使用 SimpleNet 求 mini-batch 的梯度

我们从训练数据集中随机选取 100 张图片作为一个 mini-batch，使用 SimpleNet 求该 mini-batch 的损失函数关于网络当前权重参数的梯度。

- 创建一个 SimpleNet 神经网络，该网络有 784 个输入神经元，50 个隐层神经元，10 个输出神经元。

```python
network = SimpleNet(input_size=784, hidden_size=50, output_size=10)
```

- 加载 MNIST 数据集，并从训练集随机选取长度为 100 的一批样例。

```python
(x_train, t_train), (x_test, t_test) = load_mnist(normalize=True, one_hot_label=True)
train_size = x_train.shape[0]
batch_mask = np.random.choice(train_size, 100)
x_batch = x_train[batch_mask]       # mini-batch-input
t_batch = t_train[batch_mask]       # mini-batch-label
```

- 使用 SimpleNet 求 mini-batch 的梯度。

```python
# 计算梯度：数值微分法
grad = network.numerical_gradient(x_batch, t_batch)
# 计算梯度：BP 算法，更高效，下文将介绍该算法
# grad = network.gradient(x_batch, t_batch)
```

2. 根据梯度更新权重参数

有了梯度，我们就可以使用梯度下降法更新权重参数了。

```python
for key in ('W1', 'b1', 'W2', 'b2'):
    network.params[key] -= learning_rate * grad[key]
```

3. 进行多次重复学习

我们直接重复第 1、2 步 10000 次，记录下每 600 次学习（一轮，理论上 600 次随机 mini-batch 的选取会完成一次全训练集的覆盖，一次全训练集的覆盖被称为一轮学习）时，网络的损失值、网络在训练集和测试集上的识别精度。

```python
iters_num = 10000                                   # 设定迭代次数：让 SimpleNet 对训练集进行 10000 次学习，每次学习随机选取 100 个样例
iter_per_epoch = max(train_size / batch_size, 1)    # 每轮学习的迭代次数 = 训练集长度 / 每批长度

train_loss_list = []                                # 记录学习过程中的损失值
train_acc_list = []                                 # 记录每轮学习后，神经网络在训练集上的识别精度
test_acc_list = []                                  # 记录每轮学习后，神经网络在测试集上的识别精度

for i in range(iters_num):
    # 执行步骤 1
    # 执行步骤 2

    # 记录学习过程中的损失值
    loss = network.loss(x_batch, t_batch)
    train_loss_list.append(loss)

    # 每轮学习记录一次训练数据和测试数据的识别精度
    if i % iter_per_epoch == 0:
        train_acc = network.accuracy(x_train, t_train)
        test_acc = network.accuracy(x_test, t_test)
        train_acc_list.append(train_acc)
        test_acc_list.append(test_acc)
        print(f"train acc, test acc | {str(train_acc)}, {str(test_acc)}")
```

以下是学习过程中输出的训练集和测试集的识别精度。

```sh
(.venv) runtime % python simple-flow/trainer.py
train acc, test acc | 0.09863333333333334, 0.0958
train acc, test acc | 0.7862666666666667, 0.7905
train acc, test acc | 0.8725333333333334, 0.8775
train acc, test acc | 0.8982833333333333, 0.8986
train acc, test acc | 0.9079833333333334, 0.9094
train acc, test acc | 0.9131333333333334, 0.9163
train acc, test acc | 0.9188833333333334, 0.9193
train acc, test acc | 0.92375, 0.9259
train acc, test acc | 0.9282, 0.9301
train acc, test acc | 0.9308166666666666, 0.9322
train acc, test acc | 0.9338666666666666, 0.9346
train acc, test acc | 0.93785, 0.9372
train acc, test acc | 0.93975, 0.9396
train acc, test acc | 0.9421666666666667, 0.9405
train acc, test acc | 0.94385, 0.9422
train acc, test acc | 0.9462166666666667, 0.9451
train acc, test acc | 0.9479333333333333, 0.9462
```

我们将训练过程中训练集和测试集的识别精度绘制成图，如图 2.3.3.2。

<!-- <div align=center>
    <img src='../images/ann/2.3.3-simple-net-training.png' width=550><br/>
    图 2.3.3.2 训练数据和测试数据的识别精度随学习轮次的变化
</div><br/> -->

从结果可以看出，随着学习的进行，训练集和测试集的识别精度很快从不足 10% 提高到了 94% 以上，这说明神经网络在学习过程中，不仅能够识别训练集的图片，还能够识别测试集的图片，即神经网络具有一定的泛化能力。

模型若将一些个例的特征（一般是独属于训练集的）当做普遍特征，即只对训练集过度拟合，这种状态被称为`过拟合`（`over fitting`），避免过拟合是机器学习的一个重要课题。
