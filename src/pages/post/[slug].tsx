import { GetStaticPaths, GetStaticProps } from 'next';

import Head from 'next/head';

import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function Post({ post }: PostProps): JSX.Element {
  return (
    <>
      <Head>
        <title>{post.data.title} | space traveling.</title>
      </Head>
      <main>
        <img src={post.data.banner.url} alt="banner" srcSet="" />
        <article>
          <h1>{post.data.title}</h1>
          <div>calendario author tempo de leitura</div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  // const posts = await prismic.query();
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();
  const { slug } = params;

  const response = await prismic.getByUID('posts', String(slug), {});
  console.log(JSON.stringify(response, null, 2));
  const post: Post = {
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: [
        {
          heading: RichText.asText(response.data.content.heading),
          body: [
            {
              text: RichText.asHtml(response.data.content.body.text),
            },
          ],
        },
      ],
    },
  };

  return {
    props: {
      post,
    }, // return  de propriedades estáticas
  };
};
