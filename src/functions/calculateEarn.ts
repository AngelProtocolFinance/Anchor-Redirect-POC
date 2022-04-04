import { toTerraAmount } from "./toXAmount";

export const calculateEarn = (info: any, exchangeRate: any) => {
    let diff;

    const ust_amount = parseInt(info?.ust_amount ?? 0);
    const aust_amount = parseInt(info?.aust_amount ?? 0);
    const percentage = parseInt(info?.percentage ?? 0);

    let truncExchange = Math.trunc(exchangeRate * 1000000000) / 1000000000;

    if (ust_amount > aust_amount) {
      diff = 0;
    } else {
      diff = aust_amount * truncExchange - ust_amount;
    }
    const to_angel = diff * percentage / 100;
    const to_user = toTerraAmount(aust_amount * truncExchange - to_angel);
    return Math.trunc(to_user * 1000) / 1000;
};