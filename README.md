# bc-tx-project

## Instructions

To install modules use `yarn`
To run a local instance of the app, you will want to run `yarn dev`.
To run a production build, you will warn to run `yarn build` and then `yarn start`.
Your app will be running on port 3000

## Overview
Build a React application that uses the mocked endpoints in this repo to fetch and display all of a users transactions
(BTC, ETH, Custodial/Fiat) in a single list with descending chronological order.

Since we do only a very limited amount of live coding during our interview process, this technical exercise is one of 
the best and fairest ways we’ve found to evaluate your programming competency.

## Requirements
- All core data for the app must use the mocked responses found in `/server/__mocks__`.  You do not need to use the Express 
  server bundled in this repo, but you certainly can.
- You are NOT allowed to change/modify the responses from the API in any way. It is formatted as such for this challenge.
- Add ability for user to search/filter and sort their transaction list.
- Display, at minimum, the following info on each transaction --> To, From, Amount (Fiat), Amount (Crypto), Date, Status, 
  Transaction Type, Coin(s) in Transaction
- Crypto amounts should be represented in terms of Bitcoin/Ether with precision to 8 decimal places. For example `74927492` sats 
should be displayed as `0.74927492` and `3019313120320400000` wei should be displayed as `3.01931312`.
- Usage of 3rd party CSS/component library is allowed

## Extra Credit
- Redux and/or Redux Saga usage (Yes both are a bit overkill for this app)
- Typescript (Flow is not allowed)
- Unit tests
- Mobile responsiveness
- Robust CI scripts (linting, testing, etc) / production ready build options
- Anything else you can think of that would increase the beauty/utility of the code and/or application

## Notes on API
- A transaction can be one of the following types: `buy`, `sell`, `sent`, `received`.
- A transaction can be in either of the following states: `PENDING`, `CONFIRMED`.
- The `amount` response in the BTC and ETH endpoints are expressed in their respective base units (Sats and Wei). You will
  need to do some Math to correctly display the amounts in UI.
- Custodial transactions use `createdAt` and non-custodial transactions use `insertedAt` as their respective timestamps.

## Grading Rubric
We cannot emphasize enough that the coding exercise is the most important way for us to evaluate your technical skills. 

Here is a non-exhaustive list of the areas we will assess for
- Code structure/organization
- Code quality/performance
- Correctness of data display
- UX design
- Documentation

## Questions / Project Submission
Email your questions to `andrew@blockchain.com`.  When you finished with challenge please notify your recruiter and send
them your Github link. DO NOT CREATE A PR AGAINST THIS REPO.

## Helpful Reading
- https://ethdocs.org/en/latest/ether.html#denominations
- https://bitsusd.com/bitcoin-units/
