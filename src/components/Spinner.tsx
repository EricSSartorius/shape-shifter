import styled from "styled-components";

export function Spinner() {
  return (
    <SpinnerWrapper>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </SpinnerWrapper>
  );
}

const SpinnerWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .dot {
    width: 10px;
    height: 10px;
    border: 2px solid var(--violet);
    border-radius: 50%;
    float: left;
    margin: 0 5px;
    transform: scale(0);
    animation: fx 1000ms ease infinite 0ms;
  }
  .dot:nth-child(2) {
    animation: fx 1000ms ease infinite 300ms;
  }
  .dot:nth-child(3) {
    animation: fx 1000ms ease infinite 600ms;
  }
  @keyframes fx {
    50% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;
