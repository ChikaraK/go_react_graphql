import React, { Component } from 'react';

export default class AppContent extends Component {

    constructor(props){
        super(props);
        this.handlePostChange = this.handlePostChange.bind(this);
    }

    handlePostChange(posts){
        this.props.handlePostChange(posts);
    }

    clickedItem = (x) => {
        console.log('Clicked',x);
    }

    fetchList = () => {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then((response) => response.json())
            .then(json => {
                  this.handlePostChange(json);
            })
    }

    render(){
        return (
            <div className="content">
                This is the Unko content.
                <br />
                <hr />
                <button onClick={this.fetchList} className="btn btn-primary">Unko Hassha</button>    

                <p>Posts is {this.props.posts.length} items long</p>

                <hr />
                <ul>
                    {this.props.posts.map((c) => (
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