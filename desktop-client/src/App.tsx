import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { BrowserView, MobileView} from "react-device-detect";

import { LeftActionBar } from './components/leftActionBar';

import { HomePage } from './pages/homePage';
import { AboutPage } from './pages/aboutPage';
import { CatalogPage } from './pages/catalogPage';
import { BookPage, BookPageModes } from './pages/bookPage';
import { GetUnavailablePage } from './pages/unavailablePage';

import { ToastContainer } from 'react-toastify';


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
          <Grid container spacing={3}>
            <Grid item xs>
              <p/>
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs="auto" className="Left-bar">
              <LeftActionBar/>
            </Grid>
            <Grid item xs>
              <div className="Main-Div">
                <Switch>
                  <Route exact path="/about">
                    <AboutPage/>
                  </Route>
                  <Route exact path="/catalog">
                    <CatalogPage/>
                  </Route>
                  <Route exact path="/">
                    <HomePage/>
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
