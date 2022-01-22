
class HarmonyWallet {
   isOneWallet: boolean;
   isAuthorized: boolean;
   address: string;
   onewallet: any;

   constructor(stores?: any) {
      this.isOneWallet = (window as any).onewallet && (window as any).onewallet.isOneWallet;
      this.onewallet = (window as any).onewallet;
   }

   async signin() {
      const getAccount = await this.onewallet.getAccount();
      console.log("slkdfjds")
      console.log(getAccount)

      this.address = getAccount.address;
      this.isAuthorized = true;
   }

   signTransaction(txn: any) {
      console.log("asjdnasljkndlask")
      if (this.isOneWallet) {
         return this.onewallet.signTransaction(txn);
      }
   }

   attachToContract(contract: any) {
      if (this.onewallet) {
         contract.wallet.signTransaction = async (tx) => {
            tx.from = this.address;
            const signTx = await this.signTransaction(tx);
            console.log(signTx);
            return signTx;
         }
      }
      return contract
   }
}

export default HarmonyWallet


