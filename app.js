console.log("Naomi's Library\n===============\n");

// PROJECT Section
console.log("PROJECT:\n========\n");

const books = [
  {
    id: 1,
    title: `Name of the Wind`,
    author: `Patrick Rothfuss`,
    read: true,
  },
  {
    id: 2,
    title: `The Hunger Games`,
    author: `Suzanne Collins`,
    read: true,
  },
  {
    id: 3,
    title: `Catching Fire`,
    author: `Suzanne Collins`,
    read: true,
  },
  {
    id: 4,
    title: `Mockingjay`,
    author: `Suzanne Collins`,
    read: false,
  },
];

class Book {
  constructor(id, title, author, read) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.read = read;
    this.favorite = false;
  }
}

class Library {
  constructor(books) {
    this.nextId = books.length;
    this.books = books;
  }

  addBook(book) {
    if (!book) {
        console.log(`Creating new book...`);
      // Select inputs from the form -- title, author, read:
      const title = document.getElementById(`title`);
      const author = document.getElementById(`author`);
      const read = document.getElementById(`read`);

      // Increment book count property:
      this.nextId++;

      // Create an instance from my Book class with the input values:
      var newBook = new Book(
        this.nextId,
        title.value,
        author.value,
        read.checked
      );

      // Push the new book instance into the books array:
      this.books.push(newBook);
    }
    console.log(`Book: `, book);
    console.log(`New Book: `, newBook);
    // Select the table body:
    const tbody = document.getElementById(`tableBody`);

    // Create new table row:
    const newTr = document.createElement(`tr`);
    newTr.classList.add(book ? book.id : newBook.id);
    newTr.addEventListener(`click`, () => {
      this.markFavorite(book ? book.id : newBook.id);
    });
    newTr.addEventListener(`dblclick`, () => {
      this.removeBook(book ? book.id : newBook.id);
    });

    //create three new table data cells:
    const newTitle = document.createElement(`td`);
    const newAuthor = document.createElement(`td`);
    const newRead = document.createElement(`td`);

    // Add text content to tabe data <td> cells with book values:
    newTitle.textContent = book ? book.title : newBook.title;
    newAuthor.textContent = book ? book.author : newBook.author;
    const newCheckBox = document.createElement(`input`);
    newCheckBox.classList.add(book ? book.id : newBook.id);
    newCheckBox.type = `checkbox`;
    newCheckBox.checked = book ? book.read : read.checked;
    newCheckBox.disabled = book ? book.read : read.checked;
    newCheckBox.addEventListener(`click`, (event) => {
      this.markRead(event.target, book ? book.id : newBook.id);
    });
    newRead.appendChild(newCheckBox);

    // Append the table data <td> to the table row <tr>:
    newTr.append(newTitle);
    newTr.append(newAuthor);
    newTr.append(newRead);

    // Append the table row <tr> to the table body <tbody>:
    tbody.appendChild(newTr);
    console.log(
      `Your book, "${book ? book.title : newBook.title}" by ${book ? book.author : newBook.author} has been added to the library.`
    );
  }

  markRead(checkBox, id) {
    this.books.forEach((book) => {
      if (id === book.id) {
        book.read = true;
        checkBox.disabled = true;
      }
    });
  }

  markFavorite(bookId) {
    this.books.forEach(book => {
      if (book.id === bookId) {
        book.favorite = !book.favorite;
      }
    });
    document.getElementsByClassName(bookId)[0].classList.toggle(`favorite`);
  }

  removeBook(bookId) {
    // Reassign the books array after filtering out the removed book:
    this.books = this.books.filter(({ id }) => bookId !== id);
    // Remove the book from the DOM
    const tBody = document.getElementById(`tableBody`);
    tBody.removeChild(document.getElementsByClassName(bookId)[0]);
  }
}

const library = new Library(books);
if (books.length > 0) {
  library.books.forEach((book) => {
    library.addBook(book);
  });
}

const form = document.getElementById(`form`);

form.addEventListener(`submit`, (event) => {
  event.preventDefault();
  library.addBook();
});
