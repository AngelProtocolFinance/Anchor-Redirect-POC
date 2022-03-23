import { Box, Button, CircularProgress, CircularProgressLabel, Grid, Modal, ModalCloseButton, ModalContent, ModalOverlay, Progress, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Stack, Text } from "@chakra-ui/react";
import { Coin, MsgExecuteContract } from "@terra-money/terra.js";
import { useLCDClient } from "@terra-money/wallet-provider";
import axios from "axios";
import getDepositInfoURL from "functions/getDepositInfoURL"
import getYield from "functions/getYield";
import useAddress from "hooks/useAddress"
import { useEffect, useState } from "react"
import { useSetState } from "react-use";
import "./index.css";
import TxModal from "./Modal/TxModal";

const style = {
    width: '100%',
    maxWidth: '1250px',
    height: 'auto',
    display: "grid",
    gridTemplateColumns: "4fr 2fr",
    gap: "25px",
}

const earn_style = {
    width: '100%',
    minHeight: '300px',
    height: 'auto',
    display: 'grid',
    gridTemplateRows: '1fr 1fr',
    gap: '25px',
}

const earn_percentage = {
    width: '100%',
    minHeight: '300px',
    borderRadius: '15px',
    background: "white"
}

const title = {
    letterSpacing: "1px",
    fontSize: "1rem",
    fontWeight: "700",
    fontFamily: "Roboto",
}

const ust = {
    fontSize: '2.5rem',
    fontWeight: '400',
}

const amt = {
    fontSize: '2.5rem',
    fontWeight: '500',
}

const contract = "terra1tmmwv5h6jwgqvy4rxexpjdt6qrhkuzact59zt2";
const toTerraAmount = (amount: number | string) => + amount / 1000000;

enum Type {
    DEPOSIT = 0,
    WITHDRAW = 1,
}

