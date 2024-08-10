import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const config: Config = {
  title: '三余知行',
  tagline: '冬者岁之余，夜者日之余，阴雨者时之余也',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://aurelius-huang.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Aurelius Huang', // Usually your GitHub org/user name.
  projectName: 'aurelius-huang.github.io', // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        indexDocs: true,
        indexPages: true,
        language: ['en', 'zh'],
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        // docs: false,
        // {
        //   sidebarPath: './sidebars.ts',
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl: 'https://github.com/aurelius-huang',
        // },
        blog: {
          path: 'blog',
          blogTitle: '动态',
          routeBasePath: 'trend',
          showReadingTime: false,
          postsPerPage: 5,
          blogSidebarCount: 'ALL',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl: 'https://github.com/aurelius-huang',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    // ["docusaurus-plugin-umami"],
    [
      // 数智通识
      '@docusaurus/plugin-content-docs',
      {
        id: 'ml',
        path: './articles/general/ml',
        routeBasePath: 'ml',
        sidebarPath: './sidebars.ts',
        // showLastUpdateTime: true,
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
        // remarkPlugins: [(await import('remark-math')).default],
        // rehypePlugins: [(await import('rehype-katex')).default],
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'dl',
        path: './articles/general/dl',
        routeBasePath: 'dl',
        sidebarPath: './sidebars.ts',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'aigc',
        path: './articles/general/aigc',
        routeBasePath: 'aigc',
        sidebarPath: './sidebars.ts',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'essence-of-computing',
        path: './articles/general/the-essence-of-computing',
        routeBasePath: 'essence-of-computing',
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
        sidebarPath: './sidebars.ts',
      },
    ],

    // 算法通解
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'algorithm',
        path: './articles/algorithm',
        routeBasePath: 'algorithm',
        sidebarPath: './sidebars.ts',
      },
    ],

    // 计算通践
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'working',
        path: './articles/practice/working',
        routeBasePath: 'working',
        sidebarPath: './sidebars.ts',
      },
    ],

    // 知见通感
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'intellection',
        path: './articles/perception/intellection',
        routeBasePath: 'intellection',
        sidebarPath: './sidebars.ts',
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: '三余知行',
      logo: {
        alt: '三只鱼个人网站',
        src: 'img/logo.svg',
      },
      items: [
        // {
        //   type: 'docSidebar',
        //   sidebarId: 'autoSidebar',
        //   position: 'left',
        //   label: '文档',
        // },
        {
          to: '/trend',
          label: '动态',
          position: 'left',
        },
        {
          type: 'dropdown',
          label: '数智通识',
          position: 'right',
          items: [
            {
              to: '/ml',
              label: '机器学习',
              docId: 'index',
              type: 'doc',
              docsPluginId: 'ml',
            },
            {
              to: '/dl',
              label: '深度学习',
              docId: 'index',
              type: 'doc',
              docsPluginId: 'dl',
            },
            {
              to: '/aigc',
              label: 'AIGC',
              docId: 'index',
              type: 'doc',
              docsPluginId: 'aigc',
            },
            {
              to: '/essence-of-computing',
              label: '计算之魂',
              docId: 'index',
              type: 'doc',
              docsPluginId: 'essence-of-computing',
            },
          ],
        },
        {
          to: '/algorithm',
          label: '算法通解',
          docId: 'index',
          type: 'doc',
          position: 'right',
          docsPluginId: 'algorithm',
        },
        // {
        //   type: 'dropdown',
        //   label: '算法通解',
        //   position: 'right',
        //   items: [
        //     {
        //       to: '/practice',
        //       label: '工程实践',
        //       docId: 'index',
        //       docsPluginId: 'practice',
        //     },
        //   ],
        // },
        {
          type: 'dropdown',
          label: '计算通践',
          position: 'right',
          items: [
            {
              to: '/working',
              label: '工具箱',
              docId: 'index',
              docsPluginId: 'working',
            },
            // {
            //   to: '/practice',
            //   label: '工程实践',
            //   docId: 'index',
            //   docsPluginId: 'practice',
            // },
          ],
        },
        {
          type: 'dropdown',
          label: '知见通感',
          position: 'right',
          items: [
            {
              to: '/intellection',
              label: '内省',
              docId: 'index',
              docsPluginId: 'intellection',
            },
          ],
        },
        {
          type: 'search',
          position: 'right',
        },
        {
          href: 'https://github.com/aurelius-huang',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '知识体系',
          items: [
            {
              label: '机器学习',
              to: '/ml',
            },
            {
              label: '深度学习',
              to: '/dl',
            },
            {
              label: 'AIGC',
              to: '/aigc',
            },
          ],
        },
        {
          title: '场景应用',
          items: [
            {
              label: 'NLP',
              to: '/working',
            },
            {
              label: '搜索引擎',
              to: '/working',
            },
            {
              label: '推荐系统',
              to: '/working',
            },
          ],
        },
        {
          title: '编程语言',
          items: [
            {
              label: 'Java',
              to: '/working',
            },
            {
              label: 'Python',
              to: '/working',
            },
            {
              label: 'Go',
              to: '/working',
            },
          ],
        },
        {
          title: '链接',
          items: [
            {
              label: 'CSDN',
              href: 'https://blog.csdn.net/ChaoMing_H',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/aurelius-huang',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Threefish K. A. 保留所有权利  <a style="color:#6ea8fe" href="https://beian.miit.gov.cn">粤ICP备2023147376号-1</a>`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],
};

export default config;
