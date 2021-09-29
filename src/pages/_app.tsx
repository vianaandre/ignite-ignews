import { AppProps } from 'next/app';
import { Provider } from 'next-auth/client'
import '../styles/global.scss';
import { Header } from '../components/Header';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider session={pageProps.session}  >
      <Header />
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
