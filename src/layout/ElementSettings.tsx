import { useEffect, useState } from "react"
import { ChromePicker } from "react-color"
import { AnimatePresence } from "framer-motion"
import styled, { css } from "styled-components"
import { Icon } from "../components/Icon"
import { useElement } from "../context/element"
import { Card } from "../components/Card"
import { usePanels } from "../context"
import { Portal } from "../components/Portal"

export function ElementSettings() {
  const { selectedElement, updateElement, removeElement } = useElement()
  const { isElementPanelShowing } = usePanels()

  const [color, setColor] = useState<string | undefined>(selectedElement?.color)

  const onChange = ({ hex }: { hex: string }) => {
    if (selectedElement) {
      setColor(hex)
      updateElement({ ...selectedElement, color: hex })
    }
  }

  useEffect(() => {
    setColor(selectedElement?.color)
  }, [selectedElement?.id])

  return (
    <Portal>
      <AnimatePresence>
        {isElementPanelShowing && (
          <Panel
            $isElementSelected={!!selectedElement}
            exit={{ opacity: 0, y: -200, x: 400 }}
            initial={{ opacity: 0, y: -200, x: 400 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
          >
            <>
              <ChromePicker width="100%" triangle="hide" color={color} onChangeComplete={onChange} disableAlpha />

              <div className="panel-content">
                <ul>
                  <li>
                    <span>X:</span> {selectedElement?.translate[0].toFixed(2)}
                  </li>
                  <li>
                    <span>Y:</span> {selectedElement?.translate[1].toFixed(2)}
                  </li>
                  <li>
                    <span>W:</span> {selectedElement?.width.toFixed(2)}
                  </li>
                  <li>
                    <span>H:</span> {selectedElement?.height.toFixed(2)}
                  </li>
                </ul>

                <button className="delete-button" onClick={() => removeElement(selectedElement?.id)}>
                  <Icon name="delete" />
                </button>
              </div>
            </>
          </Panel>
        )}
      </AnimatePresence>
    </Portal>
  )
}

const Panel = styled(Card)`
  ${({ $isElementSelected }: { $isElementSelected: boolean }) =>
    !$isElementSelected &&
    css`
      pointer-events: none;

      .chrome-picker,
      .panel-content {
        opacity: 0.5;
      }
    `};

  position: fixed;
  top: var(--gutter-width);
  right: var(--gutter-width);
  width: var(--panel-width);
  padding: var(--gap-small);
  opacity: 1;

  .panel-content {
    display: flex;
    flex-direction: column-reverse;
    padding: var(--gap-small);
    margin-top: var(--gap);

    ul {
      flex: 2;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: var(--gap);

      li span {
        color: var(--dark-grey);
      }
    }

    .delete-button {
      color: var(--red);
      align-self: flex-end;
    }
  }
`
