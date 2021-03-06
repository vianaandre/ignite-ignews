import Link from 'next/link'
import Prismic from '@prismicio/client';
import PrismicDom from 'prismic-dom';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { getPrismicData } from '../../services/prismic';
import styles from './styles.module.scss';

type Post = {
  slug: string;
  title: string;
  abstract: string;
  updateAt: string
}

interface PostsProps {
  posts: Post[]
}

export default function Posts ({ posts }: PostsProps) {

  return (
    <>
      <Head>
        <title>Ignews | Posts</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
        {posts.map(post => (
          <Link href={`/posts/${post.slug}`} key={post.slug}>
              <a>
                <time>{post.updateAt}</time>
                <strong>{post.title}</strong>
                <p>{post.abstract}</p>
            </a>
          </Link>
        ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const prismic = getPrismicData()

  const response = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ], { 
    fetch: ['posts.title', 'posts.content'],
    pageSize: 100,
  }
  )

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: PrismicDom.RichText.asText(post.data.title),
      abstract: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
      updateAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  })
  
  return {
    props: {
      posts
    }
  }
}