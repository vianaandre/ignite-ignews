import { render, screen } from "@testing-library/react"
import { getSession } from 'next-auth/client'
import { mocked } from "ts-jest/utils"
import { getPrismicData } from '../../services/prismic'
import Post, { getServerSideProps } from "../../pages/posts/[slug]"

const post = {
  slug: "Fake slug",
  title: "Fake title",
  content: "Fake content",
  abstract: "Fake resume",
  updatedAt: "Fake data"

}

jest.mock('next-auth/client',)
jest.mock('../../services/prismic')

const mockedGetSession = mocked(getSession)

describe("Page post", () => {
  it("render page post", () => {
    render(<Post post={post} />)

    expect(screen.getByText('Fake title')).toBeInTheDocument()
    expect(screen.getByText('Fake content')).toBeInTheDocument()

  })

  it("redirect session null /", async () => {

    mockedGetSession.mockResolvedValueOnce(null)

    const response = await getServerSideProps({
      params: {
        slug: "Fake slug"
      }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/'
        })
      })
    )
  })

  it("return props sucess", async () => {

    const mockedGetPrismicData = mocked(getPrismicData)

    mockedGetSession.mockResolvedValueOnce({
      activeSubscription: 'Fake-active-subscribe'
    } as any)

    mockedGetPrismicData.mockReturnValueOnce({
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
      }
      )
    } as any)

    const response = await getServerSideProps({
      params: { slug: 'Fake slug'}
    } as any)
    
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