const DWContainer = () => {
    const user_address = useAddress();
    const lcd = useLCDClient();

    const [info, setInfo] = useState<any>();
    const [msgs, setMsgs] = useState<any>([]);
    const [amount, setAmount] = useState<number>(0);
    const [percentage, setPercentage] = useState<number>(0);
    const [balance, setBalance] = useState<number>(0);
    const [open, setOpen] = useState<boolean>(false);
    const [exchangeRate, setExchangeRate] = useState<number>(1);
    const [type, setType] = useState(Type.DEPOSIT);

    const initialState = {
        day: 0,
        week: 0,
        month: 0,
        year: 0,
    }
    const [earn, setEarn] = useSetState(initialState);
    const [donate, setDonate] = useSetState(initialState);

    useEffect(() => {
        user_address && (async() => {
            const deposit_info = await getDepositInfoURL(lcd, contract, user_address);
            const [coins] = await lcd.bank.balance(user_address);

            const ust = coins
            .toData()
            .filter((coin: any) => coin.denom === "uusd")[0];

            setBalance(+ust.amount);

            if (deposit_info) {
                setInfo(deposit_info);
                const { data: blockInfo } = await axios.get("https://bombay-lcd.terra.dev/blocks/latest");
                const blockHeight = blockInfo.block.header.height;
    
                const epochRate = await getYield(+blockHeight);
                setExchangeRate(epochRate.result.exchange_rate);

                const promise = [];

                promise.push(getYield(+blockHeight + 14400));
                promise.push(getYield(+blockHeight + (14400 * 7)));
                promise.push(getYield(+blockHeight + (14400 * 30)));
                promise.push(getYield(+blockHeight + (14400 * 365)));

                const [
                    {
                        result: {
                            exchange_rate: dayRate
                        }
                    },
                    {
                        result: {
                            exchange_rate: weekRate
                        }
                    },
                    {
                        result: {
                            exchange_rate: monthRate
                        }
                    },
                    {
                        result: {
                            exchange_rate: yearRate
                        }
                    },
                ] = await Promise.all(promise);

                const pureDayYield = (+ust.amount * dayRate) - (+ust.amount * epochRate.result.exchange_rate);
                const pureWeekYield = (+ust.amount * weekRate) - (+ust.amount * epochRate.result.exchange_rate);
                const pureMonthYield = (+ust.amount * monthRate) - (+ust.amount * epochRate.result.exchange_rate);
                const pureYearYield = (+ust.amount * yearRate) - (+ust.amount * epochRate.result.exchange_rate);

                const donDayYield = pureDayYield * (+info.give_percentage / 100)
                const donWeekYield = pureWeekYield * (+info.give_percentage / 100)
                const donMonthYield = pureMonthYield * (+info.give_percentage / 100)
                const donYearYield = pureYearYield * (+info.give_percentage / 100)

                setEarn({
                    day: pureDayYield-donDayYield,
                    week: pureWeekYield-donWeekYield,
                    month: pureMonthYield-donMonthYield,
                    year: pureYearYield-donYearYield,
                })

                setDonate({
                    day: donDayYield,
                    week: donWeekYield,
                    month: donMonthYield,
                    year: donYearYield,
                })
            }

        })();
    }, [ user_address ]);

    const openModal = (type: number) => {
        setType(type);
        setOpen(true);
    }

    const goBack = () => {
        setOpen(false);
        setAmount(0);
        setPercentage(0);
    }

    const doMoney = () => {
        setOpen(false)
        const msgs = type === Type.DEPOSIT ? [new MsgExecuteContract(
            user_address,
            contract,
            {
                deposit_pool: {
                    percentage: percentage,
                }
            },
            [new Coin("uusd", ~~amount)]
        )] : [new MsgExecuteContract(
            user_address,
            contract,
            {
                withdraw_pool: {}
            }
        )]

        setMsgs(msgs);
    }

    return (
        <>
        <TxModal msgs={msgs}/>
        <Modal isOpen={open} onClose={() => null} isCentered size="xl">
            <ModalOverlay/>
            <ModalCloseButton/>
            <ModalContent>
                <Stack 
                padding="25px"
                height="300px"
                direction="column" 
                justifyContent="space-between">
                    <Stack direction="row" justifyContent="space-between">
                        <Text fontSize="1rem" fontWeight="500" textTransform="uppercase">
                            {type === Type.DEPOSIT ? "Deposit" : "Withdraw"} Amount
                            <Text
                            fontSize="2.25rem"
                            >{type === Type.DEPOSIT ?
                            toTerraAmount(amount).toFixed(2) :
                            (toTerraAmount(parseInt(info?.aust_amount ?? 0)) * exchangeRate).toFixed(2)
                            } UST</Text>
                        </Text>
                        <Stack direction="row" alignItems="center">
                            <Text>Yield Donation <br/> Percentage: </Text>
                            <Grid placeItems="center">
                            <CircularProgress size="75px" value={type === Type.DEPOSIT ? percentage : +info.give_percentage} color='green.400'>
                              <CircularProgressLabel>{type === Type.DEPOSIT ? percentage : +info.give_percentage}%</CircularProgressLabel>
                            </CircularProgress>
                            </Grid>
                        </Stack>
                    </Stack>
                    {type === Type.DEPOSIT &&  <Stack>
                   <Stack direction="row" gap="10px">
                    <Box>Deposit: </Box>
                    <Slider 
                    onChange={(val: number) => setAmount(val)}
                    className="slider" 
                    aria-label='slider-ex-1' 
                    defaultValue={0}
                    min={0}
                    max={balance}
                    step={0.01}>
                      <SliderTrack>
                        <SliderFilledTrack bg='#33CCCC'/>
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                    </Stack>

                    <Stack direction="row" gap="10px">
                    <Box>Percentage: </Box>
                    <Slider 
                    onChange={(val: number) => setPercentage(val)}
                    className="slider" 
                    aria-label='slider-ex-1' 
                    defaultValue={0}
                    min={0}
                    max={100}
                    step={1}>
                      <SliderTrack>
                        <SliderFilledTrack bg='#33CCCC'/>
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                    </Stack>
                    </Stack>}
                    <Stack direction="row" gap="10px" justifyContent="flex-end">
                        <Button 
                        onClick={goBack}
                        background="transparent"
                        border="2px solid #2d2d2d" 
                        color="#2d2d2d">Go Back</Button>
                        <Button
                        onClick={ doMoney }
                        color="white"
                        border="2px solid #2d2d2d" 
                        background="#2d2d2d"
                        >{type === Type.DEPOSIT ? "Deposit" : "Withdraw"}</Button>
                    </Stack>
                    </Stack>
            </ModalContent>
        </Modal>
        <section
        style={style}
        >
            <div style={earn_style}>
                <div className="earn_container">
                    <div>
                    <h1 style={title}>TOTAL DEPOSIT</h1>
                    <h1 style={ust}><span style={amt}>{
                        (toTerraAmount(parseInt(info?.aust_amount ?? 0)) * exchangeRate).toFixed(2)
                    }</span> UST</h1>
                    </div>
                    <div className="dw">
                        <button disabled={info !== undefined} onClick={() => openModal(Type.DEPOSIT)} className="trigger">Deposit</button>
                        <button disabled={!info} onClick={() => openModal(Type.WITHDRAW)} className="trigger w">Withdraw</button>
                    </div>
                </div>
                <div className="profit_container">
                    <Stack direction="column" gap="10px">
                        <Text fontSize="0.8rem" fontWeight="700" textTransform="uppercase">YIELD AMOUNT</Text>
                        <Stack direction="row" justifyContent="space-between" gap="10px">
                            <h1 className="compound">Year: {toTerraAmount(earn.year).toFixed(2)} UST</h1>
                            <h1 className="compound">Month: {toTerraAmount(earn.month).toFixed(2)} UST</h1>
                            <h1 className="compound">Week: {toTerraAmount(earn.week).toFixed(2)} UST</h1>
                            <h1 className="compound">Day: {toTerraAmount(earn.day).toFixed(2)} UST</h1>
                        </Stack>
                    </Stack>
                    <Stack direction="column" gap="10px">
                        <Text fontSize="0.8rem" fontWeight="700" textTransform="uppercase">DONATION AMOUNT</Text>
                        <Stack direction="row" justifyContent="space-between" gap="10px">
                            <h1 className="compound">Year: {toTerraAmount(donate.year).toFixed(2)} UST</h1>
                            <h1 className="compound">Month: {toTerraAmount(donate.month).toFixed(2)} UST</h1>
                            <h1 className="compound">Week: {toTerraAmount(donate.week).toFixed(2)} UST</h1>
                            <h1 className="compound">Day: {toTerraAmount(donate.day).toFixed(2)} UST</h1>
                        </Stack>
                    </Stack>
                </div>
            </div>
            <div style={earn_percentage}>
                hello
            </div>
        </section>
        </>
    )
}

export default DWContainer;