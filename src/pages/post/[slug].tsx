/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable react/no-danger */

import { GetStaticPaths, GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import Head from 'next/head';

import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { Fragment } from 'react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
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
  const router = useRouter();

  if (router.isFallback) {
    return <h2>Carregando...</h2>;
  }
  function handleTimeReading(): number {
    const totalWords = post.data.content.reduce((total, content) => {
      total += content.heading.split(' ').length;
      const words = content.body.map(item => item.text.split(' ').length);

      words.map(word => (total += word));
      return total;
    }, 0);
    const timeReading = Math.ceil(totalWords / 200); // retorna um numero inteiro
    return timeReading;
  }

  const timeToRead = handleTimeReading();

  // console.log(post.data.content);
  return (
    <>
      <Head>
        <title>{post.data.title} | space traveling.</title>
      </Head>
      <header className={styles.postHeader}>
        <img src={post.data.banner.url} alt="banner" srcSet="" />
      </header>

      <article className={`${commonStyles.container} ${styles.post}`}>
        <h1>{post.data.title}</h1>
        <div className={commonStyles.authorGroup}>
          <div>
            <FiCalendar size={20} />
            <time>
              {format(new Date(post.first_publication_date), `dd MMM yyyy`, {
                locale: ptBR,
              })}
            </time>
          </div>
          <div>
            <FiUser size={20} />
            <span>{post.data.author}</span>
          </div>
          <div>
            <FiClock size={20} />
            <span>{`${timeToRead} min`} </span>
          </div>
        </div>
        <div className={styles.postContent}>
          {post.data.content.map(content => (
            <Fragment key={content.heading}>
              <h2>{content.heading}</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(content.body),
                }}
              />
            </Fragment>
          ))}
        </div>
      </article>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    // faz a query e busca os posts
    Prismic.Predicates.at('document.type', 'posts'),
  ]);

  const paths = posts.results.map(post => {
    return {
      params: { slug: post.uid.toString() },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
  // preview = false,
  previewData,
}) => {
  const prismic = getPrismicClient();
  const { slug } = params;

  const response = await prismic.getByUID('posts', String(slug), {
    /// <reference path="" />
    ref: previewData?.ref || null,
  });
  // console.log(JSON.stringify(response, null, 2)); retorna  dentro do objeto

  const post: Post = {
    // uid: response.data.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: [...content.body],
        };
      }),
    },
  };

  return {
    props: {
      post,
    }, // return  de propriedades estáticas
  };
};
