document.addEventListener("DOMContentLoaded", function () {
    const newBookForm = document.getElementById("inputBook");
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const completeBookshelfList = document.getElementById("completeBookshelfList");

    newBookForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addReadBook();
    });

    loadBooksData();

    function generateUniqueId() {
        return Math.random().toString(36).substr(2, 9);
    }  

    function addReadBook() {
        const title = document.getElementById("inputBookTitle").value;
        const author = document.getElementById("inputBookAuthor").value;
        const year = document.getElementById("inputBookYear").value;
        const isComplete = document.getElementById("inputBookIsComplete").checked;

        const bookId = generateUniqueId();
        const book = {
            id: bookId,
            title: title,
            author: author,
            year: parseInt(year),
            isComplete: isComplete,
        };

        const bookshelfList = isComplete ? completeBookshelfList : incompleteBookshelfList;

        const bookItems = createBookItem(book);

        const toggleButton = bookItems.querySelector(".toggle-button");
        toggleButton.addEventListener("click", function () {
            toggleBookshelf(book, bookshelfList, bookItems);
        });

        const deleteButton = bookItems.querySelector(".delete-button");
        deleteButton.addEventListener("click", function () {
            deleteBook(book.id, bookshelfList, bookItems);
        });

        bookshelfList.appendChild(bookItems);
        newBookForm.reset();

        saveBooks();

        console.log("Added Book:");
        console.log("ID:", book.id);
        console.log("Title:", book.title);
        console.log("Author:", book.author);
        console.log("Year:", book.year);
        console.log("Is Complete:", book.isComplete);
    }

    function createBookItem(book) {
        const bookItems = document.createElement("article");
        bookItems.classList.add("book_item");

        bookItems.innerHTML = `
            <h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun: ${book.year}</p>
            
            <div class="action">
                <button class="${book.isComplete ? 'green' : 'green'} toggle-button">
                    ${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}
                </button>
                <button class="red delete-button">Hapus buku</button>
            </div>
        `;

        return bookItems;
    }

    function toggleBookshelf(book, currentBookshelfList, bookItems) {
        const targetBookshelfList = book.isComplete ? incompleteBookshelfList : completeBookshelfList;

        currentBookshelfList.removeChild(bookItems);

        book.isComplete = !book.isComplete;

        targetBookshelfList.appendChild(bookItems);

        const toggleButton = bookItems.querySelector(".toggle-button");
        toggleButton.addEventListener("click", function () {
            toggleBookshelf(book, targetBookshelfList, bookItems);
        });

        const deleteButton = bookItems.querySelector(".delete-button");
        deleteButton.addEventListener("click", function () {
            deleteBook(book.id, targetBookshelfList, bookItems);
        });

        toggleButton.textContent = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
        toggleButton.className = book.isComplete ? 'green toggle-button' : 'green toggle-button';

        saveBooks();
    }

    function deleteBook(bookId, bookshelfList, bookItems) {
        bookshelfList.removeChild(bookItems);

        saveBooks();
    }

    function saveBooks() {
        const incompleteBooks = getBooksFromList(incompleteBookshelfList);
        const completeBooks = getBooksFromList(completeBookshelfList);

        localStorage.setItem("incompleteBooks", JSON.stringify(incompleteBooks));
        localStorage.setItem("completeBooks", JSON.stringify(completeBooks));
    }

    function loadBooksData() {
        const incompleteBooks = JSON.parse(localStorage.getItem("incompleteBooks")) || [];
        const completeBooks = JSON.parse(localStorage.getItem("completeBooks")) || [];

        populateBookshelf(incompleteBookshelfList, incompleteBooks);
        populateBookshelf(completeBookshelfList, completeBooks);
    }

    function getBooksFromList(bookshelfList) {
        const books = [];
        const bookItems = bookshelfList.querySelectorAll(".book_item");

        bookItems.forEach(function (bookItem) {
            const title = bookItem.querySelector("h3").textContent;
            const author = bookItem.querySelector("p:nth-child(2)").textContent.replace("Penulis: ", "");
            const year = bookItem.querySelector("p:nth-child(3)").textContent.replace("Tahun: ", "");
            const isComplete = bookItem.querySelector(".toggle-button").textContent === 'Selesai dibaca';

            const book = {
                id: generateUniqueId(),
                title: title,
                author: author,
                year: parseInt(year),
                isComplete: isComplete,
            };

            books.push(book);
        });

        return books;
    }

    function populateBookshelf(bookshelfList, books) {
        books.forEach(function (book) {
            const bookItems = createBookItem(book);

            const toggleButton = bookItems.querySelector(".toggle-button");
            toggleButton.addEventListener("click", function () {
                toggleBookshelf(book, bookshelfList, bookItems);
            });

            const deleteButton = bookItems.querySelector(".delete-button");
            deleteButton.addEventListener("click", function () {
                deleteBook(book.id, bookshelfList, bookItems);
            });

            bookshelfList.appendChild(bookItems);
        });
    }

    const searchBookForm = document.getElementById("searchBook");
    searchBookForm.addEventListener("submit", function (event) {
        event.preventDefault();
        searchBooks();
    });

    function searchBooks() {
        const searchTitle = document.getElementById("searchBookTitle").value.toLowerCase();

        const allBooks = document.querySelectorAll(".book_item");
        allBooks.forEach(function (bookItem) {
            const title = bookItem.querySelector("h3").textContent.toLowerCase();

            if (title.includes(searchTitle)) {
                bookItem.style.display = "block";
            } else {
                bookItem.style.display = "none";
            }
        });
    }
});