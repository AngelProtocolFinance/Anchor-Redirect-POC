import {
  Stack,
  Text,
  Grid,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";
import { calculateEarn } from "functions/calculateEarn";
import getYearlyRate from "functions/getYearlyRate";
import { toTerraAmount } from "functions/toXAmount";
import { useEffect, useState } from "react";

const Percentages = ({ info, exchangeRate }: any) => {
  const [yearlyRate, setYearlyRate] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const yearlyRate = await getYearlyRate();
      setYearlyRate(yearlyRate);
    })();
  }, []);

  return (
    <div className="percentages">
      <Stack>
        <Text fontSize="0.8rem" fontWeight="700" textTransform="uppercase">
          Total Donated
        </Text>
        <Text fontSize="2rem" fontWeight="700">
          {info
            ? toTerraAmount(
                +info.total_donated + calculateEarn(info, exchangeRate).to_angel
              ).toFixed(6)
            : (0).toFixed(6)}{" "}
          UST
        </Text>
      </Stack>
      <Stack direction="column" gap="25px" width="100%">
        <Stack direction="column" gap="10px">
          <Text fontSize="0.8rem" fontWeight="700" textTransform="uppercase">
            YIELD PERCENTAGE
          </Text>
          <Stack direction="row" gap="10px">
            <Grid placeItems="center">
              <CircularProgress
                size="75px"
                value={100 - (+info?.give_percentage || 0)}
                color="green.400"
              >
                <CircularProgressLabel>
                  {100 - (+info?.give_percentage || 0)}%
                </CircularProgressLabel>
              </CircularProgress>
            </Grid>
            <Text fontSize="3rem" fontWeight="700">
              {(
                yearlyRate -
                (yearlyRate * (+info?.give_percentage || 0)) / 100
              ).toFixed(2)}
              %
            </Text>
          </Stack>
        </Stack>
        <Stack direction="column" gap="10px">
          <Text fontSize="0.8rem" fontWeight="700" textTransform="uppercase">
            DONATE PERCENTAGE
          </Text>
          <Stack direction="row" gap="10px">
            <Grid placeItems="center">
              <CircularProgress
                size="75px"
                value={+info?.give_percentage || 0}
                color="green.400"
              >
                <CircularProgressLabel>
                  {+info?.give_percentage || 0}%
                </CircularProgressLabel>
              </CircularProgress>
            </Grid>
            <Text fontSize="3rem" fontWeight="700">
              {((yearlyRate * (+info?.give_percentage || 0)) / 100).toFixed(2)}%
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};

export default Percentages;
