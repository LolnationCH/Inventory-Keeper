import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createMuiTheme, MuiThemeProvider  } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'dark', // Force dark, we must eliminate the light!
  },
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>, 
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// From me : Reason for not register =>
//         - Needs a internet connection and a connection to the server
//         - Mobile side is taking care off by the app.
// So I don't really see the point for it.
serviceWorker.unregister();
