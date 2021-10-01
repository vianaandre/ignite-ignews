import { render, screen } from "@testing-library/react";
import { mocked } from 'ts-jest/utils';
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";

import { getPrismicData } from '../../services/prismic';
import Post, {getStaticProps} from '../../pages/posts/preview/[slug]';

jest.mock('next-auth/client');
jest.mock('next/router');
jest.mock('../../services/prismic');

const post = {
    slug: 'fake-slug',
    title: 'Fake title',
    content: '<p>Fake content</p>',
    updatedAt: 'Fake data'
  };

describe('Post preview page', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])
    
    render(<Post post={post} />)

    expect(screen.getByText('Fake title')).toBeInTheDocument();
    expect(screen.getByText('Fake content')).toBeInTheDocument();
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
  });

  it('renders user to full post when use is subscribed', () => {
    const useSessionMocked = mocked(useSession)
    const useRouterMocked = mocked(useRouter)
    const pushMocked = jest.fn()

    useSessionMocked.mockReturnValueOnce([
      { activeSubscription: 'Fake-active-subscribe'}
    ] as any)

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked
    } as any)

    render(<Post post={post} />)

    expect(pushMocked).toHaveBeenCalledWith('/posts/fake-slug')
  });

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicData)

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            {type: 'heading', text: 'My New Post'}
          ],
          content: [
            {type: 'paragraph', text: 'Post excerpt'}
          ],
        },
        last_publication_date: '04-01-2021',
      })
    } as any)

    const response = await getStaticProps({
      params: { slug: 'Fake slug' }
    })

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'Fake slug',
            title: 'My New Post',
            content: '<p>Post excerpt</p>',
            updatedAt: '01 de abril de 2021'
          }
        }
      })
    )
  })
})