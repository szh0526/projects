import React from 'react';
import ReactDOM from 'react-dom';

const user = {
    firstName:"Sun",
    lastName:"ZeHao",
    photoUrl:"..."
}

const element1 = (
    <div className="testA" tabIndex="1" data-id="1">
        <h1>Hello!</h1>
        <img src={user.photoUrl} alt=""/>
    </div>
);

let formatName = user => user.firstName + user.lastName;

let getGreeting = (user) => {
    if(user){
        return <h1> Hello,{formatName(user)}!</h1>;
    }
    return <h1> Hello,World!</h1>;
}

ReactDOM.render(
    getGreeting(user),
    document.getElementById('root')   
)
//=================================================
/*
let welcome = (props) => {
    return <h1>hello,{this.props.name}</h1>;
}

let App = () => {
    return (
        <div>
            <Welcome name="A"></Welcome>
            <Welcome name="B"></Welcome>
            <Welcome name="C"></Welcome>
        </div>
    )
}


class Welcome extends React.Component{
    render(){
        return <h1>Hello,{this.props.name}</h1>;
    }
}


const element = <Welcome name="Sara" />;

ReactDOM.render(
    <App />,
    document.getElementById('root')   
)
*/

//=================================================

let Avatar = props => {
    return (
        <img 
            className = "Avatar"
            src={props.user.avatarUrl} 
            alt={props.user.name}
        />   
    )
}

let UserInfo = props => {
  return (
    <div className="UserInfo">
      <Avatar user={props.user} />
      <div className="UserInfo-name">
        {props.user.name}
      </div>
    </div>
  );
}


let Comment = props => {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}

class Clock extends React.Component{
    constructor(props){
        super(props);
        this.state = {date: new Date()};
    }

    componentDidMount() {
        this.timerID = setInterval(
        () => this.tick(),
        1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            date: new Date()
        });
    }

    render(){
        return (
            <div>
                <h1>Hello, world!</h1>
                <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
            </div>
        )
    }
}


ReactDOM.render(
    <Clock />,
    document.getElementById('root')
)



//=================================================

/*
this.setState((prevState, props) => ({
  counter: prevState.counter + props.increment
}));
*/

class Test extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            posts: [],
            comments: []
        };
    }

    componentDidMount() {
        fetchPosts().then(response => {
            this.setState({
                posts: response.posts
            });
        });

        fetchComments().then(response => {
            this.setState({
                comments: response.comments
            });
        });
    }

    componentWillUnmount() {
    }

    render(){
        return (
            <div>
            </div>
        )
    }
}


ReactDOM.render(
    <Test />,
    document.getElementById('root')
)


//=================================================


let App = () => {
    return (
        <div>
            <Clock />
            <Clock />
            <Clock />
        </div>
    )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);


//=================================================

class Toggle extends React.Component{
    constructor(props){
        super(props);
        this.state ={isToggleOn: true};
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();
        this.setState(prevState => ({
            isToggleOn: !prevState.isToggleOn
        }));
    }

    handleHrefClick = () => {
        console.log('this is:', this);
    } 

    render(){
        return (
            <div>
                <button onClick={this.handleClick}>
                    {this.state.isToggleOn ? 'ON' : 'OFF'}
                </button>
                <a href="#" onClick={this.handleHrefClick}>
                Click me
                </a>
            </div>           
        )
    }
}


ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);


//=================================================

let UserGreeting = props => {
  return <h1>Welcome back!</h1>;
}

let GuestGreeting = props => {
  return <h1>Please sign up.</h1>;
}

let Greeting = props => {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}


let LoginButton = props => {
    return (
    <button onClick={props.onClick}>
      Login
    </button>
  );
}

let LogoutButton = props => {
    return (
    <button onClick={props.onClick}>
      Logout
    </button>
  );
}

class LoginControl extends ReactDOM.Component {
    constructor(props){
        super(props);
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);\
        this.state = {isLoggedIn:false};
    }

    handleLoginClick() {
        this.setState({isLoggedIn: true});
    }

    handleLogoutClick() {
        this.setState({isLoggedIn: false});
    }

     render(){
         const isLoggedIn = this.state.isLoggedIn;
         return (
            <Greeting isLoggedIn={isLoggedIn} />,
            <div>
            {isLoggedIn ? (
                <LogoutButton onClick={this.handleLogoutClick} />
            ) : (
                <LoginButton onClick={this.handleLoginClick} />
            )}
            </div>
         )
     }
}

ReactDOM.render(
    <LoginControl />,
    document.getElementById('root')
);


const messages = ['React', 'Re: React', 'Re:Re: React'];

let Mailbox = props => {
    const unreadMessages = props.unreadMessages;
    return (
        <div>
            <h1>Hello!</h1>
            {unreadMessages.length > 0 && 
                <h2>
                    You have {unreadMessages.length} unread messages.
                </h2>
            }
            The user is <b>{isLoggedIn ? 'currently' : 'not'}</b> logged in.
        </div>        
    )
}

ReactDOM.render(
    <Mailbox unreadMessages={messages} />,
    document.getElementById('root')
)

let WarningBanner = props => {
  if (!props.warn) {
    return null;
  }

  return (
    <div className="warning">
      Warning!
    </div>
  );
}

class Page extends ReactDOM.Component {
    constructor(props){
        super(props);
        this.state = {showWarning: true};
        this.handleToggleClick = this.handleToggleClick.bind(this);
    }

    handleToggleClick() {
        this.setState(prevState => ({
            showWarning: !prevState.showWarning
        }));
    }

    render(){
        return (
            <div>
                <WarningBanner warn= {this.state.showWarning} />
                <button onClick={this.handleToggleClick}>
                    {this.state.showWarning ? 'Hide' : 'Show'}
                </button>
            </div>
        )        
    }
}


ReactDOM.render(
    <Page />,
    document.getElementById('root')
)



//=================================================

let NumberList = props => {
    const numbers = props.numbers;
    return (
        <ul>
            {numbers.length > 0 && numbers.map((num,index) => {
                    <li key={index}>
                        {num}
                    </li>
                })}
        </ul>
    )
}


const numbers = [1,2,3,4,5];
ReactDOM.render(
    <NumberList numbers={numbers} />,
    document.getElementById('root')
)



let Blog = props => {
    const sidebar = (
        <ul>
            {props.posts.length > 0 && props.posts.map(post => {
                <div key={post.id}>
                    {post.title}
                </div>
            })}
        </ul>
    );

    const content = props.posts.map((post) =>{
        /*
            key不会传入组件
            <Post key={post.id} id={post.id} title={post.title} /> 
         */        
        <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
        </div>        
    });

    return (
        <div>
            {sidebar}
            <hr/>
            {content}
        </div>
    );
}

const posts = [
  {id: 1, title: 'Hello World', content: 'Welcome to learning React!'},
  {id: 2, title: 'Installation', content: 'You can install React from npm.'}
];

ReactDOM.render(
    <Blog posts={posts} />,
    document.getElementById('root')
)