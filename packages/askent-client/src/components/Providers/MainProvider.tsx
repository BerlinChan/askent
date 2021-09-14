import React from "react";
import { ApolloProvider } from "@apollo/client";
import createApolloClient from "../../graphql/createApolloClient";
import { createTheme , ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { SnackbarProvider } from "notistack";
import { IntlProvider } from "react-intl";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import enLocale from "date-fns/locale/en-US";
import zhLocale from "date-fns/locale/zh-CN";

const apolloClient = createApolloClient();
const theme = createTheme();

// TODO: refactor i18n and code split, ref: https://github.com/formatjs/react-intl/issues/720
const messages = {
  zh: {
    CREATE_EVENT: "创建活动"
  },
  en: {
    CREATE_EVENT: "Create Event"
  }
};
// TODO: DatePicker i18n, ref: https://material-ui-pickers.dev/localization/date-fns
const localeMap = {
  en: enLocale,
  zh: zhLocale
};

interface Props {
  children: React.ReactElement;
}

const MainProvider: React.FC<Props> = props => {
  // TODO: i18n runtime change, config presist with apollo cache, ref: https://github.com/kriasoft/react-starter-kit/tree/feature/react-intl
  const locale = "zh";

  return (
    <ApolloProvider client={apolloClient}>
      <IntlProvider
        locale={locale}
        messages={messages[locale]}
        onError={err => {
          // TODO: disable all i18n error before translation
        }}
      >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider>
            <MuiPickersUtilsProvider
              utils={DateFnsUtils}
              locale={localeMap[locale]}
            >
              {props.children}
            </MuiPickersUtilsProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </IntlProvider>
    </ApolloProvider>
  );
};

export default MainProvider;
