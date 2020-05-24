import {
  Box,
  createStyles,
  Paper,
  PaperProps,
  useMediaQuery,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import React from "react";

const withPadding = createStyles({
  paperPadding: {
    padding: "30px",
  },
});

const spacedPaper: React.FC<PaperProps & WithStyles<typeof withPadding>> = (
  props: PaperProps & WithStyles<typeof withPadding>,
) => {
  // eslint:disable
  const wide = useMediaQuery("(min-width:600px)"); // eslint-disable-line react-hooks/rules-of-hooks
  return (
    <Box my={3} py={3}>
      <Paper
        elevation={props.elevation}
        className={wide ? props.classes.paperPadding : ""}
      >
        {props.children}
      </Paper>
    </Box>
  );
};

export const SpacedPaper = withStyles(withPadding)(spacedPaper);
