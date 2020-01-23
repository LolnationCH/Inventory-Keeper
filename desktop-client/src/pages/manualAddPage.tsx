import * as React from "react";
import { TextField, FormControl, Grid } from "@material-ui/core";

export class ManualAddPage extends React.Component<any> {
  constructor(props: any) {
    super(props);
    this.state = {id: null};
  }

  render() {
     return( 
      <Grid container spacing={3}>
        <Grid item xs>
          <TextField id="standard-basic" label="Standard" />
        </Grid>
        <Grid item xs>
          <TextField id="filled-basic" label="Filled" variant="filled" />
        </Grid>
        <Grid item xs>
          <TextField id="outlined-basic" label="Outlined" variant="outlined" />
        </Grid>
      </Grid>
     )
  }
}