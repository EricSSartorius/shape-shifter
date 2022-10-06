import { FC, useState, createContext, useContext, useEffect } from "react";
import { mutate } from "swr";
import { LAYOUTS, DEFAULT_ELEMENT_COLOR } from "../constants";
import { supabase } from "../supabaseClient";
import { useGlobal } from "./global";

// Global context for elements

export const initialElementValues = {
  selectedElement: null,
  setSelectedElement: (_: Element | null) => {},
  updateElement: (_: Element) => {},
  elements: [],
  updateLayoutElement: () => {},
  setElements: (_: Element[]) => {},
  removeElement: (_: string) => {},
  addElement: () => {},
};

export type Element = {
  translate: number[];
  rotate: number;
  color: string;
  id: string;
  height: number;
  width: number;
};

const defaultElement = {
  translate: [0, 0, 0, 0],
  rotate: 0,
  color: DEFAULT_ELEMENT_COLOR,
  height: 100,
  width: 150,
};

export const ElementContext = createContext(initialElementValues);

export const ElementProvider: FC = ({ children }) => {
  const { currentLayout } = useGlobal();
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [elements, setElements] = useState<Element[]>(
    currentLayout?.elements || []
  );

  const updateLayoutElement = async () => {
    if (!currentLayout) return;

    if (elements !== currentLayout.elements) {
      try {
        const { error: err } = await supabase
          .from(LAYOUTS)
          .update({ elements })
          .eq("id", currentLayout?.id);

        if (err) throw err;

        await mutate(LAYOUTS);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const updateElement = (element: Element) => {
    setSelectedElement(element);
    setElements((prev) => {
      const index = prev.findIndex((el) => el.id === element.id);
      const newElements = [...prev];
      newElements[index] = element;
      return newElements;
    });
  };

  const removeElement = (id: string) => {
    setSelectedElement(null);
    setElements((prev) => {
      return prev.filter((el) => el.id !== id);
    });
  };

  const addElement = () => {
    const id = `${currentLayout.id}-${elements.length}`;
    const newElement = {
      ...defaultElement,
      id,
    };
    setElements((prev) => {
      return [...prev, newElement];
    });
    setSelectedElement(newElement);
  };

  useEffect(() => {
    updateLayoutElement();
  }, [elements]);

  useEffect(() => {
    if (currentLayout) {
      setElements(currentLayout?.elements || []);
    }
  }, [currentLayout]);

  return (
    <ElementContext.Provider
      value={{
        selectedElement,
        setSelectedElement,
        updateLayoutElement,
        updateElement,
        removeElement,
        elements,
        addElement,
        setElements,
      }}
    >
      {children}
    </ElementContext.Provider>
  );
};

export const useElement = () => useContext(ElementContext);
