import styled from "styled-components";
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Card } from "../components/Card";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <h1>Sign In to Begin</h1>
      <p className="description">
        Sign in via magic link with your email below
      </p>
      {loading ? (
        "Sending magic link..."
      ) : (
        <form onSubmit={handleLogin}>
          <label htmlFor="email">
            <span>Email</span>
            <input
              id="email"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <button aria-live="polite">Send magic link</button>
        </form>
      )}
    </AuthWrapper>
  );
}

const AuthWrapper = styled(Card)`
  display: flex;
  flex-direction: column;
  padding: var(--gap-large);

  p {
    color: var(--grey);
    margin-top: 4px;
    font-size: var(--font-size-small);
  }

  label {
    display: flex;
    flex-direction: column;
    margin: var(--gap-large) 0;
  }

  input {
    padding: var(--gap-small);
    margin-top: 2px;
  }

  button {
    width: 100%;
    text-align: center;
    background: var(--primary);
    color: var(--white);
    border-radius: var(--radius);
    padding: var(--gap-small);
    background-size: 200% auto;
    background-image: var(--gradient-button);
    transition: 0.5s;

    &:hover {
      background-position: right center;
    }
  }
`;
