export const sliced = (user_address: string, front: number, back: number) => user_address.slice(0, front) + "..." + user_address.slice(back);
