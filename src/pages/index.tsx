import { GetStaticProps } from 'next';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ApiSearchResponse from '@prismicio/client/types/ApiSearchResponse';
import { getPrismicClient } from '../services/prismic';
import styles from './home.module.scss';
import commonStyles from '../styles/common.module.scss';

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
  preview: boolean;
}

export default function Home({
  postsPagination,
  preview,
}: HomeProps): JSX.Element {
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextPage, setNextPage] = useState('');
  // const [handleData, setHandleData] = useState([]);
  // };
  // function handleLoadPagination(): void {
  // fetch(nextPage)
  //   .then(res => res.json)
  //   .then(data => {
  //     const formattedData = data.map(post => {
  //       return {
  //         uid: post.uid,
  //         first_publication_date: post.first_publication_date,
  //         data: {
  //           title: post.data.title,
  //           subtitle: post.data.subtitle,
  //           author: post.data.author,
  //         },
  //       };
  //     });
  //     setPosts([...posts, ...formattedData]);
  //     setNextPage(data.next_page);
  //   });
  // }
  useEffect(() => {
    setPosts(postsPagination.results);
    setNextPage(postsPagination.next_page);
  }, [postsPagination.next_page, postsPagination.results]);

  async function handleLoadPagination(): Promise<void> {
    const loadPostsResponse: ApiSearchResponse = await (
      await fetch(nextPage)
    ).json();

    const formattedPosts: Post[] = loadPostsResponse.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    });

    setPosts(oldPosts => [...oldPosts, ...formattedPosts]);
    setNextPage(loadPostsResponse.next_page);
    console.log(loadPostsResponse.results);
  }

  return (
    <>
      <Head>
        <title> Home | space Traveling.</title>
      </Head>

      <main className={commonStyles.container}>
        <div className={styles.posts}>
          {posts &&
            posts.map(post => (
              <Link key={post.uid} href={`/post/${post.uid}`}>
                <a>
                  <strong> {post.data.title}</strong>
                  <p>{post.data.subtitle}</p>
                  <div className={styles.authorGroup}>
                    <div>
                      <FiCalendar size={20} />
                      <time>
                        {format(
                          new Date(post.first_publication_date),
                          `dd MMM yyyy`,
                          { locale: ptBR }
                        )}
                      </time>
                    </div>
                    <div>
                      <FiUser size={20} />
                      <span>{post.data.author}</span>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
        </div>
      </main>
      <div className={`${commonStyles.container}`}>
        {nextPage ? (
          <button
            type="button"
            onClick={handleLoadPagination}
            className={styles.buttonLoadPosts}
          >
            Carregar mais posts
          </button>
        ) : (
          <p> Não tem mais posts para carregar</p>
        )}
        {/* {preview && <PreviewButton />} */}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async ({
  preview = false,
  previewData,
}) => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 2,
      ref: previewData?.ref ?? null,
    }
  );
  // format(        new Date(post.first_publication_date),        `dd / MMM / yyyy`,        { locale: ptBR }),
  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,

      first_publication_date: post.first_publication_date,

      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });
  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts,
      },
      preview,
    },
  };
};
