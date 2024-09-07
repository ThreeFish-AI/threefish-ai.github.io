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
        人工智能、机器学习、深度学习
        <br />
        AIGC、AI Infra、AI 应用方面
      </>
    ),
  },
  {
    title: '算法通解',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: <>算法的串联与极解</>,
  },
  {
    title: '计算通践',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: <>技术的落地、工具的使用、编程语言</>,
  },
  {
    title: '知见通感',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: <>知人、知己、生活、职场、人生</>,
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
