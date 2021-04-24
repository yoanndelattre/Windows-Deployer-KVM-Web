import React, {Component, Fragment} from 'react';
import './APIScaleway.css'
 
export default class APIScaleway extends Component {
    state = {
        Access_key: '',   
        Secret_key: '',
        Project_ID: ''
    };

    componentDidMount() {
        const Access_key = localStorage.getItem('Access_key');
        const Secret_key = localStorage.getItem('Secret_key');
        const Project_ID = localStorage.getItem('Project_ID');
        this.setState({ Access_key, Secret_key, Project_ID });
    }
   
    handleChangeAccess_key = (event) => {
      const input = event.target.value;
   
      this.setState({ Access_key: input });
    };

    handleChangeSecret_key = (event) => {
        const input = event.target.value;
     
        this.setState({ Secret_key: input });
    };

    handleChangeProject_ID = (event) => {
        const input = event.target.value;
     
        this.setState({ Project_ID: input });
    };
   
    handleFormSubmit = (event) => {
        event.preventDefault();
        const { Access_key, Secret_key, Project_ID } = this.state;
        localStorage.setItem('Access_key', Access_key);
        localStorage.setItem('Secret_key', Secret_key);
        localStorage.setItem('Project_ID', Project_ID);
    };

    removeKey = () => {
        this.setState({ Access_key: ''})
        this.setState({ Secret_key: ''})
        this.setState({ Project_ID: ''})
        localStorage.removeItem('Access_key');
        localStorage.removeItem('Secret_key');
        localStorage.removeItem('Project_ID');
    }
   
    render() {
        return (
            <Fragment>
                <form onSubmit={this.handleFormSubmit}>
                    <label className="Access_key">
                        Access_key: <input name="Access_key" value={this.state.Access_key} onChange={this.handleChangeAccess_key}/>
                    </label>
                    <label className="Secret_key">
                        Secret_key: <input name="Secret_key" type="password" value={this.state.Secret_key} onChange={this.handleChangeSecret_key}/>
                    </label>
                    <label className="Project_ID">
                        Project ID: <input name="Project_ID" value={this.state.Project_ID} onChange={this.handleChangeProject_ID}/>
                    </label>
                    <button className="submit_key" type="submit">Sign In</button>
                </form>
                <button className="remove_key" onClick={this.removeKey}>Remove API keys</button>
            </Fragment>
        );
    }
}