import React from "react";
import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";
import { Icon } from "@material-ui/core";

export const DogIconStyles = [
  "lineal",
  "fill",
  "linealColor",
  "flatColor",
] as const;
export type DogIconStyleType = typeof DogIconStyles[number];

export const DogIconIds = [...Array(50)].map(
  (_, index) => ("000" + (index + 1)).slice(-3) + "-dog"
);

const getIconPath = (
  iconId: string,
  style: DogIconStyleType,
  inverse: boolean = false
): string => {
  const styleDir =
    style + (["lineal", "fill"].includes(style) && inverse ? "_inverse" : "");
  return `/images/tray-icons/${styleDir}/${iconId}@3x.png`;
};

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    imageIcon: {
      display: "flex",
      height: "inherit",
      width: "inherit",
    },
    iconRoot: {
      textAlign: "center",
    },
  });
});

type Props = {
  iconId: string;
  style: DogIconStyleType;
};

const DogBreadsIcon: React.FC<Props> = ({ iconId, style }) => {
  const classes = useStyles({});
  const path = getIconPath(iconId, style);

  return (
    <Icon className={classes.iconRoot}>
      <img
        className={classes.imageIcon}
        src={path}
        alt={iconId}
        draggable={false}
      />
    </Icon>
  );
};

export default DogBreadsIcon;
