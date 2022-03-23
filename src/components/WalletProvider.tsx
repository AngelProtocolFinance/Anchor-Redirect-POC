import { useWallet } from "@terra-money/wallet-provider"
import { WalletStatus } from "@terra-money/wallet-provider";
import { sliced } from "functions/sliceAddress";
import useAddress from "hooks/useAddress";

const button = {
    padding: '10px 30px',
    height: 'fit-content',
    borderRadius: '10px',
    fontSize: '1rem',
    background: "white",
    color: "#2d2d2d",
    fontFamily: "Roboto",
}

const InitializingButton = () => {

    return (
        <button style={button}>LOADING...</button>
    )
}

const ConnectedButton = ({addr}: any) => {
    const { disconnect } = useWallet();

    return (
        <button onClick={ disconnect }
        style={button}>{sliced(addr, 5, -5)}</button>
    )
}

const ConnectButton = () => {
    const { connect } = useWallet();

    return (
        <button onClick={() => connect()} 
        style={button}>CONNECT WALLET</button>
    ) 
}


const WalletProvider = () => {
    const { status } = useWallet();
    const user_address = useAddress();

    if (status === WalletStatus.INITIALIZING)
        return <InitializingButton/>
    else if (status === WalletStatus.WALLET_CONNECTED)
        return <ConnectedButton addr={user_address}/>
    else {
        return <ConnectButton/>
    }
}

export default WalletProvider;