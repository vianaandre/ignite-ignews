import { signIn, useSession } from 'next-auth/client';
import { api } from '../../services/api';
import styles from './styles.module.scss';
import { getStripeJs } from '../../services/stripe-js';

interface SubscribeButtonProps {
  idProduct: string
}

export const SubscribeButton = ({ idProduct }: SubscribeButtonProps) => {

  const [session] = useSession();

  const handleSubscribe = async () => {
    if(!session) {
      signIn('github')
      return;
    }

    try {

      const response = await api.post('subscribe')

      const { sessionId } = response.data;

      const stripe = await getStripeJs()

      await stripe.redirectToCheckout({ sessionId })

    } catch(err) {
      alert(err.message)
      console.log(err.message) 
    }


  }

  return (
    <button type="button" className={styles.buttonSubscribe} onClick={handleSubscribe} >
      Subscribe now
    </button>
  )
}