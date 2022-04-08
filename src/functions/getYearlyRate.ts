import axios from "axios";

const getYearlyRate = async () => {
    const {data: [ deposit_rate ]} = await axios.get("https://api-testnet.anchorprotocol.com/api/v2/deposit-rate");
    return deposit_rate.deposit_rate * 4600000 * 100;
}

export default getYearlyRate;