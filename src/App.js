import React from 'react'
import './App.css'
import {search} from './BooksAPI'
import Book from './Book'
import Shelf from './Shelf'

const bookShelves = [
  {id:"currentlyReading", name:"Currently Reading"}, 
  {id:"wantToRead", name:"Want to Read"}, 
  {id:"read", name:"Read"}
]
class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false,
    searchTerm: "",
    searchResults:[],
    books:[]
  }

  constructor(props) {
    super(props)
    this.changeSearch = this.changeSearch.bind(this)
    this.renderSearch = this.renderSearch.bind(this)
    this.searchBook = this.searchBook.bind(this)
    this.handleChangeShelf = this.handleChangeShelf.bind(this)
  }

  handleChangeShelf(book, shelf) {
    var allBooks = this.state.books   // copy state to modify
    var bookFound = false
    allBooks.forEach((item, index) => {
      if (item.id === book.id){  // check already existing book
        bookFound = true
        if (shelf === "none") {
          allBooks.splice(index, 1)  // delete from array if none was selected
        } else {
          item.shelf = shelf   // add shelf info
        }
      }
    })
    if (!bookFound) {     // if not found, adds book for the first time
      book.shelf = shelf
      allBooks.push(book)
    }
    this.setState({books: allBooks}) // update state with changes
  }

  changeSearch(e) {
    // changes the text on seach box, and call searchBook function
    this.setState({searchTerm: e.target.value}, () => this.searchBook(this.state.searchTerm))
  }

  searchBook(searchString) {
    if (searchString.length > 0) {
      search(searchString)
      .then(results => {
        if (results) {
          results.forEach(item => {
            var existingBook = this.state.books.filter(b => {
              return b.id === item.id
            }) // checks if book already added
            if (existingBook.length > 0) {
              item.shelf = existingBook[0].shelf  // sets the shelf of the searched book
            } 
          })
          this.setState({searchResults: results})   // saves search result to state
        }
      })
      .catch(error => {
        this.setState({searchResults: []})   // sets empty array if no items were found
      })
    } else {
      this.setState({searchResults: []})   // sets empty array if searchString is empty
    }
  }

  renderSearch() {
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a>
          <div className="search-books-input-wrapper">
            <input type="text" placeholder="Search by title or author" onChange={this.changeSearch} value={this.state.searchTerm}/>
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
          {(this.state.searchResults.length > 0 ) 
          ?  this.state.searchResults.map(book => <Book key={book.id} data={book} handleChangeShelf={this.handleChangeShelf}/>)
          :  ""
          }
          </ol>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="app">
        {this.state.showSearchPage ? this.renderSearch() : (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                {bookShelves.map(shelf => {
                    let books = this.state.books.filter(book => book.shelf === shelf.id)  // filters books for the shelf
                    return <Shelf title={shelf.name} id={shelf.id} key={shelf.id} books={books} handleChangeShelf={this.handleChangeShelf} /> 
                  })
                }
              </div>
            </div>
            <div className="open-search">
              <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default BooksApp
