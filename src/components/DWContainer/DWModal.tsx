import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  Grid,
  CircularProgress,
  CircularProgressLabel,
  Box,
  Button,
  Input,
} from "@chakra-ui/react";
import { calculateEarn } from "functions/calculateEarn";
import { toChainAmount, toTerraAmount } from "functions/toXAmount";
import { Type } from ".";

const DWModal = ({
  open,
  type,
  exchangeRate,
  amount,
  info,
  percentage,
  setAmount,
  setPercentage,
  goBack,
  doMoney,
}: any) => {
  return (
    <Modal isOpen={open} onClose={() => null} isCentered size="xl">
      <ModalOverlay />
      <ModalCloseButton />
      <ModalContent>
        <Stack
          padding="25px"
          height="300px"
          direction="column"
          justifyContent="space-between"
        >
          <Stack direction="row" justifyContent="space-between">
            <Text fontSize="1rem" fontWeight="500" textTransform="uppercase">
              {type === Type.DEPOSIT ? "Deposit" : "Withdraw"} Amount
              <Text fontSize="2.25rem">
                {toTerraAmount(amount).toFixed(2)} UST
              </Text>
            </Text>
            <Stack direction="row" alignItems="center">
              <Text>
                Yield Donation <br /> Percentage:{" "}
              </Text>
              <Grid placeItems="center">
                <CircularProgress
                  size="75px"
                  value={
                    type === Type.DEPOSIT ? percentage : +info.give_percentage
                  }
                  color="green.400"
                >
                  <CircularProgressLabel>
                    {type === Type.DEPOSIT ? percentage : +info.give_percentage}
                    %
                  </CircularProgressLabel>
                </CircularProgress>
              </Grid>
            </Stack>
          </Stack>
          <Stack>
            <Stack direction="row" gap="10px">
              <Box>{type === Type.DEPOSIT ? "Deposit: " : "Withdraw: "}</Box>
              <Input
                type="number"
                onChange={(e: any) => setAmount(toChainAmount(e.target.value))}
              />
            </Stack>

            {type === Type.DEPOSIT && (
              <Stack direction="row" gap="10px">
                <Box>Percentage: </Box>
                <Slider
                  onChange={(val: number) => setPercentage(val)}
                  className="slider"
                  aria-label="slider-ex-1"
                  defaultValue={0}
                  min={5}
                  max={100}
                  step={1}
                >
                  <SliderTrack>
                    <SliderFilledTrack bg="#33CCCC" />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </Stack>
            )}
          </Stack>
          <Stack direction="row" gap="10px" justifyContent="flex-end">
            <Button
              onClick={goBack}
              background="transparent"
              border="2px solid #2d2d2d"
              color="#2d2d2d"
            >
              Go Back
            </Button>
            <Button
              onClick={doMoney}
              color="white"
              border="2px solid #2d2d2d"
              background="#2d2d2d"
            >
              {type === Type.DEPOSIT ? "Deposit" : "Withdraw"}
            </Button>
          </Stack>
        </Stack>
      </ModalContent>
    </Modal>
  );
};

export default DWModal;
