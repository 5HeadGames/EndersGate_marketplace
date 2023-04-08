import { AxiosInstance } from "axios";
import axiosClient from "../AxiosClientConfig";

class openseaServices {
  constructor(private client: AxiosInstance) {}
  async getCardsOpensea(): Promise<any> {
    return this.client.get(
      // `/orders/${network}/seaport/listings?asset_contract_address=${address}&token_ids=${ids.toString()}&order_by=created_date`,
      `/listings/collection/enders-gate-collection/all`,
    );
  }
  async getPacksOpensea(): Promise<any> {
    return this.client.get(
      // `/orders/${network}/seaport/listings?asset_contract_address=${address}&token_ids=${ids.toString()}&order_by=created_date`,
      `/listings/collection/enders-gate-collection/all`,
    );
  }
}

export const OpenseaApiService = new openseaServices(axiosClient);
