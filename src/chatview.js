import React from 'react';
import { withRouter } from 'react-router';
import SocketIOClient from 'socket.io-client'
class ChatView extends React.Component {

    constructor(props) {
        super(props);
        console.dir(props);
        this.state = {
            socketEndpoint: 'localhost:8080',
            users: [],
            message: '',
            messages: [],
            likes : []
        }
        this.socket = SocketIOClient(this.state.socketEndpoint);
        this.sendLike = this.sendLike.bind(this);
    }

    componentDidMount() {
        this.changeEventHandler = this.changeEventHandler.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.socket.on('message-from-server', data => {
            console.dir(data);
        });

        this.socket.emit('join', {
            username: this.props.location.state.username
        });

        this.socket.on('all-users', (data) => {
            this.setState({
                users: data.filter((item) => { return item.username !== this.props.location.state.username })
            });
        });


        this.socket.on('message-received', data => {
            this.setState({
                messages: this.state.messages.concat(data)
            });
        });

        this.socket.on('liked', data => {
            this.setState({
                likes : this.state.likes.concat(data)
            });
            console.dir("Likes is " + JSON.stringify(this.state.likes));
        });
    }

    changeEventHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    sendMessage = () => {
        const message = {
            message: this.state.message,
            from: this.props.location.state.username
        };
        this.socket.emit('send-message', message);
        this.setState({
            messages: this.state.messages.concat(message)
        });
    }

    sendLike = (user) => {
        console.log("sending like " + JSON.stringify(user));

        const likeObject = {
            username : this.props.location.state.username,
            like : user.socketId
        }
        this.socket.emit('send-like', likeObject);
    }
    

    render() {
        return (
            <div>
                Welcome {this.props.location.state.username}
                <p />
                <div style={{ 'display': 'block', 'marginBottom': '50px' }}>
                    Messages<p></p>
        {this.state.messages.map((messageObj, index)=><div><p key={index}>{messageObj.message}</p></div>)}
                </div>
                <table>
                    <tbody>
                        <tr>
                            <td style={{ 'width': '200px' }}>
                                Other Users<p></p>
                                {this.state.users.map((user) => <div key={user.username}>{user.username}<span>
                                    <button onClick={()=>{this.sendLike(user)}}>Like</button>
                                    </span></div>)}
                            </td>
                            <td style={{ 'width': '400px' }}>
                                <input type="text" name="message" onChange={this.changeEventHandler} />
                                <button onClick={this.sendMessage}>Send</button>
                            </td>
                            <td style={{ 'width': '200px' }}>
        {this.state.likes.map(like=><div>{like.username}</div>)}
                        </td>
                        </tr>
                    </tbody>
                </table>



            </div>
        )
    }
}


export default withRouter(ChatView);