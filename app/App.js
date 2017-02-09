import React from 'react'
import style from './App.css'
import axios from 'axios'

var name 
var userId
var meetingId

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {name: ''}
  }
  init() {
    var title = "title",
        body = "dody"
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
  login() {
    name = document.getElementById("un").value
    var data = {
      username: name
    }
    axios.post('/api/login', data)
    .then( (res) => {
      console.log(res.data.message)
      userId = res.data.userId
      console.log(userId)
    } )
    .catch( (err) => {
      console.log(err)
    } )
  }
  createMeeting() {
    var meetingName = document.getElementById("mn").value
    var data = {
      userId: userId,
      meetingName: meetingName
    }
    if (!userId) {
      return
    }
    if (meetingName == "") {
      return
    }
    axios.post('/api/createmeeting', data)
    .then( (res) => {
      console.log(res.data.message)
      console.log(res.data.meetingId)
      meetingId = res.data.meetingId
    } )
    .catch( (err) => {
      console.log(err)
    } )
  }
  createAction() {
    var action = document.getElementById("an").value
    var data = {
      userId: userId,
      meetingId: meetingId,
      action: action
    }
    if (!userId) {
      return
    }
    if (!meetingId) {
      return
    }
    if (action == "") {
      return
    }
    axios.post('/api/createaction', data)
    .then( (res) => {
      console.log(res.data.message)
    } )
    .catch( (err) => {
      console.log(err)
    } )
  }
  createDecision() {
    var decision = document.getElementById("dn").value
    var data = {
      userId: userId,
      meetingId: meetingId,
      decision: decision
    }
    if (!userId) {
      return
    }
    if (!meetingId) {
      return
    }
    if (decision == "") {
      return
    }
    axios.post('/api/createdecision', data)
    .then( (res) => {
      console.log(res.data.message)
    } )
    .catch( (err) => {
      console.log(err)
    } )
  }
  createRisk() {
    var risk = document.getElementById("rn").value
    var data = {
      userId: userId,
      meetingId: meetingId,
      risk: risk
    }
    if (!userId) {
      return
    }
    if (!meetingId) {
      return
    }
    if (risk == "") {
      return
    }
    axios.post('/api/createrisk', data)
    .then( (res) => {
      console.log(res.data.message)
    } )
    .catch( (err) => {
      console.log(err)
    } )
  }
  createInfo() {
    var info = document.getElementById("in").value
    var data = {
      userId: userId,
      meetingId: meetingId,
      info: info
    }
    if (!userId) {
      return
    }
    if (!meetingId) {
      return
    }
    if (info == "") {
      return
    }
    axios.post('/api/createinfo', data)
    .then( (res) => {
      console.log(res.data.message)
    } )
    .catch( (err) => {
      console.log(err)
    } )
  }
  render() {
    return (
      <div className={style.app}>
        <h1>mlog-alexa</h1>
        <div className={style.butts}>
          <button onClick={this.init}>Initiate alexa</button>
          <input id="un" placeholder="Username..." />
          <button onClick={this.login}>Say name to alexa</button>
          <input id="mn" placeholder="Meeting Name..." />
          <button onClick={this.createMeeting}>Create Meeting</button>
          <input id="an" placeholder="Action Name..." />
          <button onClick={this.createAction}>Create Action</button>
          <input id="dn" placeholder="Decision Name..." />
          <button onClick={this.createDecision}>Create Decision</button>
          <input id="rn" placeholder="Risk Name..." />
          <button onClick={this.createRisk}>Create Risk</button>
          <input id="in" placeholder="Info Name..." />
          <button onClick={this.createInfo}>Create Info</button>
        </div>
      </div>
    )
  }
}
