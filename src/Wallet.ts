import {StandardSubwalletId} from "./constants";
import {StandardWalletVersions} from "./types";
import {WalletV3Contract} from "./contracts/WalletV3";
import {WalletV4Contract} from "./contracts/WalletV4";
import {PreprocessedWalletContract} from "./contracts/PreprocessedWallet";

export class Wallet {

    public static openByPubKey(workchain: 0, publicKey: Uint8Array, subwalletId = StandardSubwalletId, version: StandardWalletVersions = "org.ton.wallets.v3.r2") {
        switch (version) {
            case 'org.ton.wallets.v3.r2': return new WalletV3Contract(workchain, publicKey, subwalletId, version);
            case 'org.ton.wallets.v4.r2': return new WalletV4Contract(workchain, publicKey, subwalletId, version);
            case 'org.ton.wallets.preprocessed': return new PreprocessedWalletContract(workchain, publicKey, subwalletId)
            default: throw Error(`Unknown wallet type: ${version}`);
        }
    }
}
