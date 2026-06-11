import React from "react";
import { useScrollTrigger, Slide, SlideProps } from "@mui/material";

interface Props extends SlideProps {
  threshold?: number;
  reverseIn?: boolean;
}

const ScrollSlide: React.FC<Props> = ({
  threshold,
  reverseIn,
  children,
  ...rest
}) => {
  const trigger = useScrollTrigger({ threshold, disableHysteresis: true });

  return (
    <Slide
      appear={false}
      direction="down"
      in={reverseIn ? trigger : !trigger}
      {...rest}
    >
      {children}
    </Slide>
  );
};

export default ScrollSlide;
