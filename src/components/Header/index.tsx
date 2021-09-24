import styles from './styles.module.scss';
import { SignInButton } from '../SignInButton';

export const Header = () => {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.haderContainerContent}>
        <img src="assets/logo.svg" alt="" />
        <nav>
          <a className={styles.active} href="#">Home</a>
          <a href="#">Posts</a>
        </nav>
        <SignInButton />
      </div>
    </header>
  )
}