import { render, screen } from "@testing-library/react";
import { stripe } from '../../services/stripe';
import { mocked } from 'ts-jest/utils';
import Home, { getStaticProps } from "../../pages";

jest.mock('next/router')
jest.mock('next-auth/client', () => {
  return {
    useSession: () => [null, false]
  }
})
jest.mock('../../services/stripe')

describe("Page Home", () => {
  it("render to Home", () => {
    render(<Home product={{ idProduct: "1234", amount: "R$10,00" }} />)

    expect(screen.getByText('for R$10,00 month')).toBeInTheDocument()
  })

  it("verification return in getStaticProps", async () => {

    const mockedPricesRetrive = mocked(stripe.prices.retrieve);

    mockedPricesRetrive.mockResolvedValueOnce({
      id: "fake-id",
      unit_amount: 10000,
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            idProduct: "fake-id",
            amount: "$100.00"
          }
        }
      })
    )
  })
})