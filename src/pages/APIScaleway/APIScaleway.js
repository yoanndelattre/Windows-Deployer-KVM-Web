import React, {Component, Fragment} from 'react';
import './APIScaleway.css'
 
export default class APIScaleway extends Component {
    state = {
        Access_key: '',   
        Secret_key: ''
    };

    componentDidMount() {
        const Access_key = localStorage.getItem('Access_key');
        const Secret_key = localStorage.getItem('Secret_key');
        this.setState({ Access_key, Secret_key });
    }
   
    handleChangeAccess_key = (event) => {
      const input = event.target.value;
   
      this.setState({ Access_key: input });
    };

    handleChangeSecret_key = (event) => {
        const input = event.target.value;
     
        this.setState({ Secret_key: input });
      };
   
    handleFormSubmit = (event) => {
        event.preventDefault();
        const { Access_key, Secret_key } = this.state;
        localStorage.setItem('Access_key', Access_key);
        localStorage.setItem('Secret_key', Secret_key);
    };

    removeKey = () => {
        this.setState({ Access_key: ''})
        this.setState({ Secret_key: ''})
        localStorage.removeItem('Access_key');
        localStorage.removeItem('Secret_key');
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
                    <button className="submit_key" type="submit">Sign In</button>
                </form>
                <button className="remove_key" onClick={this.removeKey}>Remove API keys</button>
            </Fragment>
        );
    }
}