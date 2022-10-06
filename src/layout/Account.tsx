import styled from "styled-components";
import { supabase } from "../supabaseClient";
import { Icon } from "../components/Icon";
import { useGlobal } from "../context";

export function Account() {
  const { session } = useGlobal();

  return (
    <AccountWrapper aria-live="polite">
      <h6>{session.user.email}</h6>

      <button onClick={() => supabase.auth.signOut()}>
        <Icon name="logout" />
      </button>
    </AccountWrapper>
  );
}

const AccountWrapper = styled.div`
  border-top: 1px solid var(--line-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--dark-grey);
  padding: var(--gap-small) 0 0;
  justify-self: flex-end;
`;
