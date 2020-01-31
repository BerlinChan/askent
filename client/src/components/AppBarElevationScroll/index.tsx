import React, { Fragment, useState, useEffect, useRef } from "react";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import { AppBar, AppBarProps, Box } from "@material-ui/core";

interface Props {
  children: React.ReactElement;
}

export default function AppBarElevationScroll({
  children,
  ...rest
}: Props & AppBarProps) {
  const [height, setHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setHeight(Number(ref?.current?.clientHeight));
  }, [children]);
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0
  });

  return (
    <Fragment>
      <AppBar ref={ref} elevation={trigger ? 4 : 0} {...rest}>
        {children}
      </AppBar>
      {/* Padding for top AppBar */}
      <Box height={height} />
    </Fragment>
  );
}
