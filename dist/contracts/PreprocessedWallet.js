"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreprocessedWalletContract = void 0;
const ton3_core_1 = require("ton3-core");
const constants_1 = require("../constants");
const Source_1 = require("./Source");
const prefix = {
    sendMessage: 0x0ec3c86d,
    setCode: 0xad4de08e,
    changeLibrary: 0x26fa1dd4,
};
class PreprocessedWalletContract extends ton3_core_1.Contracts.ContractBase {
    constructor(opts) {
        const code = Source_1.Source.PreprocessedWallet();
        const storage = new ton3_core_1.Builder()
            .storeUint(0, 32)
            .storeUint(opts.subwalletId ?? constants_1.StandardSubwalletId, 32)
            .storeBytes(opts.publicKey)
            .cell();
        super(opts.workchain ?? 0, code, storage);
        this.publicKey = opts.publicKey;
        this.subwalletId = opts.subwalletId ?? constants_1.StandardSubwalletId;
    }
    createTransferMessage(transfers, seqno, timeout = 60) {
        if (!transfers.length || transfers.length > 255) {
            throw new Error('ContractWalletV3: can make only 1 to 4 transfers per operation.');
        }
        let outList = new ton3_core_1.Builder().cell();
        transfers.forEach((transfer) => {
            const internal = new ton3_core_1.Contracts.MessageInternal({
                bounce: transfer.destination.bounceable,
                src: ton3_core_1.Address.NONE,
                dest: transfer.destination,
                value: transfer.amount
            }, { body: transfer.body, state: transfer.init });
            outList = new ton3_core_1.Builder()
                .storeRef(outList)
                .storeUint(prefix.sendMessage, 32)
                .storeUint(transfer.mode, 8)
                .storeRef(internal.cell())
                .cell();
        });
        const body = new ton3_core_1.Builder()
            .storeUint(this.subwalletId, 32)
            .storeUint(~~(Date.now() / 1000) + timeout, 32)
            .storeUint(seqno, 32)
            .storeRef(outList);
        return new ton3_core_1.Contracts.MessageExternalIn({ dest: this.address }, { body: body.cell(), state: seqno === 0 ? this.state : undefined });
    }
    createDeployMessage() {
        const body = new ton3_core_1.Builder()
            .storeUint(this.subwalletId, 32)
            .storeInt(-1, 32)
            .storeUint(0, 32);
        return new ton3_core_1.Contracts.MessageExternalIn({ dest: this.address }, { body: body.cell(), state: this.state });
    }
}
exports.PreprocessedWalletContract = PreprocessedWalletContract;
//# sourceMappingURL=PreprocessedWallet.js.map