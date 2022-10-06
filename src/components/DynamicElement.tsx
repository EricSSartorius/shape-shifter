import { useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import styled, { css } from "styled-components";
import Moveable from "react-moveable";
import {
  BACKSPACE,
  DEFAULT_ELEMENT_COLOR,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "../constants";
import { Element, useElement } from "../context/element";
import { useKeyPress } from "../hooks/useKeyPress";
import { useGlobal } from "../context";

type Props = { element: Element };

// Adjustable element/shape used in the device layout

export function DynamicElement({ element }: Props) {
  console.log("element", element);
  const { currentLayout } = useGlobal();
  const {
    setSelectedElement,
    updateElement,
    selectedElement,
    removeElement,
    elements,
  } = useElement();
  console.log("elements", elements);

  const targetRef = useRef(null);
  const isSelected = selectedElement?.id === element.id;

  const highlightElement = (e) => {
    if (!isSelected) {
      setSelectedElement(element);
    }
    e.stopPropagation();
  };

  const removeSelectedElement = () => {
    setSelectedElement(null);
    removeElement(element.id);
  };

  useEffect(() => {
    console.log("element.color", element.color);
    if (targetRef?.current) {
      targetRef.current.style.backgroundColor = element.color;
    }
  }, [element.color]);

  useEffect(() => {
    if (currentLayout && targetRef?.current) {
      const targetStyle = targetRef.current.style;

      targetStyle.width = `${element.width}px`;
      targetStyle.height = `${element.height}px`;
      targetStyle.transform = `translate(${element.translate[0]}px, ${element.translate[1]}px) rotate(${element.rotate}deg)`;
      targetStyle.backgroundColor = element.color;
    }
  }, [currentLayout?.id]);

  useKeyPress(BACKSPACE, removeSelectedElement, isSelected);

  return (
    <>
      <ElementDiv
        ref={targetRef}
        $isSelected={isSelected}
        onClick={highlightElement}
        onMouseDown={highlightElement}
      />
      <Moveable
        flushSync={flushSync}
        target={targetRef}
        bounds={{ left: 0, top: 0, right: SCREEN_WIDTH, bottom: SCREEN_HEIGHT }}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
        zoom={1}
        origin={false}
        snappable
        draggable
        throttleDrag={0}
        startDragRotate={0}
        throttleDragRotate={0}
        // DRAG
        onDragStart={(e) => {
          e.set(element.translate);
        }}
        onDrag={({ target, beforeTranslate }) => {
          target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px) rotate(${element.rotate}deg)`;
        }}
        onDragEnd={({ lastEvent }) => {
          if (lastEvent) {
            element.translate = lastEvent.beforeTranslate;

            updateElement({
              ...element,
              translate: lastEvent.beforeTranslate,
            });
          }
        }}
        // RESIZE
        resizable
        keepRatio={false}
        throttleResize={1}
        renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
        edge={false}
        onResizeStart={(e) => {
          e.setOrigin(["%", "%"]);
          e.dragStart && e.dragStart.set(element.translate);
        }}
        onResize={({ target, width, height, drag }) => {
          const beforeTranslate = drag.beforeTranslate;
          target.style.width = `${width}px`;
          target.style.height = `${height}px`;
          target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px) rotate(${element.rotate}deg)`;
        }}
        onResizeEnd={({ lastEvent }) => {
          if (lastEvent) {
            element.translate = lastEvent.drag.beforeTranslate;
            element.height = lastEvent.height;
            element.width = lastEvent.width;

            updateElement({
              ...element,
              height: lastEvent.height,
              width: lastEvent.width,
              translate: lastEvent.drag.beforeTranslate,
            });
          }
        }}
        // ROTATE
        rotatable={true}
        throttleRotate={0}
        rotationPosition={"top"}
        onRotateStart={(e) => {
          e.set(element.rotate);
        }}
        onRotate={({ target, beforeRotation }) => {
          target.style.transform = `translate(${element.translate[0]}px, ${element.translate[1]}px) rotate(${beforeRotation}deg)`;
        }}
        onRotateEnd={({ lastEvent }) => {
          if (lastEvent) {
            element.rotate = lastEvent.beforeRotation;
            updateElement({
              ...element,
              rotate: lastEvent.beforeRotation,
            });
          }
        }}
      />
    </>
  );
}

const ElementDiv = styled.div`
  position: absolute;
  width: 200px;
  height: 100px;
  top: 0;
  left: 0;
  background: ${DEFAULT_ELEMENT_COLOR};

  ${({ $isSelected }: { $isSelected: boolean }) =>
    $isSelected
      ? css`
          + .rCS1rb3a7w {
            --moveable-color: #4af;

            .moveable-control {
              display: block;
            }
            .moveable-line.moveable-rotation-line {
              background: #4af;
            }
          }
        `
      : css`
          + .rCS1rb3a7w {
            --moveable-color: none;

            .moveable-control {
              display: none;
            }
            ,
            .moveable-line.moveable-rotation-line {
              background: none;
            }
          }
        `};

  :hover {
    cursor: grab;

    + .rCS1rb3a7w {
      --moveable-color: #4af;
    }
  }

  :active {
    cursor: grabbing;
  }
`;
