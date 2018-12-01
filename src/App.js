import React from 'react'
import './App.css'
import {search, get} from './BooksAPI'
import Book from './Book'
import Shelf from './Shelf'
import {BrowserRouter, Route, Link} from 'react-router-dom'

const bookShelves = [
  {id:"currentlyReading", name:"Currently Reading"}, 
  {id:"wantToRead", name:"Want to Read"}, 
  {id:"read", name:"Read"}
]
class BooksApp extends React.Component {
  state = {
    searchTerm: "",
    searchResults:[],
    books:[]
  }

  constructor(props) {
    super(props)
    this.changeSearch = this.changeSearch.bind(this)
    this.renderSearch = this.renderSearch.bind(this)
    this.renderShelves = this.renderShelves.bind(this)
    this.searchBook = this.searchBook.bind(this)
    this.handleChangeShelf = this.handleChangeShelf.bind(this)
  }
  
  componentDidMount() {
    this.loadFromStorage()
  }

  handleChangeShelf(book, shelf) {
    let bookFound = false
    let newList;
    if (shelf === 'none') {
      newList = this.state.books.filter(item => item.id !== book.id) // only returns books that didnt change 
    } else {
      newList = this.state.books.slice().map(item => {
        
        if (item.id === book.id) { // check already existing book
          item.shelf = shelf
          bookFound = true      
        } 
        return item
      })
    }
    if (!bookFound) {     // if not found, adds book for the first time
      book.shelf = shelf
      newList = this.state.books.concat(book)
    }

    this.saveToStorage(newList)
    this.setState({books: newList}) // update state with changes
  }
  
  saveToStorage(books) {
    localStorage.setItem('books', JSON.stringify(books.map(book => ({id: book.id, shelf: book.shelf}))))
  }
  
  loadFromStorage() {
    const books = JSON.parse(localStorage.getItem('books')) || []
    books.forEach(book => {
      get(book.id)
      .then(result => {
        this.handleChangeShelf(result, book.shelf)
      })
    })
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
          <Link to="/" className="close-search">Close</Link>
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

  renderShelves() {
    return (
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
          <Link to="/search">Add a book</Link>
        </div>
      </div>
    )
  }

  render() {
    return (
        <BrowserRouter>
          <div className="app">
            <Route path="/" exact component={this.renderShelves}></Route>
            <Route path="/search" exact component={this.renderSearch}></Route>
          </div>
        </BrowserRouter>
    )
  }
}

export default BooksApp
