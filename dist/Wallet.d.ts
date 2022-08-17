import { StandardWalletVersions } from "./types";
import { WalletV3Contract } from "./contracts/WalletV3";
import { WalletV4Contract } from "./contracts/WalletV4";
import { PreprocessedWalletContract } from "./contracts/PreprocessedWallet";
export declare class Wallet {
    static openByPubKey(opts: {
        workchain?: number;
        publicKey: Uint8Array;
        subwalletId?: number;
        version?: StandardWalletVersions;
    }): WalletV3Contract | WalletV4Contract | PreprocessedWalletContract;
}
