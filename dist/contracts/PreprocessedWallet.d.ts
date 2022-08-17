import { StandardWalletContract, StandardWalletTransfer } from "../types";
import { Contracts } from "ton3-core";
export declare class PreprocessedWalletContract extends Contracts.ContractBase implements StandardWalletContract {
    private publicKey;
    private subwalletId;
    constructor(opts: {
        workchain?: number;
        publicKey: Uint8Array;
        subwalletId?: number;
    });
    createTransferMessage(transfers: StandardWalletTransfer[], seqno: number, timeout?: number): Contracts.MessageExternalIn;
    createDeployMessage(): Contracts.MessageExternalIn;
}
