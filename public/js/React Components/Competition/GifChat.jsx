import React, { Component } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
const config = require('./../../../../config.js');
// /home/josh/BattleCode/public/js/React Components/Competition/chat.jsx
// /home/josh/BattleCode/config.js
export default class GifChat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      messages: [],
      GIF: '',
      gifmessage: '',
      query: '',
      giphyCalled: true,
    };
    this.socket = io();

    const addMessage = (data) => {
      this.setState({ messages: [...this.state.messages, data] });
    };

    this.socket.on('GIF_RECEIVE_MESSAGE', (data) => {
      addMessage(data);
    });

    this.handleKeyInput = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.sendMessage(e);
      }
      
    };

    this.sendMessage = (ev) => {
      ev.preventDefault();
      if(this.state.message){
        this.getGif(this.state.message);
      }else{
      this.socket.emit('GIF_SEND_MESSAGE', {
        author: this.props.user.slice(0, props.user.indexOf('@')),
        message: this.state.message,
      });
    }
      
      this.setState({ message: '' });
    };
    this.getGif = (query) => {
      query = query.split(' ').join('+');
      const api_key= config.GIPHY;
      axios.get(`http://api.giphy.com/v1/gifs/search?q=${query}&api_key=${api_key}`)
        .then((response) => {
          let results = response.data.data[0];
          console.log(results);
            this.setState({
              message: results.images.downsized.url,
              giphyCalled: true,
            });
            this.socket.emit('GIF_SEND_MESSAGE', {
              author: this.props.user.slice(0, props.user.indexOf('@')),
              message: this.state.message,
            });
            this.setState({ 
              message: '',
             });
          //  else {
          //   this.setState({
          //     gifmessage: 'No GIFs found'
          //   })
          // }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    
  }
  render() {
    return (
      
          
            <div className="card">
              <div className="card-body">
                <div className="card-title"><b>Gif Chat</b></div>
                <hr />
                
                <div className="messages">
                {/* <div>{this.state.GIF}</div> */}
                
                  {this.state.messages.map(message => (
                    
                    <div>{message.author}: {this.state.giphyCalled? <img src={message.message}></img>: <div>{message.message}</div>} </div>
                    
                  ))}
                  {/* {this.state.giphyCalled? <img src={message.message}></img>: <div></div>}{message.message} */}
                </div>
              </div>
              <div className="card-footer">
              
                <br />
                <input
                  onKeyPress={this.handleKeyInput}
                  type="text"
                  placeholder="Message"
                  className="form-control"
                  value={this.state.message}
                  onChange={ev => this.setState({ message: ev.target.value })}
                />
                <br />
                <button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
              </div>
            </div>
          
       
    );
  }
}
