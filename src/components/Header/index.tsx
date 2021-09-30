import Link from 'next/link'
import styles from './styles.module.scss';
import { useRouter } from 'next/router';
import { SignInButton } from '../SignInButton';

export const Header = () => {

  const { pathname } = useRouter();

  const classActiveHome = pathname === '/' ? styles.active : ''
  const classActivePosts = pathname === '/posts' ? styles.active : ''

  return (
    <header className={styles.headerContainer}>
      <div className={styles.haderContainerContent}>
        <img src="/assets/logo.svg" alt="" />
        <nav>
          <Link href="/">
            <a className={classActiveHome}>Home</a>
          </Link>
          <Link href="/posts">
            <a className={classActivePosts} >Posts</a>
          </Link>
        </nav>
        <SignInButton />
      </div>
    </header>
  )
}