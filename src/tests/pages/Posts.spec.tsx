import { render, screen } from "@testing-library/react"
import { mocked } from "ts-jest/utils";
import Posts, { getStaticProps } from "../../pages/posts"
import { getPrismicData } from '../../services/prismic';

jest.mock('../../services/prismic')

const posts = [
  {
    slug: "Fake slug", title: "Fake title", abstract: "Fake abstract", updateAt: "Fake Date"
  }
]

describe("spected from Pages Posts", () => {
  it("render Page posts", () => {
    render(<Posts posts={posts}/>)

    expect(screen.getByText('Fake title')).toBeInTheDocument()
  })

  it("verification return from getStaticProps", async () => {

    const mockedGetPrismicData = mocked(getPrismicData)

    mockedGetPrismicData.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my-new-post',
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
        ]
      })
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [{
            slug: 'my-new-post',
            title: 'My New Post',
            abstract: 'Post excerpt',
            updateAt: '01 de abril de 2021'
          }]
        }
      })
    )

  })
})