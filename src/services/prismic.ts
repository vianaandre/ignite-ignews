import Prismic from '@prismicio/client';

export const getPrismicData = (req?: unknown) => {
  const Client = Prismic.client(
    process.env.NEXT_PUBLIC_PRISMIC_URL, 
    {
      req,
      accessToken: process.env.PRISMIC_API_KEY,
    }
  )

  return Client
}