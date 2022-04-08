import { toTerraAmount } from "./toXAmount";

export const calculateEarn = (info: any, exchangeRate: any) => {

    const ust_amount = parseInt(info?.ust_amount ?? 0);
    const aust_amount = parseInt(info?.aust_amount ?? 0);
    const percentage = parseInt(info?.give_percentage ?? 0);

    const diff = aust_amount * exchangeRate - ust_amount;
    const to_angel = diff * percentage / 100;
    const to_user = toTerraAmount(aust_amount * exchangeRate - to_angel);
    return to_user.toFixed(3);
};