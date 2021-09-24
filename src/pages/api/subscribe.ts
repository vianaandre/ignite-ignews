import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from 'next-auth/client';
import { fauna } from "../../services/faunadb";
import { stripe } from "../../services/stripe";
import { query as q } from 'faunadb';

type UserProps = {
  ref: {
    id: string,
  }, 
  data: {
    costumer_stripe_id: string,
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {

  if(req.method === 'POST') {

    const session = await getSession({ req })

    const user = await fauna.query<UserProps >(
      q.Get(
        q.Match(
          q.Index('by_email_user'),
          q.Casefold(session.user.email)
        )
      )
    )

    let userId = user.data.costumer_stripe_id

    if(!userId) {
      const stripeCostumerCreate = await stripe.customers.create({
        email: session.user.email,
      })
  
      await fauna.query(
        q.Update(
          q.Ref(q.Collection('users'), user.ref.id),
          {
            data: {
              costumer_stripe_id: stripeCostumerCreate.id
            }
          }
        )
      )

      userId = stripeCostumerCreate.id
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: userId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        { 
          price: 'price_1JcsIJAwz7aGMThbplzXkTwu',
          quantity: 1,
        }
      ], 
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCESS_URL,
      cancel_url: process.env.STRIPE_CALCEL_URL
    }) 

    return res.status(200).json({ sessionId: checkoutSession.id })

  }else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed');
  }

}