import styled from "styled-components";
import { mutate } from "swr";
import { LAYOUTS } from "../constants";
import { useGlobal } from "../context";
import { useElement } from "../context/element";
import { supabase } from "../supabaseClient";
import { Icon } from "./Icon";

type Props = {
  addElement: () => void;
};

export function EmptyState({ addElement }: Props) {
  const { session, currentLayout } = useGlobal();
  const { elements } = useElement();

  const addNewLayout = async () => {
    try {
      const name = "Unnamed Layout";
      const { error: err } = await supabase
        .from(LAYOUTS)
        .insert({ name, elements, user_id: session.user.id })
        .single();

      if (err) throw err;

      await mutate(LAYOUTS);
    } catch (e) {
      console.log(e);
    }
  };

  const hasNoElements = currentLayout && elements.length === 0;

  return (
    <StateContainer>
      <p>
        {hasNoElements
          ? "Let's start designing your layout"
          : "Create a new layout to get started"}
      </p>
      <div>
        {hasNoElements ? (
          <button onClick={addElement}>
            <Icon name="add_circle" />
          </button>
        ) : (
          <button onClick={addNewLayout}>
            <Icon name="library_add" />
          </button>
        )}
      </div>
    </StateContainer>
  );
}

const StateContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: var(--dark-grey);

  button {
    color: var(--purple);

    .icon {
      font-size: var(--h2);
    }
  }

  div {
    margin-top: var(--gap);
    display: flex;
    align-items: center;
  }
`;
