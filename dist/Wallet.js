"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const constants_1 = require("./constants");
const WalletV3_1 = require("./contracts/WalletV3");
const WalletV4_1 = require("./contracts/WalletV4");
const PreprocessedWallet_1 = require("./contracts/PreprocessedWallet");
class Wallet {
    static openByPubKey(workchain, publicKey, subwalletId = constants_1.StandardSubwalletId, version = "org.ton.wallets.v3.r2") {
        switch (version) {
            case 'org.ton.wallets.v3.r2': return new WalletV3_1.WalletV3Contract(workchain, publicKey, subwalletId, version);
            case 'org.ton.wallets.v4.r2': return new WalletV4_1.WalletV4Contract(workchain, publicKey, subwalletId, version);
            case 'org.ton.wallets.preprocessed': return new PreprocessedWallet_1.PreprocessedWalletContract(workchain, publicKey, subwalletId);
            default: throw Error(`Unknown wallet type: ${version}`);
        }
    }
}
exports.Wallet = Wallet;
//# sourceMappingURL=Wallet.js.map