import React from 'react'

export default class Book extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: props.data.shelf || "none"
        }
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange(e){
        // change the select , and calls the function to change book shelf
        this.setState({selected: e.target.value}, () => this.props.handleChangeShelf(this.props.data, this.state.selected))
    }
    render() {
        return (
            <div className="book">
                <div className="book-top">
                    <div className="book-cover" style={{ width: 128, height: 174, backgroundImage: 'url(' + (this.props.data.imageLinks ? this.props.data.imageLinks.thumbnail : '') + ')' }}></div>
                    <div className="book-shelf-changer">
                        <select onChange={this.handleChange} value={this.state.selected}>
                            <option value="move" disabled>Move to...</option>
                            <option value="currentlyReading">Currently Reading</option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
                            <option value="none">None</option>
                        </select>
                    </div>
                </div>
                <div className="book-title">{this.props.data.title}</div>
                <div className="book-authors">{this.props.data.authors}</div>
            </div>
        )
    }
}
