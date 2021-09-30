import { render, screen, fireEvent } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { useSession, signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import { SubscribeButton } from '.'

jest.mock('next-auth/client')
jest.mock('next/router')

const mockedUseSession = mocked(useSession);
const mockedUseRouter = mocked(useRouter);

describe('SubscribeButton component', () => {
  it("render component button", () => {    
    mockedUseSession.mockReturnValueOnce([null, false])

    render(<SubscribeButton />)

    expect(screen.getByText('Subscribe now')).toBeInTheDocument()

  })
  it("event onclick redirect signIn", () => {    
    const mockedSingIn = mocked(signIn)
    mockedUseSession.mockReturnValueOnce([null, false])

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton)

    expect(mockedSingIn).toHaveBeenCalled()

  })
  it("event onclick redirect signIn", () => {
    const pushRouter = jest.fn()
    
    mockedUseSession.mockReturnValueOnce([ {
      user: {
        name: 'John doe',
        email: 'john.doe@gmail.com',
      },
      activeSubscription: 'fake-active-status',
      expires: 'fake-expires'
    }, false ])

    mockedUseRouter.mockReturnValueOnce({
      push: pushRouter
    } as any)

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton)


    expect(pushRouter).toHaveBeenCalledWith('/posts')

  })
})