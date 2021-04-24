import React, {Component, Fragment} from 'react';
import './App.css';
import ApiScaleway from './pages/APIScaleway/APIScaleway'
import HostServerAdministration from './pages/HostServerAdministration/HostServerAdministration'
import Windows10VMAdministration from './pages/Windows10VMAdministration/Windows10VMAdministration'

class App extends Component {
  render() {
    return (
      <Fragment>
        <div class="conteneur-flexbox">
          <div class="flexbox-1"><ApiScaleway/></div>
          <div class="flexbox-2"><HostServerAdministration/></div>
          <div class="flexbox-3"><Windows10VMAdministration/></div>
        </div>
      </Fragment>
    );
  }
}

export default App;
