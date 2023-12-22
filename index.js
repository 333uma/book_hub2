const express = require("express");
const app = express();
const path = require("path");
const {open} = require("sqlite");
const sqlite3 = require("sqlite3");
const books = require('./books.json');
const dbPath = path.join(__dirname,'books.db');
const cors = require("cors");
app.use(cors());

let db = null;

let bookObj = books.books;
const shelf_books = require('./shelf.json');
const shelf_obj = shelf_books.books;

const initializeDBAndServer = async () => {
    try{
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        })

        app.listen(4000, () => {
            console.log(`Server Running on: ${4000}`);
        })
    }
    catch(error){
        console.log(`DB Error: ${error.message}`);
    }
}

initializeDBAndServer();



app.get("/",async (request,response) => {
    const getAllBooksQuery = `SELECT DISTINCT * FROM book`;
    const getBooks = await db.all(getAllBooksQuery);
    const newObj = {getBooks, "total" : getBooks.length};
    response.send(newObj);
})

app.get("/shelf", async (request, response) => {
    const getShelfBooksQuery = `SELECT * FROM shelfbooks`;
    const getShelfBook = await db.all(getShelfBooksQuery);
    const newShelf = {getShelfBook, "total" : getShelfBook.length};
    response.send(newShelf);
})

app.get("/books/:id", async(request,response) => {
    const {id} = request.params;
    const getBookQuery = `SELECT * FROM shelfbooks WHERE id = "${id}"`;
    const getBook = await db.get(getBookQuery);
    response.send(getBook);
});

app.get("/book_hub/books", async (request, response) => {
    const {status = "", search_q = ""} = request.query;
    //let status = ["Currently Reading", "Want to Read", "Read"];
    console.log(request.query);
    const getFilteredBooksQuery = `SELECT * FROM shelfbooks WHERE read_status = "${status}" AND (title LIKE '%${search_q}%' OR author_name LIKE '%${search_q}%');`;
    const getFilteredBooks = await db.all(getFilteredBooksQuery);
    response.send(getFilteredBooks);
})
                                        




