import React, { Fragment, useState, useEffect, useRef } from "react";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import { AppBar, AppBarProps, Box } from "@material-ui/core";

interface Props extends AppBarProps {}

const AppBarElevationScroll: React.FC<Props & AppBarProps> = ({
  children,
  ...rest
}) => {
  const [height, setHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  const handleResize = () => {
    setHeight(Number(ref?.current?.clientHeight));
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [children]);

  return (
    <Fragment>
      <AppBar ref={ref} elevation={trigger ? 4 : 0} {...rest}>
        {children}
      </AppBar>
      {/* Padding for top AppBar */}
      <Box height={height} />
    </Fragment>
  );
};

export default AppBarElevationScroll;
