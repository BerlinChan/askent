import React, { useState } from "react";
import { Paper, Tabs, Tab, Box } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    }
  })
);

const Admin: React.FC = () => {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);
  const history = useHistory();

  return (
    <React.Fragment>
      <Paper className={classes.root}>
        <Tabs
          value={tabIndex}
          onChange={(event: React.ChangeEvent<{}>, newValue: number) => {
            setTabIndex(newValue);
          }}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Item One" />
          <Tab label="Item Two" />
          <Tab label="Item Three" />
        </Tabs>
      </Paper>
      <p>
        asdfasdfasd
        fasdf
        asd
        fasdfasdfasdf
      </p>
      <p>
        asdfasdfasd
        fasdf
        asd
        fasdfasdfasdf
      </p>
      <p>
        asdfasdfasd
        fasdf
        asd
        fasdfasdfasdf
      </p>
      <p>
        asdfasdfasd
        fasdf
        asd
        fasdfasdfasdf
      </p>
      <p>
        asdfasdfasd
        fasdf
        asd
        fasdfasdfasdf
      </p>
      <p>
        asdfasdfasd
        fasdf
        asd
        fasdfasdfasdf
      </p>
      <p>
        asdfasdfasd
        fasdf
        asd
        fasdfasdfasdf
      </p>
      <p>
        asdfasdfasd
        fasdf
        asd
        fasdfasdfasdf
      </p>
      <p>
        asdfasdfasd
        fasdf
        asd
        fasdfasdfasdf
      </p>
      <p>
        asdfasdfasd
        fasdf
        asd
        fasdfasdfasdf
      </p>
      <p>
        asdfasdfasd
        fasdf
        asd
        fasdfasdfasdf
      </p>
      <p>
        asdfasdfasd
        fasdf
        asd
        fasdfasdfasdf
      </p>
      <p>
        asdfasdfasd
        fasdf
        asd
        fasdfasdfasdf
      </p>
      <p>
        asdfasdfasd
        fasdf
        asd
        fasdfasdfasdf
      </p>
      <p>
        asdfasdfasd
        fasdf
        asd
        fasdfasdfasdf
      </p>
      <p>
        asdfasdfasd
        fasdf
        asd
        fasdfasdfasdf
      </p>
      <p>
        asdfasdfasd
        fasdf
        asd
        fasdfasdfasdf
      </p>
      <p>
        asdfasdfasd
        fasdf
        asd
        fasdfasdfasdf
      </p>
      <p>
        asdfasdfasd
        fasdf
        asd
        fasdfasdfasdf
      </p>
      <p>
        asdfasdfasd
        fasdf
        asd
        fasdfasdfasdf
      </p>
      <p>
        asdfasdfasd
        fasdf
        asd
        fasdfasdfasdf
      </p>
      <p>
        asdfasdfasd
        fasdf
        asd
        fasdfasdfasdf
      </p>
      <p>
        asdfasdfasd
        fasdf
        asd
        fasdfasdfasdf
      </p>
      <p>
        asdfasdfasd
        fasdf
        asd
        fasdfasdfasdf
      </p>
    </React.Fragment>
  );
};

export default Admin;
