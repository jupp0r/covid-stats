import React from "react";

import {
  Box,
  Paper,
  PaperProps,
  withStyles,
  createStyles,
  WithStyles,
} from "@material-ui/core";

const withPadding = createStyles({
  paperPadding: {
    padding: "30px",
  },
});

const spacedPaper: React.FC<PaperProps & WithStyles<typeof withPadding>> = (
  props: PaperProps & WithStyles<typeof withPadding>,
) => (
  <Box m={3} p={3}>
    <Paper {...props} className={props.classes.paperPadding}>
      {props.children}
    </Paper>
  </Box>
);

export const SpacedPaper = withStyles(withPadding)(spacedPaper);
