import React from "react";
import { useScrollTrigger, Fade, FadeProps } from "@material-ui/core";

interface Props extends FadeProps {
  threshold?: number;
  reverseIn?: boolean;
}

const ScrollFade: React.FC<Props> = ({
  threshold,
  reverseIn,
  children,
  ...rest
}) => {
  const trigger = useScrollTrigger({ threshold, disableHysteresis: true });

  return (
    <Fade appear={false} in={reverseIn ? trigger : !trigger} {...rest}>
      {children}
    </Fade>
  );
};

export default ScrollFade;
