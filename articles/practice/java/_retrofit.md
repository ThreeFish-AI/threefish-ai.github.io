## retrofit-spring-boot-starter demo

### 1. 添加依赖

```xml
<dependency>
    <groupId>com.github.lianjiatech</groupId>
    <artifactId>retrofit-spring-boot-starter</artifactId>
    <version>3.1.3</version>
</dependency>
```

### 2. Customize OkHttpClient

```java
@Component
public class CustomOkHttpClientRegistrar implements SourceOkHttpClientRegistrar {

   @Override
   public void register(SourceOkHttpClientRegistry registry) {
      // 注册customOkHttpClient，超时时间设置为1s
      registry.register("customOkHttpClient", new OkHttpClient.Builder()
              .connectTimeout(Duration.ofSeconds(1))
              .writeTimeout(Duration.ofSeconds(1))
              .readTimeout(Duration.ofSeconds(1))
              .addInterceptor(chain -> chain.proceed(chain.request()))
              .build());
   }
}
```

```java
@RetrofitClient(baseUrl = "${test.baseUrl}", sourceOkHttpClient = "customOkHttpClient")
public interface CustomOkHttpUserService {

   /**
    * 根据id查询用户信息
    */
   @GET("getUser")
   User getUser(@Query("id") Long id);
}
```



## Retrofit Demo

使用 Retrofit 进行网络请求的客户端示例可以帮助您快速上手。下面是一个简单的示例，展示如何使用 Retrofit 创建 HTTP 客户端，执行网络请求，并处理响应。

### 1. 添加依赖

首先，您需要在 `build.gradle` 文件中添加 Retrofit 的依赖项。如果您使用的是 Gradle，请添加以下内容：

```groovy
dependencies {
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.9.0' // 如果使用 Gson 转换器
    implementation 'com.squareup.okhttp3:logging-interceptor:4.9.0' // 可选，日志拦截器
}
```

### 2. 创建数据模型

假设您要从一个 API 获取用户数据，首先创建模型类：

```java
public class User {
    private String name;
    private String email;

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
```

### 3. 定义 API 接口

接下来，定义 API 接口：

```java
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;

import java.util.List;

public interface ApiService {
    @GET("users")
    Call<List<User>> getUsers();

    @GET("users/{id}")
    Call<User> getUserById(@Path("id") int userId);
}
```

### 4. 创建 RetrofitClient

然后，创建 Retrofit 客户端：

```java
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class RetrofitClient {
    private static final String BASE_URL = "https://jsonplaceholder.typicode.com/"; // 示例 API 地址
    private static Retrofit retrofit;

    public static Retrofit getInstance() {
        if (retrofit == null) {
            retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
        }
        return retrofit;
    }
}
```

### 5. 使用 RetrofitClient 进行网络请求

在您的 Activity 或其他组件中，使用 Retrofit 客户端发出网络请求：

```java
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import java.util.List;

public class MainActivity extends AppCompatActivity {
    private static final String TAG = "MainActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        ApiService apiService = RetrofitClient.getInstance().create(ApiService.class);

        // 请求用户列表
        Call<List<User>> call = apiService.getUsers();
        call.enqueue(new Callback<List<User>>() {
            @Override
            public void onResponse(Call<List<User>> call, Response<List<User>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    for (User user : response.body()) {
                        Log.d(TAG, "User Name: " + user.getName());
                    }
                } else {
                    Log.e(TAG, "Request failed");
                }
            }

            @Override
            public void onFailure(Call<List<User>> call, Throwable t) {
                Log.e(TAG, "Error: " + t.getMessage());
            }
        });
    }
}
```

### 6. 运行应用

通过运行您的应用，您应该能在日志中看到获取的用户数据。

### 总结

以上代码展示了如何使用 Retrofit 创建一个简单的 HTTP 客户端，执行 GET 请求并处理响应数据。您可以根据需要扩展此示例，包括添加 POST 请求、错误处理、配置 OkHttp 等功能。

## Retrofit Starter Demo

下面是一个简单的 Retrofit Starter Demo，展示如何在 Maven 项目中引入 Retrofit 依赖，并进行基本的 API 调用。

### 1. 添加 Maven 依赖

首先，在你的 `pom.xml` 文件中添加 Retrofit 和相关库的依赖。

```xml
<dependencies>
    <!-- Retrofit -->
    <dependency>
        <groupId>com.squareup.retrofit2</groupId>
        <artifactId>retrofit</artifactId>
        <version>2.9.0</version>
    </dependency>
    <!-- Gson Converter -->
    <dependency>
        <groupId>com.squareup.retrofit2</groupId>
        <artifactId>converter-gson</artifactId>
        <version>2.9.0</version>
    </dependency>
    <!-- OkHttp -->
    <dependency>
        <groupId>com.squareup.okhttp3</groupId>
        <artifactId>okhttp</artifactId>
        <version>4.9.0</version>
    </dependency>
    <!-- Add other dependencies as per your project requirements -->
</dependencies>
```

### 2. 创建 API 接口

创建一个接口，定义你的 API 请求。

```java
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;

public interface ApiService {
    @GET("users/{user}")
    Call<User> getUser(@Path("user") String user);
}
```

### 3. 创建用户模型

你需要一个模型来映射 API 响应。假设返回的信息包含 `id` 和 `name`。

```java
public class User {
    private int id;
    private String name;

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
```

### 4. 设置 Retrofit 实例

接下来，设置 Retrofit 实例并执行 API 调用。

```java
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class Main {
    public static void main(String[] args) {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://api.example.com/") // 替换为你的 API 基地址
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        ApiService apiService = retrofit.create(ApiService.class);

        Call<User> call = apiService.getUser("octocat"); // 替换为你需要查询的用户名
        call.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (response.isSuccessful()) {
                    User user = response.body();
                    System.out.println("User ID: " + user.getId());
                    System.out.println("User Name: " + user.getName());
                } else {
                    System.out.println("Request failed: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                t.printStackTrace();
            }
        });
    }
}
```

### 5. 运行示例

确保你的 Maven 项目正确配置，运行 `Main` 类，即可尝试进行 API 请求。

以上就是一个简单的 Retrofit Starter Demo 示例，展示了如何在 Maven 项目中引入 Retrofit 依赖并进行基本的 API 调用。你可以根据实际需要调整 API 接口和用户模型。
