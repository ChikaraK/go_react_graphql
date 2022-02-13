import React, { Component } from 'react';

export default class AppContent extends Component {

    state = {posts: []};

    onEnterFunction = () => {
        console.log('Nottayo!');
    }
    onLeaveFunction = () => {
        console.log('Hanaretayo!');
    }
    clickedItem = (x) => {
        console.log('Clicked',x);
    }

    fetchList = () => {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then((response) => response.json())
            .then(json => {
                this.setState({posts: json});
            })
    }

    render(){
        return (
            <div className="content">
                This is the Unko content.
                <br />
                <hr />
                <p onMouseEnter={this.onEnterFunction} onMouseLeave={this.onLeaveFunction}>This is another unko text</p>
                <button onClick={this.fetchList} className="btn btn-primary">Unko Hassha</button>    

                <p>Posts is {this.state.posts.length} items long</p>

                <hr />
                <ul>
                    {this.state.posts.map((c) => (
                        <li key={c.id}>
                            <a href="#!" onClick={() => this.clickedItem(c.id)}>
                                {c.title}
                            </a>
                        </li>
                    ))}

                </ul>
            </div>
        );
    }
}