import { Coin, MsgExecuteContract } from "@terra-money/terra.js";
import { useWallet } from "@terra-money/wallet-provider";
import useAddress from "hooks/useAddress";
import { useEffect, useState } from "react";
import { useSetState } from "react-use";
import TxModal from "../Modal/TxModal";
import { REDIR_CONTRACT } from "constants/constants";
import DWModal from "./DWModal";
import Percentages from "./Percentages";
import Profit from "./Profit";
import Earn from "./Earn";

import "../index.css";

export enum Type {
  DEPOSIT = 0,
  WITHDRAW = 1,
}

const DWContainer = () => {
  const { status } = useWallet();
  const user_address = useAddress();

  const [info, setInfo] = useState<any>();
  const [msgs, setMsgs] = useState<any>([]);
  const [amount, setAmount] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(5);
  const [balance, setBalance] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [type, setType] = useState(Type.DEPOSIT);

  const initialState = {
    day: 0,
    week: 0,
    month: 0,
    year: 0,
  };
  const [earn, setEarn] = useSetState(initialState);
  const [donate, setDonate] = useSetState(initialState);

  const openModal = (type: number) => {
    setType(type);
    setOpen(true);
  };

  const goBack = () => {
    setOpen(false);
    setAmount(0);
    setPercentage(5);
  };

  const doMoney = () => {
    setOpen(false);
    const msgs =
      type === Type.DEPOSIT
        ? [
            new MsgExecuteContract(
              user_address,
              REDIR_CONTRACT,
              {
                deposit_pool: {
                  percentage: percentage,
                },
              },
              [new Coin("uusd", Math.floor(amount))]
            ),
          ]
        : [
            new MsgExecuteContract(user_address, REDIR_CONTRACT, {
              withdraw_pool: {
                withdraw_amount: "" + amount,
              },
            }),
          ];

    setMsgs(msgs);
  };

  return (
    <>
      <TxModal msgs={msgs} goBack={goBack} />
      <DWModal
        open={open}
        type={type}
        exchangeRate={exchangeRate}
        amount={amount}
        info={info}
        percentage={percentage}
        balance={balance}
        setAmount={setAmount}
        setPercentage={setPercentage}
        goBack={goBack}
        doMoney={doMoney}
      />
      <section className="dw_container">
        <div className="earn_style">
          <Earn
            info={info}
            openModal={openModal}
            exchangeRate={exchangeRate}
            status={status}
          />
          <Profit
            setBalance={setBalance}
            setAmount={setAmount}
            setInfo={setInfo}
            setExchangeRate={setExchangeRate}
            setEarn={setEarn}
            setDonate={setDonate}
            earn={earn}
            donate={donate}
          />
        </div>
        <Percentages info={info} exchangeRate={exchangeRate} />
      </section>
    </>
  );
};

export default DWContainer;

