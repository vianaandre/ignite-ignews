import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi'
import { signIn, signOut, useSession } from 'next-auth/client'

import styles from './styles.module.scss';

export const SignInButton = () => {
  const [ session ] = useSession()

  return (
    <>
      {session ? (
      <button 
        type="button" 
        className={styles.signinButton} 
        onClick={() => signOut()}
      >
        <FaGithub  color="#04d361" />
        {session.user.name}
        <FiX />
      </button>  
      ) : (
        <button 
        type="button" 
        className={styles.signinButton} 
          onClick={() => signIn('github')}
        >
          <FaGithub  color="#eba412" />
          Sign in with Github!
        </button>
      )
      }
    </>
  )
}
