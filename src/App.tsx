import { AnimatePresence } from "framer-motion"
import styled from "styled-components"
import { Logo } from "./components/Logo"
import { Spinner } from "./components/Spinner"
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
      <AnimatePresence>
        {!session ? (
          <Auth />
        ) : (
          <>
            <LayoutSettings />
            <DeviceLayout />
            <ElementSettings />
          </>
        )}
      </AnimatePresence>
      <Logo />
    </Main>
  )
}

export default App

const Main = styled.main`
  max-width: 1290px;
  margin: 0 auto;
  padding: var(--gap-large);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  .logo {
    position: absolute;
    bottom: var(--gap-large);
    right: var(--gap-large);
    opacity: 0.2;
  }
`
