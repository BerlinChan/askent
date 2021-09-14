import React, { PropsWithChildren } from "react";
import {
  ThemeProvider,
  createTheme,
  useTheme,
  Theme,
} from "@material-ui/core/styles";

interface Props {}

const WallThemeProvider: React.FC<PropsWithChildren<Props>> = ({
  children,
}) => {
  const defaultTheme = useTheme();
  const [theme, setTheme] = React.useState<Theme>(defaultTheme);

  const onResize = () => {
    setTheme(
      createTheme({
        palette: {
          type: "dark",
        },
        typography: {
          htmlFontSize:
            (1280 / window.document.documentElement.clientWidth) * 16,
        },
      })
    );
  };
  React.useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  });
  React.useEffect(() => {
    onResize();
  }, []);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default WallThemeProvider;
