import { GetStaticProps } from 'next';

import Head from 'next/head';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(): JSX.Element {
  // TODO
  return (
    <>
      <Head>
        <title> Home | space Traveling.</title>
      </Head>

      <main className={commonStyles.container}>
        <div className={styles.posts}>
          <a>
            <strong> Como Utilizar Hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div className={styles.authorGroup}>
              <div>
                <img src="/images/calendar.svg" alt="" srcSet="" />
                <time>15 Mar 2021</time>
              </div>
              <div>
                <img src="/images/user.svg" alt="" srcSet="" />
                <span>Joseph Oliveira</span>
              </div>
            </div>
          </a>
          <a>
            <strong> Como Utilizar Hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div className={styles.authorGroup}>
              <div>
                <img src="/images/calendar.svg" alt="" srcSet="" />
                <time>15 Mar 2021</time>
              </div>
              <div>
                <img src="/images/user.svg" alt="" srcSet="" />
                <span>Joseph Oliveira</span>
              </div>
            </div>
          </a>
          <a>
            <strong> Como Utilizar Hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div className={styles.authorGroup}>
              <div>
                <img src="/images/calendar.svg" alt="" srcSet="" />
                <time>15 Mar 2021</time>
              </div>
              <div>
                <img src="/images/user.svg" alt="" srcSet="" />
                <span>Joseph Oliveira</span>
              </div>
            </div>
          </a>
        </div>
      </main>
      <div className={`${styles.buttonLoadMore}${commonStyles.container}`}>
        {' '}
        Carregar Mais Posts
      </div>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
