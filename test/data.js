import { transformTransactionData } from "../lib/helpers";

export const mockTxs = {
  prices: {
    BTC: 31873.21,
    ETH: 1223.71,
  },
  transactions: [
    {
      amount: 212903,
      blockHeight: 661982,
      coin: "BTC",
      description: "",
      double_spend: false,
      from: "My Bitcoin Wallet",
      fromWatchOnly: false,
      hash: "12c645ba3c11ad4383e43896da18087cc1dce791e0f1c0c0b79bbf168b0dc266",
      insertedAt: 1608318771,
      searchable: "mock searchable phrase btc",
      state: "CONFIRMED",
      to: "1HyCCuBN4otT5utzD8Km3G3zjUtAjucF3u",
      toAddress: "1HyCCuBN4otT5utzD8Km3G3zjUtAjucF3u",
      toWatchOnly: false,
      txFee: 33496,
      type: "sent",
    },
    {
      createdAt: "2020-12-05T16:49:40.135Z",
      fiatCurrency: "USD",
      fiatValue: "63.00",
      id: "0ea29cfe-ceb3-480b-ad1a-19159bf9f1c6",
      pair: "USD-ETH",
      searchable: "mock searchable phrase fiat",
      state: "PENDING",
      type: "buy",
      version: "V2",
    },
    {
      amount: 19313120320400000,
      blockHeight: "10561201",
      data: null,
      description: "Pineapples belong on pizza",
      erc20: false,
      from: "My Ether Wallet",
      hash:
        "0x335f01c4b5cccda2b24708a42337cafa3628a888792d4b40f0aef3499a281eca",
      insertedAt: 1596115731,
      searchable: "mock searchable phrase eth",
      state: "PENDING",
      to: "0x732904f98f9bd820c643331ec48d2ebce1e52c2f",
      txFee: "1464400000000",
      type: "sent",
    },
  ],
};

export const mockTransformedTxs = mockTxs.transactions.map((tx) => {
  return transformTransactionData(tx, mockTxs.prices);
});
