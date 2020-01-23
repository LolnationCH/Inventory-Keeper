import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { HomePage } from './pages/homePage';
import { AboutPage } from './pages/aboutPage';
import { CatalogPage } from './pages/catalogPage';
import { BookPage } from './pages/bookPage';

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/about">
            <AboutPage/>
          </Route>
          <Route exact path="/catalog">
            <CatalogPage/>
          </Route>
          <Route path="/">
            <HomePage/>
          </Route>
          <Route path="books/:id" component={BookPage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
