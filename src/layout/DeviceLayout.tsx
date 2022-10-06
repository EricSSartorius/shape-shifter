import styled from "styled-components";
import { Icon } from "../components/Icon";
import { useGlobal } from "../context";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../constants";
import { DynamicElement } from "../components/DynamicElement";
import { useElement } from "../context/element";
import { EmptyState } from "../components/EmptyState";

export function DeviceLayout() {
  const { toggleSettings, currentLayout } = useGlobal();
  const { elements, setElements, setSelectedElement, addElement } =
    useElement();

  const deselectElements = () => {
    setSelectedElement(null);
  };

  return (
    <div>
      <Device>
        <Screen onClick={deselectElements}>
          {currentLayout && elements?.length > 0 ? (
            elements.map((element) => (
              <DynamicElement key={element.id} element={element} />
            ))
          ) : (
            <EmptyState addElement={addElement} />
          )}
        </Screen>
        <div className="buttons">
          <button className="device-button" onClick={toggleSettings}>
            <Icon name="layers" />
          </button>
          <button
            className="device-button"
            disabled={elements.length >= 5}
            onClick={addElement}
          >
            <Icon name="add_circle" />
          </button>

          <button
            className="device-button"
            disabled={elements.length <= 0}
            onClick={() => {
              setElements([]);
            }}
          >
            <Icon name="delete_forever" />
          </button>
        </div>
      </Device>
    </div>
  );
}

const Device = styled.div`
  --border-width: 16px;
  --border-height: 60px;

  position: relative;
  width: calc(${SCREEN_WIDTH}px + var(--border-width) * 2);
  height: calc(${SCREEN_HEIGHT}px + var(--border-height) * 2);
  margin: auto;
  border: var(--border-width) black solid;
  color: var(--white);
  border-top-width: var(--border-height);
  border-bottom-width: var(--border-height);
  border-radius: 36px;
  box-shadow: var(--shadow);

  .buttons {
    display: flex;
    justify-content: space-around;
    padding: 10px 0 8px;

    .device-button {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      color: var(--white);

      :nth-child(2) {
        .icon {
          font-size: var(--h3);
        }
        align-self: center;
      }

      :hover {
        opacity: 0.8;
      }

      :disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }

  /* The horizontal line on the top of the device */
  :before {
    content: "";
    display: block;
    width: 60px;
    height: 5px;
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #333;
    border-radius: 10px;
  }
`;

const Screen = styled.div`
  width: ${SCREEN_WIDTH}px;
  height: ${SCREEN_HEIGHT}px;
  background: var(--screen-bg);
  position: relative;
  box-shadow: var(--shadow-0);
`;
