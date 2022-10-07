import { createContext, FC, useContext, useState } from "react"

// Global context for panels

export const initialPanelValues = {
  toggleLayoutPanel: () => {},
  toggleElementPanel: () => {},
  togglePanels: () => {},
  isLayoutPanelShowing: true,
  isElementPanelShowing: true,
}

export const PanelContext = createContext(initialPanelValues)

export const PanelProvider: FC = ({ children }) => {
  const [isLayoutPanelShowing, setIsLayoutPanelShowing] = useState(true)
  const [isElementPanelShowing, setIsElementPanelShowing] = useState(true)

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
