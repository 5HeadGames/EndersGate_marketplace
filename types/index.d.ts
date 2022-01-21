interface NFT {
  tokenId: number | string;
}

type Activity = {
  createdAt: string;
  type: 'sell' | 'buy' | 'login';
  nft?: NFT;
}

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
