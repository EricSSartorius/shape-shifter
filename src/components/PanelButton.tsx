import styled from "styled-components"
import { usePanels } from "../context"
import { Card } from "./Card"
import { Icon } from "./Icon"

export function PanelButton() {
  const { toggleLayoutPanel, toggleElementPanel } = usePanels()

  return (
    <PanelWrapper>
      <button onClick={toggleLayoutPanel}>
        <Icon name="layers" />
      </button>
      <button onClick={toggleElementPanel}>
        <Icon name="category" />
      </button>
    </PanelWrapper>
  )
}

const PanelWrapper = styled(Card)`
  position: fixed;
  bottom: calc(var(--gap-large) * 4);
  box-shadow: var(--shadow-2);
  right: 0;
  padding: var(--gap-small);
  border-radius: var(--radius) 0 0 var(--radius);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  button + button {
    margin-top: var(--gap-small);
  }

  .icon {
    font-size: var(--font-size-large);
  }

  :hover {
    opacity: 1;
    transition: opacity var(--transition) box-shadow;
    box-shadow: var(--shadow-2);
  }
`
