import { Stack, Text } from "@chakra-ui/react";
import { useLCDClient } from "@terra-money/wallet-provider";
import axios from "axios";
import { REDIR_CONTRACT } from "constants/constants";
import getDepositInfoURL from "functions/getDepositInfoURL";
import getYearlyRate from "functions/getYearlyRate";
import getYield from "functions/getYield";
import { toTerraAmount } from "functions/toXAmount";
import useAddress from "hooks/useAddress";
import { useEffect } from "react";

const Profit = ({
  setBalance,
  setInfo,
  setExchangeRate,
  setEarn,
  setDonate,
  earn,
  donate,
}: any) => {
  const user_address = useAddress();
  const lcd = useLCDClient();

  useEffect(() => {
    user_address &&
      (async () => {
        const deposit_info = await getDepositInfoURL(
          lcd,
          REDIR_CONTRACT,
          user_address
        );
        const [coins] = await lcd.bank.balance(user_address);

        const ust = coins
          .toData()
          .filter((coin: any) => coin.denom === "uusd")[0];

        setBalance(+ust.amount);

        if (deposit_info) {
          setInfo(deposit_info);
          const { data: blockInfo } = await axios.get(
            "https://bombay-lcd.terra.dev/blocks/latest"
          );
          const blockHeight = blockInfo.block.header.height;

          const epochRate = await getYield(+blockHeight);
          setExchangeRate(epochRate.result.exchange_rate);

          const yearlyRate = await getYearlyRate();

          const pureYearYield = +deposit_info.ust_amount * (yearlyRate / 100);
          const pureMonthYield = pureYearYield / 12;
          const pureWeekYield = pureYearYield / 52.1429;
          const pureDayYield = pureYearYield / 365;

          const donDayYield =
            pureDayYield * (+deposit_info.give_percentage / 100);
          const donWeekYield =
            pureWeekYield * (+deposit_info.give_percentage / 100);
          const donMonthYield =
            pureMonthYield * (+deposit_info.give_percentage / 100);
          const donYearYield =
            pureYearYield * (+deposit_info.give_percentage / 100);

          setEarn({
            day: pureDayYield - donDayYield,
            week: pureWeekYield - donWeekYield,
            month: pureMonthYield - donMonthYield,
            year: pureYearYield - donYearYield,
          });

          setDonate({
            day: donDayYield,
            week: donWeekYield,
            month: donMonthYield,
            year: donYearYield,
          });
        }
      })();
  }, [user_address]);

  return (
    <div className="profit_container">
      <Stack direction="column" gap="10px">
        <Text fontSize="0.8rem" fontWeight="700" textTransform="uppercase">
          YIELD AMOUNT
        </Text>
        <Stack direction="row" justifyContent="space-between" gap="10px">
          <h1 className="compound">
            Year: <span>{toTerraAmount(earn.year).toFixed(2)} UST</span>
          </h1>
          <h1 className="compound">
            Month: <span>{toTerraAmount(earn.month).toFixed(2)} UST</span>
          </h1>
          <h1 className="compound">
            Week: <span>{toTerraAmount(earn.week).toFixed(2)} UST</span>
          </h1>
          <h1 className="compound">
            Day: <span>{toTerraAmount(earn.day).toFixed(2)} UST</span>
          </h1>
        </Stack>
      </Stack>
      <Stack direction="column" gap="10px">
        <Text fontSize="0.8rem" fontWeight="700" textTransform="uppercase">
          DONATION AMOUNT
        </Text>
        <Stack direction="row" justifyContent="space-between" gap="10px">
          <h1 className="compound">
            Year: <span>{toTerraAmount(donate.year).toFixed(2)} UST</span>
          </h1>
          <h1 className="compound">
            Month: <span>{toTerraAmount(donate.month).toFixed(2)} UST</span>
          </h1>
          <h1 className="compound">
            Week: <span>{toTerraAmount(donate.week).toFixed(2)} UST</span>
          </h1>
          <h1 className="compound">
            Day: <span>{toTerraAmount(donate.day).toFixed(2)} UST</span>
          </h1>
        </Stack>
      </Stack>
    </div>
  );
};

export default Profit;
