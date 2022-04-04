export const toTerraAmount = (amount: number | string) => +amount / 1000000;
export const toChainAmount = (amount: number | string) => +amount * 1000000;