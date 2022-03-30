import { WalletStatus } from "@terra-money/wallet-provider";
import { toTerraAmount } from "functions/toXAmount";
import { Type } from ".";

const Earn = ({ info, openModal, exchangeRate, balance, status }: any) => {
  return (
    <div className="earn_container">
      <div>
        <h1 className="title">TOTAL DEPOSIT</h1>
        <h1 className="ust">
          <span className="amt">
            {(
              toTerraAmount(parseInt(info?.aust_amount ?? 0)) * exchangeRate
            ).toFixed(2)}
          </span>{" "}
          UST
        </h1>
      </div>
      <div className="dw">
        <button
          disabled={
            info !== undefined ||
            status !== WalletStatus.WALLET_CONNECTED ||
            balance === 0
          }
          onClick={() => openModal(Type.DEPOSIT)}
          className="trigger"
        >
          Deposit
        </button>
        <button
          disabled={!info}
          onClick={() => openModal(Type.WITHDRAW)}
          className="trigger w"
        >
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default Earn;
