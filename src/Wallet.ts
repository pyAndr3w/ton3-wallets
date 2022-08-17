import {StandardWalletVersions, WalletV3Versions, WalletV4Versions} from "./types";
import {WalletV3Contract} from "./contracts/WalletV3";
import {WalletV4Contract} from "./contracts/WalletV4";
import {PreprocessedWalletContract} from "./contracts/PreprocessedWallet";

export class Wallet {

    public static openByPubKey(opts: {workchain?: number, publicKey: Uint8Array, subwalletId?: number, version?: StandardWalletVersions}) {
        switch (opts.version ?? 'org.ton.wallets.v3.r2') {
            case 'org.ton.wallets.v3.r2': return new WalletV3Contract({...opts, version: opts.version as WalletV3Versions});
            case 'org.ton.wallets.v4.r2': return new WalletV4Contract({...opts, version: opts.version as WalletV4Versions});
            case 'org.ton.wallets.preprocessed': return new PreprocessedWalletContract(opts)
            default: throw Error(`Unknown wallet type: ${opts.version}`);
        }
    }
}
