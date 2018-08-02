import React, { Component } from 'react';
import io from 'socket.io-client';

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      messages: [],
    };
    this.socket = io();

    const addMessage = (data) => {
      this.setState({ messages: [...this.state.messages, data] });
    };

    this.socket.on('RECEIVE_MESSAGE', (data) => {
      addMessage(data);
    });


    this.sendMessage = (ev) => {
      ev.preventDefault();
      this.socket.emit('SEND_MESSAGE', {
        author: this.props.user.slice(0, props.user.indexOf('@')),
        message: this.state.message,
      });
      this.setState({ message: '' });
    };
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-4">
            <div className="card">
              <div className="card-body">
                <div className="card-title">Global Chat</div>
                <hr />
                <div className="messages">
                  {this.state.messages.map(message => (
                    <div>{message.author}: {message.message}</div>
                  ))}
                </div>

              </div>
              <div className="card-footer">
                <br />
                <input type="text" placeholder="Message" className="form-control" value={this.state.message} onChange={ev => this.setState({ message: ev.target.value })} />
                <br />
                <button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

