const supportedNetworks = ["epolia", "ethereum", "matic", "mumbai"];

const sepolia = {
  address: "0x0bf3de8c5d3e8a2b34d2beeb17abfcebaf363a59",
  chainSelector: "16015286601757825753",
};

const ethereum = {
  address: `0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D`,
  chainSelector: `5009297550715157269`,
};

const matic = {
  address: `0x849c5ED5a80F5B408Dd4969b78c2C8fdf0565Bfe`,
  chainSelector: `4051577828743386545`,
};

const mumbai = {
  address: "0x1035cabc275068e0f4b745a29cedf38e13af41b1",
  chainSelector: "12532609583862916517",
};

const getRouterConfig = (network) => {
  switch (network) {
    case "sepolia":
      return sepolia;
    case "ethereum":
      return ethereum;
    case "matic":
      return matic;
    case "mumbai":
      return mumbai;

    default:
      throw new Error("Unknown network: " + network);
  }
};

module.exports = {
  getRouterConfig,
  supportedNetworks,
};
