import React, { FC } from "react"
import { GlobalProvider } from "./global"
import { ElementProvider } from "./element"
import { PanelProvider } from "./panels"

// Provider Composer imports all Providers so that we can isolate related state
// All state is managed through state hooks in the individual providers
function ProviderComposer({ contexts, children }) {
  return contexts.reduceRight(
    (kids, parent) =>
      React.cloneElement(parent, {
        children: kids,
      }),
    children
  )
}

export const ContextProvider: FC = ({ children }) => {
  return (
    <ProviderComposer contexts={[<GlobalProvider />, <ElementProvider />, <PanelProvider />]}>
      {children}
    </ProviderComposer>
  )
}
