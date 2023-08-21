interface NFT {
  tokenId: number | string;
}

type Activity = {
  createdAt: string;
  type: "sell" | "buy" | "login";
  metadata: Object;
};

interface User {
  id: string;
  address: string;
  email: string;
  name: string;
  profile_picture: string;
  userStatus: string;
  walletType?: string;
  activity: Activity[];
}

interface Sale {
  seller: string;
  nft: string;
  nftId: string;
  amount: string;
  price: string;
  duration: string;
  startedAt: string;
  status: "0" | "1" | "2";
}

interface Rent {
  rent: boolean;
  seller: string;
  nft: string;
  nftId: string;
  amount: string;
  price: string;
  duration: string;
  startedAt: string;
  status: "0" | "1" | "2" | "3";
}
