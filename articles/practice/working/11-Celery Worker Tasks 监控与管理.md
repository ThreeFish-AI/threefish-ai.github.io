---
id: django-celery-worker-tasks
sidebar_position: 11
title: Django 集成 Celery Worker：状态监控和任务管理
description: Django 集成 Celery Worker：状态监控和任务管理
last_update:
  author: Aurelius
  date: 2024-08-18
tags:
  - Django
  - 集成
  - Celery Worker
  - 状态监控
  - 任务管理
---

下面是一个完整的步骤指南，教你如何通过 Django 安装和配置来管理 Celery 任务，通过 Django Admin 界面提供任务的查询、查看、重试、终止等功能。

### 1. 安装 Django 和相关包

首先，创建一个新的虚拟环境并安装所需的包。

```sh
python -m venv myenv
source myenv/bin/activate  # Windows 系统使用: myenv\Scripts\activate
pip install django django-celery-results django-celery-beat celery
```

### 2. 创建 Django 项目和应用

```sh
django-admin startproject myproject
cd myproject
django-admin startapp myapp
```

### 3. 配置 Django 和 Celery

在你的 `myproject/settings.py` 文件中添加以下内容：

```python
INSTALLED_APPS = [
    ...,
    'django_celery_results',
    'django_celery_beat',
    'myapp',  # 确保你的 app 在这个列表里
]

CELERY_BROKER_URL = 'redis://localhost:6379/0'  # 使用 Redis 作为示例，你可以根据需求更改
CELERY_RESULT_BACKEND = 'django-db'
CELERY_CACHE_BACKEND = 'django-cache'

CELERY_TRACK_STARTED = True
CELERY_SEND_EVENTS = True

# 确保你已经配置了数据库
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# 配置 Django 缓存（可选）
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}
```

在 `myproject` 目录中创建一个 `celery.py` 文件：

```python
from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from django.conf import settings

# 设置 Django 的配置模块
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')

app = Celery('myproject')

# 从 Django 的设置中配置 Celery
app.config_from_object('django.conf:settings', namespace='CELERY')

# 自动发现任务
# app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
```

修改 `myproject/__init__.py` 文件，使得 Django 在启动时加载 Celery：

```python
from __future__ import absolute_import, unicode_literals

# 这将确保当 Django 启动时加载 app.py
from .celery import app as celery_app

__all__ = ('celery_app',)
```

### 4. 创建一个 Celery 任务

在 `myapp/tasks.py` 中创建一个简单的 Celery 任务：

```python
from celery import shared_task

@shared_task
def add(x, y):
    return x + y
```

### 5. 配置 Django Admin 界面管理 Celery 任务

在 `myapp/admin.py` 中配置 Django Admin：

```python
from django.contrib import admin
from django_celery_results.models import TaskResult
from django.urls import path
from django.shortcuts import redirect
from celery.result import AsyncResult
from myproject.celery import app

@admin.register(TaskResult)
class TaskResultAdmin(admin.ModelAdmin):
    list_display = ('task_id', 'status', 'date_done', 'task_name')
    search_fields = ('task_id', 'task_name')
    change_list_template = "admin/celery_task_changelist.html"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('retry/<task_id>/', self.admin_site.admin_view(self.retry_task), name='retry-task'),
            path('terminate/<task_id>/', self.admin_site.admin_view(self.terminate_task), name='terminate-task'),
        ]
        return custom_urls + urls

    def retry_task(self, request, task_id, *args, **kwargs):
        AsyncResult(task_id, app=app).reapply()
        self.message_user(request, f'Task {task_id} retried successfully.')
        return redirect('..')

    def terminate_task(self, request, task_id, *args, **kwargs):
        AsyncResult(task_id, app=app).revoke(terminate=True)
        self.message_user(request, f'Task {task_id} terminated successfully.')
        return redirect('..')
```

### 6. 创建 Django Admin 界面的自定义模板

在你的 Django 项目中创建以下目录结构 `templates/admin` 并在 `admin` 文件夹内创建 `celery_task_changelist.html`：

```html
{% extends "admin/change_list.html" %} {% block result_list %} {{ block.super }}
<script>
  function handleTask(action, task_id) {
    fetch(`/admin/retry/${task_id}/`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': '{{ csrf_token }}',
      },
    }).then((response) => {
      if (response.ok) {
        location.reload();
      } else {
        alert('Action failed.');
      }
    });
  }
</script>
<div>
  <form method="post">
    {% csrf_token %} {% for result in cl.result_list %}
    <button type="button" onclick="handleTask('retry', '{{ result.task_id }}')">
      Retry
    </button>
    <button
      type="button"
      onclick="handleTask('terminate', '{{ result.task_id }}')"
    >
      Terminate
    </button>
    {% endfor %}
  </form>
</div>
{% endblock %}
```

