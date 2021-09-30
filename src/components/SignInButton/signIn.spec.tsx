import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { useSession } from 'next-auth/client';
import { SignInButton } from '.'

jest.mock('next-auth/client')

describe('SignInButton component', () => {
  it('user not logged', () => {

    const mockedUseSession = mocked(useSession);

    mockedUseSession.mockReturnValueOnce([ null, false ])

    render(
      <SignInButton />
    )
  
    expect(screen.getByText('Sign in with Github!')).toBeInTheDocument()
  })
  it('user logged', () => {

    const mockedUseSession = mocked(useSession);

    mockedUseSession.mockReturnValueOnce([ {
      user: {
        name: 'John doe',
        email: 'john.doe@gmail.com',
      },
      expires: 'fake-expires'
    }, false ])

    render(
      <SignInButton />
    )
  
    expect(screen.getByText('John doe')).toBeInTheDocument()
  })
})