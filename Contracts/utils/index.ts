import {ContractReceipt} from '@ethersproject/contracts'
import {Interface, LogDescription} from '@ethersproject/abi'

export const getLogs = (iface: Interface, transaction: ContractReceipt) => {
  const response: LogDescription[] = []
  transaction.logs.forEach(log => {
    try {
      response.push(iface.parseLog(log))
    } catch (err: any) {}
  })
  return response;
}
