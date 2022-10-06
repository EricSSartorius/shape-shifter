import useSWR from "swr";
import { LAYOUTS } from "../constants";
import { supabase } from "../supabaseClient";

type Layout = {
  id: number;
  name: string;
  elements: Element[];
};

// Fetch data from API

export function useLayouts() {
  const { data, error } = useSWR(
    LAYOUTS,
    async (url) =>
      await supabase.from(url).select("*").order("id", { ascending: false })
  );

  return {
    layouts: data?.data as Layout[],
    error: error || data?.error,
    isLoading: !error && !data,
  };
}
