import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link, useRouteMatch} from 'react-router-dom';
import Home from './components/Home';
import Movies from './components/Movies';
import Genres from './components/Genres';
import Admin from './components/Admin';
import OneMovie from './components/OneMovie';
import OneGenre from './components/OneGenre';

export default function App() {
  return (
  <Router>
  <div className="container">
    <div className="row">
      <h1 className="mt-3">
        Go Watch a Movie!
      </h1>
      <hr className="mb-3"></hr>
    </div>

    <div className="row">
      <div className="col-md-2">
        <nav>
          <ul className="list-group">
            <li className="list-group-item">
              <Link to="/">Home</Link>
            </li>
            <li className="list-group-item">
              <Link to="/movies">Movies</Link>
            </li>
            <li className="list-group-item">
              <Link to="/genres">Genres</Link>
            </li>
            <li className="list-group-item">
              <Link to="/admin">Manage Catalogue</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="col-md-10">
        <Switch>

            <Route path="/movie/:id" component={OneMovie}/>

            <Route path="/movies">
              <Movies />
            </Route>

            <Route path="/genre/:id" component={OneGenre}/>
            <Route exact path="/genres">
              <Genres />
            </Route>


            <Route path="/admin">
              <Admin />
            </Route>
            <Route path="/">
              <Home />
            </Route>
        </Switch>
      </div>
    </div>
  </div>
  </Router>
  );
}
