import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: '数智通识',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        跟踪 AIGC 领域如 LLM、AI Agents、AGI 等前沿研究的最新动态，搭建 AI App
        Marketplace。
      </>
    ),
  },
  {
    title: '算法通解',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        构建机器学习、流行神经网络模型等人工智能基础理论知识体系。 关注
        NLP、搜索引擎、推荐系统、CV 等人工智能领域的应用方案。
      </>
    ),
  },
  {
    title: '计算通践',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>关注 AI 应用工程常用编程语言、计算平台、算法框架、落地方案。</>
    ),
  },
  {
    title: '知见通感',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>关注 AI 应用工程常用编程语言、计算平台、算法框架、落地方案。</>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
