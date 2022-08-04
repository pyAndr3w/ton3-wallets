import { Address, Cell, Coins, Contracts } from "ton3-core";
export interface StandardWalletContract {
    createTransferMessage(transfers: StandardWalletTransfer[], seqno: number, timeout: number): Contracts.MessageExternalIn;
    createDeployMessage(): Contracts.MessageExternalIn;
}
export interface StandardWalletTransfer {
    destination: Address;
    amount: Coins;
    body: Cell;
    init?: Cell;
    mode: number;
}
export declare type WalletV3Versions = "org.ton.wallets.v3" | "org.ton.wallets.v3.r2";
export declare type WalletV4Versions = "org.ton.wallets.v4" | "org.ton.wallets.v4.r2";
export declare type PreprocessedWalletVersion = "org.ton.wallets.preprocessed";
export declare type StandardWalletVersions = WalletV3Versions | WalletV4Versions | PreprocessedWalletVersion;
