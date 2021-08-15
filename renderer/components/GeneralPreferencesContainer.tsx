import React from "react";
import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";
import {
  Toolbar,
  FormControlLabel,
  Button,
  Divider,
  Checkbox,
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => {
  const baseMargin = 6;
  return createStyles({
    content: {
      flexGrow: 1,
      padding: theme.spacing(baseMargin),
      position: "relative",
      height: "100vh",
    },
    form: {},
    formComponents: {
      position: "absolute",
      right: 0,
      left: 0,
      bottom: theme.spacing(baseMargin / 2),
    },
    formButtons: {
      float: "right",
      marginRight: theme.spacing(baseMargin),
    },
    divider: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    button: {
      textTransform: "none",
    },
  });
});

const GeneralPreferencesContainer: React.FC = () => {
  const [isOpenAtStartup, setIsOpenAtStartup] = React.useState(false);

  React.useEffect(() => {
    const generalPreferencePromise = window.store.getGeneralPreference();
    generalPreferencePromise.then(
      (generalPreference: GeneralPreferenceType) => {
        setIsOpenAtStartup(generalPreference.isOpenAtStartup);
      }
    );
  }, []);

  const handleChange = React.useCallback(() => {
    const params: GeneralPreferenceType = { isOpenAtStartup: isOpenAtStartup };
    window.store.setGeneralPreference(params);
  }, [isOpenAtStartup]);

  const classes = useStyles({});
  return (
    <main className={classes.content}>
      <Toolbar />

      <form noValidate autoComplete="off" className={classes.form}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isOpenAtStartup}
              onClick={(e: object) => {
                setIsOpenAtStartup(e["target"]["checked"]);
              }}
              color="primary"
            />
          }
          label="アプリケーション起動時にウィンドウを表示する"
        />
      </form>

      <div className={classes.formComponents}>
        <Divider className={classes.divider} />
        <div className={classes.formButtons}>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={() => {
              handleChange();
            }}
          >
            {"Apply"}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default GeneralPreferencesContainer;
