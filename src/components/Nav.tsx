import WalletProvider from "./WalletProvider";


const nav = {
    width: '100%',
    height: '75px',
    display: "grid",
    placeItems: "center",
    marginBottom: '75px',
    background: '#2d2d2d',
    color: 'white'
}

const container = {
    width: '100%',
    maxWidth: '1250px',
    height: 'fit-content',
    display: "flex",
    FlexDirection: "row",
    justifyContent: "space-between"
}

const Nav = () => {

    return (
      <nav style={nav}>
        <div style={container}>
          <h1>TEMP LOGO</h1>
          <WalletProvider />
        </div>
      </nav>
    );
}

export default Nav;