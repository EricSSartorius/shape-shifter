import styled from "styled-components"
import { Logo } from "./components/Logo"
import { Spinner } from "./components/Spinner"
import { PanelButton } from "./components/PanelButton"
import { useGlobal } from "./context"
import Auth from "./layout/Auth"
import { DeviceLayout } from "./layout/DeviceLayout"
import { ElementSettings } from "./layout/ElementSettings"
import { LayoutSettings } from "./layout/LayoutSettings"

function App() {
  const { session, layouts } = useGlobal()

  if (!session && !layouts) return <Spinner />

  return (
    <Main>
      {!session ? (
        <Auth />
      ) : (
        <>
          <LayoutSettings />
          <DeviceLayout />
          <ElementSettings />
          <PanelButton />
        </>
      )}
      <Logo />
    </Main>
  )
}

export default App

const Main = styled.main`
  margin: 0 auto;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  .logo {
    position: absolute;
    bottom: var(--gutter-width);
    right: var(--gutter-width);
  
    opacity: 0.2;
    z-index: -1;
  }

  @media screen and (max-width: 768px) {
    .logo {
      left: var(--gutter-width);
      transform: scale(0.7);
      top: 2px;
      margin: 0 auto;
    }
`
