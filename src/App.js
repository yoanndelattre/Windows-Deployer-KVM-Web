import React, {Component, Fragment} from 'react';
import './App.css';
import ApiScaleway from './pages/APIScaleway/APIScaleway'
import HostServerAdministration from './pages/HostServerAdministration/HostServerAdministration'
import Windows10VMAdministration from './pages/Windows10VMAdministration/Windows10VMAdministration'

class App extends Component {
  render() {
    return (
      <Fragment>
        <a className="docs-link" target="blank" href="https://github.com/yoanndelattre/Windows-Deployer-KVM-App#windows-deployer-kvm-app">Documentation</a>
        <div className="conteneur-flexbox">
          <div className="flexbox-1"><ApiScaleway/></div>
          <div className="flexbox-2"><HostServerAdministration/></div>
          <div className="flexbox-3"><Windows10VMAdministration/></div>
        </div>
      </Fragment>
    );
  }
}

export default App;