### 7. 运行 Django 和 Celery

应用数据库迁移：

```sh
python manage.py migrate
```

启动 Django 服务器：

```sh
python manage.py runserver
```

启动 Celery worker：

```sh
celery -A myproject worker -l info
```

### 8. 使用 Django Admin 管理 Celery 任务

打开浏览器并访问 `http://127.0.0.1:8000/admin/`，你的 Celery 任务将会在 Django admin 界面中显示，并且可以通过点击按钮来进行查询、查看、重试和终止等操作。

这样你就完成了通过 Django Admin 界面管理 Celery 任务的完整步骤。如有需要可以进一步定制和优化界面和功能。

---

这个异常是因为 `TaskResult` 模型已经被 `django_celery_results` 自动注册到 Django Admin 中了。我们可以通过继承 `django_celery_results` 的 `TaskResultAdmin` 并覆盖的方式来避免重复注册模型。下面是解决办法。

### 1. 取消注册已经注册的 `TaskResult`

我们可以在自定义 `TaskResultAdmin` 之前先取消已经注册的模型。

在 `myapp/admin.py` 中做如下修改：

```python
from django.contrib import admin
from django_celery_results.models import TaskResult
from django_celery_results.admin import TaskResultAdmin as DefaultTaskResultAdmin
from django.urls import path
from django.shortcuts import redirect
from celery.result import AsyncResult
from myproject.celery import app

# 取消已经注册的 TaskResult
admin.site.unregister(TaskResult)

# 创建一个自定义的 TaskResultAdmin 继承自默认的 TaskResultAdmin
class CustomTaskResultAdmin(DefaultTaskResultAdmin):
    change_list_template = "admin/celery_task_changelist.html"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('retry/<task_id>/', self.admin_site.admin_view(self.retry_task), name='retry-task'),
            path('terminate/<task_id>/', self.admin_site.admin_view(self.terminate_task), name='terminate-task'),
        ]
        return custom_urls + urls

    def retry_task(self, request, task_id, *args, **kwargs):
        AsyncResult(task_id, app=app).reapply()
        self.message_user(request, f'Task {task_id} retried successfully.')
        return redirect('..')

    def terminate_task(self, request, task_id, *args, **kwargs):
        AsyncResult(task_id, app=app).revoke(terminate=True)
        self.message_user(request, f'Task {task_id} terminated successfully.')
        return redirect('..')

# 注册自定义的 TaskResultAdmin
admin.site.register(TaskResult, CustomTaskResultAdmin)
```

### 2. 确保自定义模板的位置

确保自定义的模板路径正确。对于默认 Django 项目模板目录，模板文件夹应该在 `myproject/templates/admin/celery_task_changelist.html`。创建模板文件夹（如果它还不存在），并将之前提到的模板文件添加进去：

`myproject/templates/admin/celery_task_changelist.html`：

```html
{% extends "admin/change_list.html" %} {% block result_list %} {{ block.super }}
<script>
  function handleTask(action, task_id) {
    fetch(`/${action}/${task_id}/`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]')
          .value,
      },
    }).then((response) => {
      if (response.ok) {
        location.reload();
      } else {
        alert('Action failed.');
      }
    });
  }
</script>
<div>
  <form method="post">
    {% csrf_token %} {% for result in cl.result_list %}
    <button type="button" onclick="handleTask('retry', '{{ result.task_id }}')">
      Retry
    </button>
    <button
      type="button"
      onclick="handleTask('terminate', '{{ result.task_id }}')"
    >
      Terminate
    </button>
    {% endfor %}
  </form>
</div>
{% endblock %}
```

### 3. 完成其它设置

不用修改原来的配置和任务定义，确保都配置好了。

### 4. 重启服务

在所有更改完成后，按照以下步骤重启 Django 服务和 Celery worker：

```sh
# 重启 Django 开发服务器
python manage.py runserver

# 重启 Celery worker
celery -A myproject worker -l info
```

完成上述步骤后，应该可以顺利地在 Django Admin 界面管理 Celery 任务了，包括查询、查看、重试和终止任务。

---

