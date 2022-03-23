import axios from "axios";

const getYield = async (blockHeight: number) => {
    const { data } = await axios.get(`https://bombay-lcd.terra.dev/wasm/contracts/terra15dwd5mj8v59wpj0wvt233mf5efdff808c5tkal/store?query_msg={%22epoch_state%22:{%22block_height%22:${blockHeight}}}&earn--epoch-states`);
    return data;
}

export default getYield;