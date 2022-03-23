import DWContainer from "components/DWContainer"
import Nav from "components/Nav"

export default function Main () {
    const baseStyle = {
        width: '100%',
        background: "rgb(243, 243, 243)",
        display: 'grid',
        placeItems: 'center'
    }

    return (
        <main style={baseStyle}>
            <Nav/>
            <DWContainer/>
        </main>
    )
}