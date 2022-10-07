import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import styled from "styled-components"
import { useElement } from "../context/element"
import { Icon } from "../components/Icon"
import { useGlobal, usePanels } from "../context"
import { ELEMENT_LIMIT, LAYOUTS, LAYOUT_LIMIT } from "../constants"
import { supabase } from "../supabaseClient"
import { useRef } from "react"
import { mutate } from "swr"
import { Card } from "../components/Card"
import { Account } from "./Account"
import { useClickOutside } from "../hooks/useClickOutside"
import { Portal } from "../components/Portal"

export function LayoutSettings() {
  const { session, layouts, error, currentLayout, setCurrentLayout } = useGlobal()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedLayoutName, setSelectedLayoutName] = useState<string>("")
  const { setSelectedElement, setElements } = useElement()
  const { isLayoutPanelShowing } = usePanels()

  const changeLayout = (id: string | undefined) => {
    setSelectedElement(null)
    setCurrentLayout(id)
  }

  const changeLayoutName = (e) => {
    setSelectedLayoutName(e.target.value)
  }

  const addNewLayout = async () => {
    try {
      // Create a default name for the layout
      const DEFAULT_NAME = "Unnamed Layout"
      const defaultNameCount = layouts?.filter((layout) => layout.name.includes(DEFAULT_NAME))?.length
      const name = defaultNameCount > 0 ? `${DEFAULT_NAME} ${defaultNameCount + 1}` : DEFAULT_NAME

      const { error: err } = await supabase
        .from(LAYOUTS)
        .insert({ name, elements: [], user_id: session.user.id })
        .single()

      if (err) throw err

      const { data } = await mutate(LAYOUTS)
      changeLayout(data[0].id)
    } catch (e) {
      console.log(e)
    }
  }

  const updateLayout = async () => {
    try {
      const { error: err } = await supabase
        .from(LAYOUTS)
        .update({ name: selectedLayoutName })
        .eq("id", currentLayout?.id)

      if (err) throw err

      setSelectedLayoutName("")
      await mutate(LAYOUTS)
    } catch (e) {
      console.log(e)
    }
  }

  const removeLayout = async (id: number) => {
    try {
      if (id === currentLayout?.id) {
        changeLayout(layouts?.[0])
      }
      const { error: err } = await supabase.from(LAYOUTS).delete().eq("id", id)

      if (err) throw err

      const { data } = await mutate(LAYOUTS)
      if (!data?.length) {
        setElements([])
      }
    } catch (e) {
      console.log(e)
    }
  }

  const startEditing = () => {
    if (currentLayout) {
      setIsEditing(true)
      setSelectedLayoutName(currentLayout?.name)
    }
  }

  const stopEditing = async () => {
    setIsEditing(false)

    if (selectedLayoutName !== currentLayout?.name && selectedLayoutName) {
      await updateLayout()
    }

    setSelectedLayoutName("")
  }

  useClickOutside(inputRef, () => stopEditing())

  const layoutLimitReached = layouts?.length >= LAYOUT_LIMIT

  const elementLimitReached = currentLayout?.elements.length >= ELEMENT_LIMIT

  return (
    <Portal>
      <AnimatePresence>
        {isLayoutPanelShowing && (
          <Panel
            exit={{ opacity: 0, y: 200, x: -400 }}
            initial={{ opacity: 0, y: 200, x: -400 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
          >
            {error ? (
              <p className="error-text">{error.message}</p>
            ) : (
              <>
                <div className="header">
                  <AnimatePresence>
                    {isEditing ? (
                      <motion.input
                        exit={{ opacity: 0, y: -10 }}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        ref={inputRef}
                        type="text"
                        value={selectedLayoutName}
                        onChange={changeLayoutName}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            stopEditing()
                          }
                        }}
                      />
                    ) : (
                      <motion.h3
                        style={{ cursor: !!currentLayout ? "pointer" : "auto" }}
                        exit={{ opacity: 0, y: 10 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={startEditing}
                      >
                        {currentLayout && <Icon name="edit" />}
                        {currentLayout?.name || "Layouts"}
                      </motion.h3>
                    )}
                  </AnimatePresence>
                  <button onClick={addNewLayout} disabled={layoutLimitReached}>
                    <Icon name="library_add" />
                  </button>
                </div>
                <ul>
                  {layouts?.map((layout) => (
                    <li key={layout.id}>
                      <h4
                        className={`${layout.id === currentLayout?.id ? "active" : ""}`}
                        onClick={() => changeLayout(layout.id)}
                      >
                        {layout.name}
                      </h4>

                      <div className="buttons">
                        <button onClick={() => removeLayout(layout.id)}>
                          <Icon name="remove" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                {layoutLimitReached && (
                  <p className="notice">
                    You have reached the layout limit ({LAYOUT_LIMIT}) for this plan. Upgrade for more layouts.
                  </p>
                )}
                {elementLimitReached && (
                  <p className="notice">
                    You have reached the element limit ({ELEMENT_LIMIT}) for this plan. Upgrade for more elements.
                  </p>
                )}
              </>
            )}
            <Account />
          </Panel>
        )}
      </AnimatePresence>
    </Portal>
  )
}

const Panel = styled(Card)`
  position: fixed;
  top: var(--gutter-width);
  left: var(--gutter-width);
  bottom: var(--gutter-width);
  width: calc(var(--panel-width) + 50px);
  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid var(--line-color);
    padding-bottom: var(--gap-small);

    h3 {
      font-weight: var(--semi-bold-weight);
      color: var(--purple);
      width: 100%;
      padding: 0 8px 6px;
      flex: 2;
      display: inline-flex;
      align-items: center;

      .icon {
        margin-right: var(--gap-small);
      }
    }

    input {
      padding: 1px 8px;
      font-size: var(--font-size-small);
      width: 100%;
      margin-right: var(--gap-small);
    }
  }

  .error-text {
    color: var(--red);
    flex: 2;
  }

  .notice {
    color: var(--grey);
    font-size: var(--font-size-small);

    margin-bottom: var(--gap);
  }

  .buttons {
    flex-shrink: 0;
  }

  ul {
    flex: 2;
    margin-top: var(--gap-large);

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;

      :hover {
        opacity: 0.8;
      }
      .active {
        color: var(--primary);
      }

      h4 {
        cursor: pointer;
        margin-right: var(--gap-small);
        transition: var(--transition) color;
      }

      .icon {
        color: var(--text);
        vertical-align: middle;
      }
    }

    li + li {
      margin-top: var(--gap-small);
    }
  }
`
