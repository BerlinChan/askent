import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import createApolloClient from "../../graphql/createApolloClient";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { SnackbarProvider } from "notistack";
import { IntlProvider } from "react-intl";

const apolloClient = createApolloClient();
const theme = createMuiTheme();

// TODO: refactor i18n and code split, ref: https://github.com/formatjs/react-intl/issues/720
const messages = {
  zh: {
    CREAT_EVENT: "创建活动"
  },
  en: {
    CREAT_EVENT: "Create Event"
  }
};

interface Props {
  children: React.ReactElement;
}

const Providers: React.FC<Props> = props => {
  // TODO: i18n runtime change, config presist with apollo cache, ref: https://github.com/kriasoft/react-starter-kit/tree/feature/react-intl
  const locale = "zh";

  return (
    <ApolloProvider client={apolloClient}>
      <IntlProvider locale={locale} messages={messages[locale]}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider>{props.children}</SnackbarProvider>
        </ThemeProvider>
      </IntlProvider>
    </ApolloProvider>
  );
};

export default Providers;
