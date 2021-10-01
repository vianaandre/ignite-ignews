import Head from 'next/head';

import styles from './home.module.scss';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';
import { GetStaticProps } from 'next';

interface HomeProps {
  product: {
    idProduct: string;
    amount: string;
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
    <Head>
      <title>Ig.News</title>
    </Head>

    <section className={styles.home} >
      <div className={styles.homeDescription}>
        <span>👏 Hey, welcome</span>
        <h1>News about <br /> the 
        <span> React</span> world.</h1>
        <p>Get acess to all publications <br />
        <span>for {product.amount} month</span> </p>
        <SubscribeButton />
      </div>
      <img src="/assets/avatar.svg" alt="Girl coding" />
    </section>
    </>
  )
}


export const getStaticProps: GetStaticProps = async () => {

  const getProduct = await stripe.prices.retrieve('price_1JcsIJAwz7aGMThbplzXkTwu');

  const product = {
    idProduct: getProduct.id,
    amount: Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(getProduct.unit_amount / 100),
  }


  return {
    props: {
      product
    }, 
    revalidate: 60 * 60 * 24 // 1 day
  }
}