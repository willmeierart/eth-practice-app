// CONSTANTS

export const BASE_URL = "http://localhost:8888/";

export const CREATED_AT = "createdAt";
export const INSERTED_AT = "insertedAt";

export const BTC_PER_UNIT = 10e-8;
export const ETH_PER_UNIT = 10e-17;

export const HEAD_CELLS = [
  { id: "currency", label: "Currency" },
  { id: "amountFiat", label: "Amount (Fiat)" },
  { id: "amountCrypto", label: "Amount (Crypto)" },
  { id: "time", label: "Time" },
  { id: "type", label: "Type" },
  { id: "state", label: "State" },
  { id: "to", label: "To" },
  { id: "from", label: "From" },
];
export const ORDERED_COLUMNS = HEAD_CELLS.map((hc) => hc.id);

export const BTC = "BTC";
export const ETH = "ETH";
export const FIAT = "FIAT";
export const USD = "USD";

export const BTC_WALLET = "My Bitcoin Wallet";
export const ETH_WALLET = "My Ether Wallet";

export const TYPE_OPTIONS = ["buy", "sell", "sent", "received"];
export const STATE_OPTIONS = ["CONFIRMED", "FINISHED", "PENDING"];
export const DEST_OPTIONS = [BTC_WALLET, ETH_WALLET, "OTHER"];
export const FILTERS = [
  { display: "Currency", id: "currency", options: [BTC, ETH, USD] },
  { display: "Type", id: "type", options: TYPE_OPTIONS },
  { display: "State", id: "state", options: STATE_OPTIONS },
  { display: "To", id: "to", options: DEST_OPTIONS },
  { display: "From", id: "from", options: DEST_OPTIONS },
];
