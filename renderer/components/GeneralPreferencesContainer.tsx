import React from "react";
import {
  FormControlLabel,
  Checkbox,
  capitalize,
  FormControl,
  FormLabel,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Tooltip,
} from "@mui/material";
import DogBreadsIcon, {
  DogIconStyles,
  DogIconStyleType,
} from "./DogBreadsIcon";
import { systemPropertiesContext } from "../contexts/SystemPropertiesContext";

const toDogIconStyle = (
  value: any,
  defaultStyle: DogIconStyleType = "lineal"
): DogIconStyleType =>
  DogIconStyles.find((style) => style == value) ?? defaultStyle;

const getIconStyleLabel = (style: DogIconStyleType): string =>
  capitalize(style).replace("-w", " (white)");

const GeneralPreferencesContainer: React.FC = () => {
  const [isReady, setIsReady] = React.useState(false);

  const [generalPreferences, setGeneralPreferences] =
    React.useState<GeneralPreferenceType>({
      isOpenAtStartup: true,
      isLaunchProxyServerAtStartup: false,
      trayIconStyle: "lineal",
      menuIconStyle: "lineal",
    });

  const { isMacos } = React.useContext(systemPropertiesContext);

  React.useEffect(() => {
    (async () => {
      setGeneralPreferences(await window.store.getGeneralPreference());
      setIsReady(true);
    })();
  }, []);

  // macの場合はアイコンの色が自動で切り替わるため、白色スタイルは不要
  const availableDogIconStyles = isMacos
    ? DogIconStyles.filter((v) => !v.endsWith("-w"))
    : DogIconStyles.slice();

  const onChangeHandler = React.useCallback(
    (preferences: Partial<GeneralPreferenceType>) => {
      setGeneralPreferences((prev) => {
        const newPreferences = { ...prev, ...preferences };
        window.store.setGeneralPreference(newPreferences);
        return newPreferences;
      });
    },
    []
  );

  return (
    <form noValidate autoComplete="off" hidden={!isReady}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={generalPreferences.isOpenAtStartup}
                onClick={(e: object) => {
                  onChangeHandler({ isOpenAtStartup: e["target"]["checked"] });
                }}
                color="primary"
              />
            }
            label="アプリケーション起動時にウィンドウを表示する"
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={generalPreferences.isLaunchProxyServerAtStartup}
                onClick={(e: object) => {
                  onChangeHandler({
                    isLaunchProxyServerAtStartup: e["target"]["checked"],
                  });
                }}
                color="primary"
              />
            }
            label="アプリケーション起動時にプロキシサーバを立ち上げる"
          />
        </Grid>

        <Grid item xs={12} sx={{ mb: (theme) => theme.spacing(2) }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">トレイアイコンのスタイル</FormLabel>
            <ToggleButtonGroup
              value={generalPreferences.trayIconStyle}
              exclusive
              color="primary"
              size="small"
              onChange={(event, value) => {
                onChangeHandler({ trayIconStyle: toDogIconStyle(value) });
              }}
            >
              {availableDogIconStyles.map((iconStyle) => (
                <ToggleButton
                  key={iconStyle}
                  value={iconStyle}
                  sx={{ p: (theme) => theme.spacing(0) }}
                >
                  <Tooltip title={getIconStyleLabel(iconStyle)}>
                    <Box
                      display="flex"
                      sx={{
                        width: "100%",
                        height: "100%",
                        px: (theme) => theme.spacing(2),
                        py: (theme) => theme.spacing(0.6),
                      }}
                    >
                      <Box
                        sx={{
                          borderRadius: "10%",
                          background: (theme) =>
                            iconStyle.endsWith("-w")
                              ? theme.palette.primary.main
                              : null,
                          px: (theme) => theme.spacing(2),
                          py: (theme) => theme.spacing(0.4),
                          m: "auto",
                        }}
                      >
                        <DogBreadsIcon iconId="001-dog" style={iconStyle} />
                      </Box>
                    </Box>
                  </Tooltip>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">メニューアイコンのスタイル</FormLabel>
            <ToggleButtonGroup
              value={generalPreferences.menuIconStyle}
              exclusive
              color="primary"
              size="small"
              onChange={(event, value) => {
                onChangeHandler({ menuIconStyle: toDogIconStyle(value) });
              }}
            >
              {availableDogIconStyles.map((iconStyle) => (
                <ToggleButton
                  key={iconStyle}
                  value={iconStyle}
                  sx={{ p: (theme) => theme.spacing(0) }}
                >
                  <Tooltip title={getIconStyleLabel(iconStyle)}>
                    <Box
                      display="flex"
                      sx={{
                        width: "100%",
                        height: "100%",
                        px: (theme) => theme.spacing(2),
                        py: (theme) => theme.spacing(0.6),
                      }}
                    >
                      <Box
                        sx={{
                          borderRadius: "10%",
                          background: (theme) =>
                            iconStyle.endsWith("-w")
                              ? theme.palette.primary.main
                              : null,
                          px: (theme) => theme.spacing(2),
                          py: (theme) => theme.spacing(0.4),
                          m: "auto",
                        }}
                      >
                        <DogBreadsIcon iconId="001-dog" style={iconStyle} />
                      </Box>
                    </Box>
                  </Tooltip>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </FormControl>
        </Grid>
      </Grid>
    </form>
  );
};

export default GeneralPreferencesContainer;
