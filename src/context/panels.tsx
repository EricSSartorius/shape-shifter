import { createContext, FC, useContext, useState } from "react"
import { useLocalStorage } from "../hooks/useLocalStorage"

// Global context for panels

export const initialPanelValues = {
  toggleLayoutPanel: () => {},
  toggleElementPanel: () => {},
  togglePanels: () => {},
  isLayoutPanelShowing: false,
  isElementPanelShowing: false,
}

export const PanelContext = createContext(initialPanelValues)

export const PanelProvider: FC = ({ children }) => {
  const [isLayoutPanelShowing, setIsLayoutPanelShowing] = useState(false)
  const [isElementPanelShowing, setIsElementPanelShowing] = useState(false)

  // Hide/show settings

  const toggleLayoutPanel = () => {
    setIsLayoutPanelShowing(!isLayoutPanelShowing)
  }

  const toggleElementPanel = () => {
    setIsElementPanelShowing(!isElementPanelShowing)
  }

  const togglePanels = () => {
    let state = isLayoutPanelShowing && isElementPanelShowing
    setIsLayoutPanelShowing(!state)
    setIsElementPanelShowing(!state)
  }

  return (
    <PanelContext.Provider
      value={{
        toggleLayoutPanel,
        toggleElementPanel,
        togglePanels,
        isLayoutPanelShowing,
        isElementPanelShowing,
      }}
    >
      {children}
    </PanelContext.Provider>
  )
}

export const usePanels = () => useContext(PanelContext)