为了在启动 Celery Worker 后向 Worker 发起任务，并在 Django Admin 界面演示查询、查看、重试和终止任务，可以按以下步骤进行操作：

### 1. 创建 Celery 任务

在 `myapp/tasks.py` 中定义一些示例任务：

```python
# myapp/tasks.py
from celery import shared_task
import time

@shared_task
def add(x, y):
    time.sleep(10)  # 模拟长时间运行的任务
    return x + y

@shared_task
def long_running_task(duration):
    time.sleep(duration)
    return f"Task completed after {duration} seconds"
```

### 2. 创建触发任务的视图

为了便于演示，可以创建一些视图来触发这些任务。更新你的 `urls.py` 和 `views.py` 文件。

#### 在 `myapp/views.py` 中：

```python
# myapp/views.py
from django.http import JsonResponse
from myapp.tasks import add, long_running_task

def trigger_add_task(request):
    add.delay(3, 4)
    return JsonResponse({'status': 'Task add (3, 4) triggered'})

def trigger_long_running_task(request):
    long_running_task.delay(30)  # 任务运行30秒
    return JsonResponse({'status': 'Long running task for 30 seconds triggered'})
```

#### 在 `myapp/urls.py` 中：

```python
# myapp/urls.py
from django.urls import path
from .views import trigger_add_task, trigger_long_running_task

urlpatterns = [
    path('trigger-add-task/', trigger_add_task, name='trigger-add-task'),
    path('trigger-long-task/', trigger_long_running_task, name='trigger-long-task'),
]
```

#### 在 `myproject/urls.py` 中：

```python
# myproject/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('tasks/', include('myapp.urls')),
]
```

### 3. 更新 Celery 配置

确保 `settings.py` 中配置了 Celery：

```python
# myproject/settings.py
CELERY_BROKER_URL = 'redis://localhost:6379/0'  # 使用 Redis 作为示例，你可以根据需求更改
CELERY_RESULT_BACKEND = 'django-db'
```

### 4. 启动 Celery Worker 和 Django 服务器

确保你已经启动了 Redis 服务：

```sh
redis-server
```

然后分别启动 Django 服务器和 Celery Worker：

```sh
# 启动 Django 服务器
python manage.py runserver

# 启动 Celery Worker
celery -A myproject worker -l info
```

### 5. 触发任务并在 Django Admin 界面中查看

打开浏览器并访问以下 URL 以触发任务：

- `http://127.0.0.1:8000/tasks/trigger-add-task/` - 触发增加任务
- `http://127.0.0.1:8000/tasks/trigger-long-task/` - 触发长时间运行任务

通过这些 URL 你将触发 Celery 任务。然后你可以通过 Django Admin 界面进行查询、查看、重试和终止这些任务。

### 6. 在 Django Admin 界面查看任务状态

打开浏览器并访问 `http://127.0.0.1:8000/admin/`，登陆 Django Admin 界面，导航到 `Task Results` 部分。你应该能看到适当的任务列表，并通过你之前在自定义 `TaskResultAdmin` 中定义的操作进行重试和终止任务。

这些步骤将帮助你能够通过 Django 和 Celery 演示触发任务并在 Django Admin 界面中进行查询、查看、重试、终止等操作。希望这能让你的演示更加顺利，看到实时效果。

---

要通过 Django Admin 管理和监控在远程服务器上单独运行且由独立代码仓库维护的 Celery Worker，你需要配置和协调多个独立的系统。下面是分步指南，详细描述如何实现这一目标：

### 1. 配置远程服务器的 Celery Worker

#### 1.1 安装和配置 Celery Worker

在远程服务器上，创建一个独立的项目（假设名字为 `worker_project`），并安装所需的依赖：

```sh
# 在远程服务器上
python -m venv venv
source venv/bin/activate
pip install celery redis
```

#### 1.2 配置 Celery Worker

在 `worker_project` 内部配置 Celery（`worker_project/celery.py`）：

```python
from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# 设置 Django 的配置模块
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'worker_project.settings')

app = Celery('worker_project')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
```

在 `worker_project/settings.py` 中配置 Celery：

```python
CELERY_BROKER_URL = 'redis://your_redis_server:6379/0'  # 替换为实际的 Redis 地址
CELERY_RESULT_BACKEND = 'redis://your_redis_server:6379/0'
```

#### 1.3 定义任务

创建一些测试任务（`worker_project/tasks.py`）：

