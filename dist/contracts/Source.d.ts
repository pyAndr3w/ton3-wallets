import { Cell } from "ton3-core";
export declare class Source {
    private static WalletV3Code;
    private static WalletV3R2Code;
    private static WalletV4Code;
    private static WalletV4R2Code;
    private static PreprocessedWalletCode;
    static WalletV3(): Cell;
    static WalletV3R2(): Cell;
    static WalletV4(): Cell;
    static WalletV4R2(): Cell;
    static PreprocessedWallet(): Cell;
}
