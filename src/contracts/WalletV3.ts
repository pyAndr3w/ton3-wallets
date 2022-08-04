import {StandardWalletContract, StandardWalletTransfer, WalletV3Versions} from "../types";
import {Address, Builder, Contracts} from "ton3-core";
import {StandardSubwalletId} from "../constants";
import {Source} from "./Source";

export class WalletV3Contract extends Contracts.ContractBase implements StandardWalletContract {
    private publicKey: Uint8Array

    private subwalletId: number

    private version: WalletV3Versions

    constructor (workchain: 0, publicKey: Uint8Array, subwalletId = StandardSubwalletId, version: WalletV3Versions = "org.ton.wallets.v3.r2") {
        const code = version === "org.ton.wallets.v3" ? Source.WalletV3() : Source.WalletV3R2()

        const storage = new Builder()
            .storeUint(0, 32)
            .storeUint(subwalletId, 32)
            .storeBytes(publicKey)
            .cell()

        super(workchain, code, storage)

        this.publicKey = publicKey
        this.subwalletId = subwalletId
        this.version = version
    }

    public createTransferMessage (
        transfers: StandardWalletTransfer[],    // array of transfers
        seqno: number,                  // sequence transfer number
        timeout: number = 60            // timeout in seconds
    ): Contracts.MessageExternalIn {
        if (!transfers.length || transfers.length > 4) {
            throw new Error('ContractWalletV3: can make only 1 to 4 transfers per operation.')
        }

        const body = new Builder()
            .storeUint(this.subwalletId, 32)
            .storeUint(~~(Date.now() / 1000) + timeout, 32) // valid until
            .storeUint(seqno, 32)

        transfers.forEach((transfer) => {
            const internal = new Contracts.MessageInternal({
                bounce: transfer.destination.bounceable,
                src: Address.NONE,
                dest: transfer.destination,
                value: transfer.amount
            }, { body: transfer.body, state: transfer.init })

            body.storeUint(transfer.mode, 8).storeRef(internal.cell())
        })

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