```python
from celery import shared_task
import time

@shared_task
def add(x, y):
    time.sleep(10)  # 模拟长时间运行的任务
    return x + y

@shared_task
def long_running_task(duration):
    time.sleep(duration)
    return f"Task completed after {duration} seconds"
```

#### 1.4 启动 Celery Worker

```sh
celery -A worker_project worker -l info
```

### 2. 配置本地 Django 项目

#### 2.1 安装所需的依赖

在本地 Django 项目中，安装所需的依赖：

```sh
python -m venv venv
source venv/bin/activate
pip install django django-celery-results django-celery-beat celery redis
```

#### 2.2 配置 Django 和 Celery

在你的本地 Django 项目的 `settings.py` 中配置 Celery：

```python
INSTALLED_APPS = [
    ...,
    'django_celery_results',
    'django_celery_beat',
]

CELERY_BROKER_URL = 'redis://your_redis_server:6379/0'  # 替换为实际的 Redis 地址，与远程服务器一致
CELERY_RESULT_BACKEND = 'redis://your_redis_server:6379/0'
```

创建 `celery.py`（假设项目名为 `myproject`）：

```python
from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')

app = Celery('myproject')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
```

在 `__init__.py` 中确保 Celery 在 Django 启动时加载：

```python
from __future__ import absolute_import, unicode_literals
from .celery import app as celery_app
__all__ = ('celery_app',)
```

#### 2.3 定义触发任务的视图

创建触发任务的视图（`myapp/views.py`）：

```python
from django.http import JsonResponse
from worker_project.tasks import add, long_running_task  # 确保能访问到远程仓库的 shared tasks

def trigger_add_task(request):
    add.delay(3, 4)  # 调用远程 Celery worker 中的任务
    return JsonResponse({'status': 'Task add (3, 4) triggered'})

def trigger_long_running_task(request):
    long_running_task.delay(30)  # 调用远程 Celery worker 中的任务
    return JsonResponse({'status': 'Long running task for 30 seconds triggered'})
```

在 `myapp/urls.py` 中配置 URL：

```python
from django.urls import path
from .views import trigger_add_task, trigger_long_running_task

urlpatterns = [
    path('trigger-add-task/', trigger_add_task, name='trigger-add-task'),
    path('trigger-long-task/', trigger_long_running_task, name='trigger-long-task'),
]
```

### 3. 配置 Django Admin 界面管理 Celery 任务

创建自定义的 `TaskResultAdmin`（`myapp/admin.py`）：

```python
from django.contrib import admin
from django_celery_results.models import TaskResult
from django_celery_results.admin import TaskResultAdmin as DefaultTaskResultAdmin
from django.urls import path
from django.shortcuts import redirect
from celery.result import AsyncResult
from myproject.celery import app

# 取消已经注册的 TaskResult
admin.site.unregister(TaskResult)

# 创建一个自定义的 TaskResultAdmin 继承自默认的 TaskResultAdmin
class CustomTaskResultAdmin(DefaultTaskResultAdmin):
    change_list_template = "admin/celery_task_changelist.html"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('retry/<task_id>/', self.admin_site.admin_view(self.retry_task), name='retry-task'),
            path('terminate/<task_id>/', self.admin_site.admin_view(self.terminate_task), name='terminate-task'),
        ]
        return custom_urls + urls

    def retry_task(self, request, task_id, *args, **kwargs):
        AsyncResult(task_id, app=app).reapply()
        self.message_user(request, f'Task {task_id} retried successfully.')
        return redirect('..')

    def terminate_task(self, request, task_id, *args, **kwargs):
        AsyncResult(task_id, app=app).revoke(terminate=True)
        self.message_user(request, f'Task {task_id} terminated successfully.')
        return redirect('..')

# 注册自定义的 TaskResultAdmin
admin.site.register(TaskResult, CustomTaskResultAdmin)
```

创建模板文件 `myproject/templates/admin/celery_task_changelist.html`：

```html
{% extends "admin/change_list.html" %} {% block result_list_list %} {{
block.super }}
<script>
  function handleTask(action, task_id) {
    fetch(`/${action}/${task_id}/`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]')
          .value,
      },
    }).then((response) => {
      if (response.ok) {
        location.reload();
      } else {
        alert('Action failed.');
      }
    });
  }
</script>
<div>
  <form method="post">
    {% csrf_token %} {% for result in cl.result_list %}
    <button type="button" onclick="handleTask('retry', '{{ result.task_id }}')">
      Retry
    </button>
    <button
      type="button"
      onclick="handleTask('terminate', '{{ result.task_id }}')"
    >
      Terminate
    </button>
    {% endfor %}
  </form>
</div>
{% endblock %}
```

