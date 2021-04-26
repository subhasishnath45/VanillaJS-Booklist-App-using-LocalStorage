//Book Class: represents a book

class Book{
    // constructor of our Book class
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class: handle UI tasks

class UI{
    // All methods are static, so that we don't have to instantiate the UI class
    // to use those methods.
    static displayBooks(){
        // books will come from local storage.
        // assign the books array to books constant.
        const books = Store.getBooks();
        // using forEach() method I'm looping through the books aray.
        books.forEach((book)=>{
            // calling addBookToList() method of UI class to add each book.
            UI.addBookToList(book);
        });

    }
    // A static method for adding a new book to the list.
    static addBookToList(book){
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row);
    }

    static deleteBook(el){
        // checking if the target element has delete class
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }

    // custom alert div for bootstrap alert.
    static showAlert(message, className){
        // creating alert element.
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div,form);
        // alert autometically disappers after 3 seconds.
        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000);
    }

    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// Store class: that handles local storage.
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            // JSON.parse() converts a string to a js object.
            books = JSON.parse(localStorage.getItem('books'));
        }
        // returns a JS object of arrays.
        return books;
    }
    static addBook(book){
        // first getting the books js object returned by getBooks() method.
        const books = Store.getBooks();
        // Pushing a single book onto our books object.
        books.push(book);
        // Creating a localStorage name/value pair
        // JSON.stringify to convert array to string.
        localStorage.setItem('books', JSON.stringify(books));
    }
    // isbn is unique identifier of a book.
    static removeBook(isbn){
        // So first we're fetching array of books
        const books = Store.getBooks();
        // extracting each Book object from books array.
        // forEach() method calls a function once for each element in an array
        books.forEach((book, index)=>{
            if(book.isbn === isbn){
                // The splice() method adds/removes items to/from an array, and returns the removed item(s).
                // array.splice(index, remove howmany, item1, ....., itemX)
                // here we're removing 1 item and adding nothing.
                books.splice(index,1);
            }
        });
        // Now we need to reset local storage again after 1 book is removed.
        localStorage.setItem('books', JSON.stringify(books));
    }
}
// Event: to Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks)
// Event: to add a book
document.querySelector('#book-form').addEventListener('submit',(e)=>{
    // preventing the actual form submission.
    e.preventDefault();
    // Get form field values.
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // validate form fields.
    if(title === '' || author === '' || isbn === ''){
        // alert("Please fill in all fields");
        UI.showAlert("Please fill in all fields",'danger');
    }else{
        // Instanciate Book class.
        const book = new Book(title,author,isbn);
        // console.log(book);
        // We will add the Book object to our UI class.
        UI.addBookToList(book);

        // We also add book to the local storage.
        Store.addBook(book);

        // Show success alert after the book is successfully added.
        UI.showAlert('A new Book is Added successfully.', 'success');
        // clearing form fields.
        UI.clearFields();
    }
});

// Event: to remove a book
document.querySelector('#book-list').addEventListener('click',(e)=>{
    // console.log(e.target);
    // Deleting the Book from the UI.
    UI.deleteBook(e.target);

    // Also Deleting the book from local storage.
    // The previousElementSibling property returns the previous element of the specified element, 
    // in the same tree level.
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    // Show an alert while deletion is successful.
    UI.showAlert('A Book is removed from the list.', 'warning');
});