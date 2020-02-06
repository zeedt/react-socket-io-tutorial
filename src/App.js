import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Redirect, withRouter } from 'react-router-dom';

class App extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      username : ''
    };

    this.handler = this.handler.bind(this);
    this.login = this.login.bind(this);
  }

  handler = (event) => {
    this.setState({
      [event.target.name] : event.target.value
    });
  };

  login = ()=> {
    console.log("HI + " + this.state.username);
    this.props.history.push('/chat', {username : this.state.username})
  }
  
  render(){
    return (
    <div className="App">
      <h1>CHAT ROOM</h1>
      {/* <form> */}
        <input type="text" name='username' onChange={this.handler} />
        <button onClick={this.login}>Enter chat room</button>
      {/* </form> */}
    </div>
  );
}

}

export default withRouter(App);
