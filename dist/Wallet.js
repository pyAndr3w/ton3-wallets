"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const WalletV3_1 = require("./contracts/WalletV3");
const WalletV4_1 = require("./contracts/WalletV4");
const PreprocessedWallet_1 = require("./contracts/PreprocessedWallet");
class Wallet {
    static openByPubKey(opts) {
        switch (opts.version ?? 'org.ton.wallets.v3.r2') {
            case 'org.ton.wallets.v3.r2': return new WalletV3_1.WalletV3Contract({ ...opts, version: opts.version });
            case 'org.ton.wallets.v4.r2': return new WalletV4_1.WalletV4Contract({ ...opts, version: opts.version });
            case 'org.ton.wallets.preprocessed': return new PreprocessedWallet_1.PreprocessedWalletContract(opts);
            default: throw Error(`Unknown wallet type: ${opts.version}`);
        }
    }
}
exports.Wallet = Wallet;
//# sourceMappingURL=Wallet.js.map