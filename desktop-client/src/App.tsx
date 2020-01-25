import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { HomePage } from './pages/homePage';
import { AboutPage } from './pages/aboutPage';
import { CatalogPage } from './pages/catalogPage';
import { BookPage } from './pages/bookPage';
import { Grid } from '@material-ui/core';

import { LeftActionBar } from './components/leftActionBar';

const App: React.FC = () => {
  return (
    <div className="App">
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
                <Route exact path="/manualAdd">
                  <BookPage />
                </Route>
                <Route exact path="/">
                  <HomePage/>
                </Route>
                <Route path="/books/:id" component={BookPage} />
                <Route path="/books/" component={BookPage} />
              </Switch>
            </div>
          </Grid>
        </Grid>
      </Router>
    </div>
  );
}

export default App;
