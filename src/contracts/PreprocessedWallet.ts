import {StandardWalletContract, StandardWalletTransfer} from "../types";
import {Address, Builder, Contracts} from "ton3-core";
import {StandardSubwalletId} from "../constants";
import {Source} from "./Source";

const prefix = {
    sendMessage: 0x0ec3c86d,
    setCode: 0xad4de08e,
    changeLibrary: 0x26fa1dd4,
}

export class PreprocessedWalletContract extends Contracts.ContractBase implements StandardWalletContract {
    private publicKey: Uint8Array

    private subwalletId: number

    constructor (workchain: 0, publicKey: Uint8Array, subwalletId = StandardSubwalletId) {
        const code = Source.PreprocessedWallet()

        const storage = new Builder()
            .storeUint(0, 32)
            .storeUint(subwalletId, 32)
            .storeBytes(publicKey)
            .cell()

        super(workchain, code, storage)

        this.publicKey = publicKey
        this.subwalletId = subwalletId
    }

    public createTransferMessage (
        transfers: StandardWalletTransfer[],    // array of transfers
        seqno: number,                  // sequence transfer number
        timeout: number = 60            // timeout in seconds
    ): Contracts.MessageExternalIn {
        if (!transfers.length || transfers.length > 255) {
            throw new Error('ContractWalletV3: can make only 1 to 4 transfers per operation.')
        }

        let outList = new Builder().cell()

        transfers.forEach((transfer) => {
            const internal = new Contracts.MessageInternal({
                bounce: transfer.destination.bounceable,
                src: Address.NONE,
                dest: transfer.destination,
                value: transfer.amount
            }, { body: transfer.body, state: transfer.init })

            outList = new Builder()
                .storeRef(outList)
                .storeUint(prefix.sendMessage, 32)
                .storeUint(transfer.mode, 8)
                .storeRef(internal.cell())
                .cell()
        })

        const body = new Builder()
            .storeUint(this.subwalletId, 32)
            .storeUint(~~(Date.now() / 1000) + timeout, 32) // valid until
            .storeUint(seqno, 32)
            .storeRef(outList)

        return new Contracts.MessageExternalIn(
            { dest: this.address },
            { body: body.cell(), state: seqno === 0 ? this.state : undefined }
        )
    }

    public createDeployMessage (): Contracts.MessageExternalIn {
        const body = new Builder()
            .storeUint(this.subwalletId, 32)
            .storeInt(-1, 32) // valid until
            .storeUint(0, 32) // seqno

        return new Contracts.MessageExternalIn(
            { dest: this.address },
            { body: body.cell(), state: this.state }
        )
    }
}
