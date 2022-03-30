import {
  Stack,
  Text,
  Grid,
  CircularProgress,
  CircularProgressLabel,
  Box,
} from "@chakra-ui/react";

const Percentages = ({ info }: any) => {
  return (
    <div className="percentages">
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
              {(19.52 - (19.52 * (+info?.give_percentage || 0)) / 100).toFixed(
                2
              )}
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
              {((19.52 * (+info?.give_percentage || 0)) / 100).toFixed(2)}%
            </Text>
          </Stack>
        </Stack>
      </Stack>
      <Box width="100%" height="100%" background="lightgrey"></Box>
    </div>
  );
};

export default Percentages;
