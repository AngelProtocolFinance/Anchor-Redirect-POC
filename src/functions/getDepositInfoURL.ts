import { useLCDClient } from "@terra-money/wallet-provider";

const getDepositInfoURL = async (lcd: any, contract: string, address: string) => {
    if (!address) return;

    try {
        const info = await lcd.wasm.contractQuery(contract, {
            deposit_info: {
                address
            }
        });
        return info;
    } catch {
        return null;
    }
}

export default getDepositInfoURL;