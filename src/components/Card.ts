import styled from "styled-components";
import { motion } from "framer-motion";

// Standardized Card Style

export const Card = styled(motion.div)`
  background: var(--sheet-bg);
  padding: var(--gap);
  box-shadow: var(--shadow);
  border-radius: var(--radius);
  overflow-y: auto;
  z-index: 11;
`;
