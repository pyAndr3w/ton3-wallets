import { StandardWalletContract, StandardWalletTransfer, WalletV4Versions } from "../types";
import { Contracts } from "ton3-core";
export declare class WalletV4Contract extends Contracts.ContractBase implements StandardWalletContract {
    private publicKey;
    private subwalletId;
    private version;
    constructor(workchain: 0, publicKey: Uint8Array, subwalletId?: number, version?: WalletV4Versions);
    createTransferMessage(transfers: StandardWalletTransfer[], seqno: number, timeout?: number): Contracts.MessageExternalIn;
    createDeployMessage(): Contracts.MessageExternalIn;
}
