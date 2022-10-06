import { useEffect } from "react";

/* function used to listen for a key press */
export function useKeyPress(code: string, handler: any, shouldListen: boolean) {
  useEffect(() => {
    const listener = (event: any) => {
      if (event.code === code && shouldListen) {
        handler(event);
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [handler, code, shouldListen]);
}
