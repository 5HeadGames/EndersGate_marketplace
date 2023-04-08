import { AxiosInstance } from "axios";
import axiosClient from "../AxiosClientConfig";

class openseaServices {
  constructor(private client: AxiosInstance) {}
  async getCardsOpensea(): Promise<any> {
    return this.client.get(`/listings/collection/enders-gate-collection/all`);
  }
  async getPacksOpensea(): Promise<any> {
    return this.client.get(`/listings/collection/enders-packs/all`);
  }
  async createListingOpensea(): Promise<any> {
    return this.client.get(`/orders/matic/seaport/listings`);
  }
}

export const OpenseaApiService = new openseaServices(axiosClient);