### 4. 启动和测试

启动本地 Django 服务器：

```sh
python manage.py runserver
```

确保远程服务器上的 Celery Worker 已经在运行。

触发任务并在 Django Admin 中查看：

- 访问 `http://127.0.0.1:8000/tasks/trigger-add-task/` - 触发增加任务
- 访问 `http://127.0.0.1:8000/tasks/trigger-long-task/` - 触发长时间运行任务

通过 `http://127.0.0.1:8000/admin/` 登录 Django Admin 界面，导航到 `Task Results` 部分，您应该能看到这些任务并管理它们（如重试和终止）。

### 总结

以上配置实现了在本地的 Django 项目中通过 Django Admin 管理和监控在远程服务器上单独运行的 Celery Worker，并通过 Redis 进行通信。这种架构可以在实际生产环境中更好地分离职责并提高系统的健壮性和扩展性。

---

在 Django Admin 界面没有显示 Flask 应用中 Celery Worker 发起的任务和任务执行结果，可能有以下几个原因：

1. **结果后端配置错误**：确保 Flask 和 Django 使用相同的结果后端（result backend）。
2. **Django 配置错误**：确保 Django 已正确配置 Celery 结果后端。
3. **Flask 应用没有保存结果**：确保 Flask 的 Celery 配置没有禁用结果保存功能。

要修复这个问题，请按以下步骤检查和修正设置：

### 1. 检查 Flask 应用的 Celery 配置

确保 Flask 应用中的 Celery 配置了正确的结果后端，并且没有禁用任务结果的存储。例如：

```python
celery_app = Celery(
    configs.celery.name,
    task_cls=FlaskTask,
    broker=app.config["CELERY_BROKER_URL"],
    backend=app.config["CELERY_BACKEND"],  # 确保配置了结果后端
    task_ignore_result=False,  # 确保不忽略任务结果
)

celery_app.conf.update(
    result_backend=app.config["CELERY_RESULT_BACKEND"],  # 确保配置了结果后端
    broker_connection_retry_on_startup=True,
)

# 确保没有不必要的配置禁用结果存储
```

### 2. 检查 Django 的 Celery 配置

在 `settings.py` 中，确保定义了 Celery 结果后端，并且配置与 Flask 中的配置一致：

```python
# Celery 配置
CELERY_BROKER_URL = 'redis://localhost:6379/0'  # 替换为实际的 Broker URL
CELERY_RESULT_BACKEND = 'django-db'  # 使用 Django 数据库作为结果后端
CELERY_CACHE_BACKEND = 'django-cache'
CELERY_RESULT_PERSISTENT = True

# 安装的应用程序
INSTALLED_APPS = [
    # 其他应用
    'django_celery_results',
    'django_celery_beat',
]

# 其他配置
```

### 3. 同步数据库

确保 Django 数据库与 Celery 结果模型一致：

```sh
python manage.py migrate django_celery_results
python manage.py migrate django_celery_beat
```

### 4. 确保 Django Admin 中注册了相关模型

确保在 `admin.py` 中注册了 `django_celery_results` 和 `django_celery_beat` 的模型，以便在 Admin 界面中查看：

```python
from django.contrib import admin
from django_celery_results.models import TaskResult
from django_celery_beat.models import PeriodicTask, IntervalSchedule, CrontabSchedule

admin.site.register(TaskResult)
admin.site.register(PeriodicTask)
admin.site.register(IntervalSchedule)
admin.site.register(CrontabSchedule)
```

### 5. 测试 Celery 任务

确保从 Flask 发送的 Celery 任务能正确存储结果：

```python
@celery_app.task(bind=True)
def debug_task(self, *args, **kwargs):
    print(f'Request: {self.request!r}')
    return 'Test Result'
```

在 Flask 应用中调用这个任务：

```python
debug_task.delay()
```

然后检查 Django Admin 界面中的任务结果是否显示。

### 6. 检查 Celery Worker 配置

确保 `celery worker` 是在一个共享的 Broker 和 Backend 上运行：

```sh
celery -A your_flask_app_name worker --loglevel=info
```

通过这些步骤，你应该能确保在 Django Admin 界面中正确显示 Flask 应用中 Celery Worker 发起的任务和任务执行结果。如果问题仍然存在，检查日志和配置是否有任何错误，并确保 Flask 和 Django 的所有 Celery 配置和数据库访问是有效且一致的。
