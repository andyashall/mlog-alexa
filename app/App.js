import React from 'react';
import styles from './App.css';
import axios from 'axios'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {test: 'foo'};
  }
  init() {
    var title = document.getElementById(style.title).value,
        body = document.getElementById(style.body).innerHTML;
    console.log(body + ", " + title)
    var data = {
      title: title,
      body: body
    }
    axios.post('/api/hello', data)
    .then( (res) => {
      console.log(res.data)
    } )
    .catch( (err) => {
      console.log(err)
    } )
  }
  render() {
    return (
      <div className={styles.app}>
        <button onClick={this.init}>Initiate alexa</button>
        <button>Say name to alexa</button>
        <button>Say "create meeting called test meeting"</button>
      </div>
    );
  }
}
