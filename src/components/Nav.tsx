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
  width: "100%",
  maxWidth: "1250px",
  height: "100%",
  display: "flex",
  FlexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "1.5rem",
  fontWeight: "700",
};

const Nav = () => {
  return (
    <nav style={nav}>
      <div style={container}>
        <h1>ANGELIC YIELD POC</h1>
        <WalletProvider />
      </div>
    </nav>
  );
};

export default Nav;