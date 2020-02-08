import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { BrowserView, MobileView} from "react-device-detect";
import { ToastContainer } from 'react-toastify';

import { LeftActionBar } from './components/leftActionBar';

import { HomePage } from './pages/homePage';
import { AboutPage } from './pages/aboutPage';
import { CatalogPage } from './pages/catalogPage';
import { BookPage, BookPageModes } from './pages/bookPage';
import { GetUnavailablePage } from './pages/unavailablePage';
import { LocalPage } from './pages/localPage';
import { SettingsPage } from './pages/settingsPage';
import { BookSelectionPage } from './pages/bookSelectionPage';


const App: React.FC = () => {
  const EmptyBookPage = (props: any) => {
    return (
      <BookPage Mode={BookPageModes.EMPTY} {...props}/>
    )
  }

  const EditBookPage = (props: any) => {
    return (
      <BookPage Mode={BookPageModes.EDITING} {...props}/>
    )
  }

  return (
    <div className="App">
      <ToastContainer />
      <BrowserView>
        <Router>
          <Grid style={{marginTop:"10px"}} container spacing={1}>
            <Grid style={{marginLeft:"10px"}} item xs="auto" className="Left-bar">
              <LeftActionBar/>
            </Grid>
            <Grid item xs>
              <div className="Main-Div">
                <Switch>
                  <Route exact path="/">
                    <HomePage/>
                  </Route>
                  <Route exact path="/local">
                    <LocalPage/>
                  </Route>
                  <Route exact path="/about">
                    <AboutPage/>
                  </Route>
                  <Route exact path="/catalog">
                    <CatalogPage/>
                  </Route>
                  <Route exact path="/bookSelection/">
                    <BookSelectionPage/>
                  </Route>
                  <Route exact path="/settings">
                    <SettingsPage/>
                  </Route>
                  <Route path="/books/:id" component={EditBookPage} />
                  <Route path="/books/" component={withRouter(EmptyBookPage)} />
                </Switch>
              </div>
            </Grid>
          </Grid>
        </Router>
      </BrowserView>
      <MobileView>
        <GetUnavailablePage/>
      </MobileView>
    </div>
  );
}

export default App;
