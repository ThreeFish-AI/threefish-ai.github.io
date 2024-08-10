# ThreeFish K.A.

## Todos

- [x] 在 GitHub 上配置 CI/CD workflow；
- [x] 适配 Site metadata；
- [x] 适配 Home Page；
- [x] 切换中文语言，启用中英文本地文档搜索；
- [x] 适配导航与目录；
- [x] 支持评论与阅读次数统计；
- [x] 统一文章图片格式；
- [x] 支持 Markdown Math 语法；
- [ ] author 模块支持多平台图标与链接；
- [ ] 将文章分段书写，在组装成一个整体文章时，加入头尾信息；
- [ ] 动态中不内嵌文章整体，须在动态主页中定义 truncate 标记；
- [ ] 动态中隐藏自带的更新时间，显示自定义的更新时间；

## Features

- XXX

## Environment

<details>
    <summary>Environment Maintenance</summary>

1. Install Node.js

   ```bash
   # installs nvm (Node Version Manager)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

   # download and install Node.js (you may need to restart the terminal)
   nvm install 20

   # verifies the right Node.js version is in the environment
   node -v # should print `v20.15.0`

   # verifies the right NPM version is in the environment
   npm -v # should print `10.7.0`
   ```

2. Create Project[aurelius-huang]

   ```bash
   npx create-docusaurus@latest aurelius-huang classic --typescript
   ```

3. Install Plugins

   ```bash
   # 支持中文的离线本地搜索插件
   yarn add @easyops-cn/docusaurus-search-local

   # 支持评论与阅读次数统计
   yarn add @waline/client

   # ant 图标
   yarn add @ant-design/icons

   # Markdown kate syntax
   yarn add rehype-katex
   yarn add remark-math
   ```

4. Install Runtime Packages

   ```bash
   yarn
   ```

5. Start Development Server

   ```bash
   yarn start
   ```

   This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

6. Build

   ```bash
   yarn build
   ```

   This command generates static content into the `build` directory and can be served using any static contents hosting service.

7. Deployment

   ```bash
   USE_SSH=true yarn deploy
   ```

   Not using SSH:

   ```
   GIT_USER=<Your GitHub username> yarn deploy
   ```

   If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

8. Override Pages

   ```bash
   yarn swizzle @docusaurus/theme-classic BlogPostItem --eject
   ```

   Override Pages:

   - BlogPostPage
   - BlogPostItem
   - DocItem/Layout
   - DocItem/Content

</details>
