import { createContext, FC, useContext, useEffect, useMemo, useState } from "react"
import { Session } from "@supabase/supabase-js"
import { supabase } from "../supabaseClient"
import { useLayouts } from "../api/layouts"
import { useLocalStorage } from "../hooks/useLocalStorage"
import { LAYOUT_ID } from "../constants"

// Global context for layouts

export const initialGlobalValues = {
  session: null,
  currentLayout: undefined,
  setCurrentLayout: (_: string | undefined) => {},
  error: undefined,
  isLoading: undefined,
  layouts: undefined,
}

export const GlobalContext = createContext(initialGlobalValues)

export const GlobalProvider: FC = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)

  const { layouts, error, isLoading } = useLayouts()
  const [localLayoutId, setLocalLayoutId] = useLocalStorage(LAYOUT_ID)

  const currentLayout = useMemo(
    () => layouts?.find((layout) => layout.id === localLayoutId) || layouts?.[0],
    [layouts, localLayoutId]
  )

  const setCurrentLayout = (id: string | undefined) => {
    setLocalLayoutId(id)
  }

  // Initialize session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  const value = useMemo(
    () => ({
      session,
      layouts,
      currentLayout,
      setCurrentLayout,
      error,
      isLoading,
    }),
    [session, layouts, currentLayout, setCurrentLayout, error, isLoading]
  )

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
}

export const useGlobal = () => useContext(GlobalContext)
