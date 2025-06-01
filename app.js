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

    // Simplify Readability:
    const bookObj = book ?? newBook;

    // Testing:
    console.log(`Book Object:`, bookObj);

    // Select the table body:
    const tbody = document.getElementById(`tableBody`);

    // Create new table row:
    const newTr = document.createElement(`tr`);
    newTr.classList.add(bookObj.id);

    //create three new table data cells:
    const newTitle = document.createElement(`td`);
    const newAuthor = document.createElement(`td`);
    const newRead = document.createElement(`td`);

    // New menu button:
    const menuTd = document.createElement(`td`);
    menuTd.classList.add(`menuCell`);

    // Snowman button:
    const snowmanButton = document.createElement(`button`);
    snowmanButton.textContent = `...`;
    snowmanButton.classList.add(`snowmanButton`);

    // Snowman Menu:
    const menu = document.createElement(`div`);
    menu.classList.add(`menuButton`);
    menu.style.display = "none";

    // Menu buttons:
    const markUnreadButton = document.createElement(`button`);
    markUnreadButton.textContent = `Mark Unread`;
    markUnreadButton.addEventListener(`click`, (e) => {
      e.stopPropagation();
      const row = document.getElementsByClassName(bookObj.id)[0];
      const checkBox = row.querySelector("input[type='checkbox']");
      this.markUnread(checkBox, bookObj.id);
      menu.style.display = `none`;
    });

    const favoriteButton = document.createElement(`button`);
    favoriteButton.textContent = `Favorite`;
    favoriteButton.addEventListener(`click`, (e) => {
      e.stopPropagation();
      this.markFavorite(bookObj.id);
      menu.style.display = `none`;
    });

    const deleteButton = document.createElement(`button`);
    deleteButton.textContent = `Delete`;
    deleteButton.addEventListener(`click`, (e) => {
      e.stopPropagation();
      this.removeBook(bookObj.id);
      menu.style.display = `none`;
    });

    // Append buttons to the menu:
    menu.appendChild(markUnreadButton);
    menu.appendChild(favoriteButton);
    menu.appendChild(deleteButton);

    // Toggle menu button when clicking snowman:
    snowmanButton.addEventListener(`click`, (e) => {
      e.stopPropagation();

      const isOpen = menu.style.display === `block`;

      if (isOpen) {
        // Start fade-out animation:
        menu.classList.remove(`fadeIn`);
        menu.classList.add(`fadeOut`);

        // Delay hiding until animation finishes (~200ms):
        setTimeout(() => {
          menu.style.display = `none`;
        }, 200);

        // revert to snowman:
        snowmanButton.textContent = `...`;
      } else {
        menu.classList.remove(`fadeOut`);
        menu.classList.add(`fadeIn`);

        menu.style.display = `block`;

        // Switch to close icon:
        snowmanButton.textContent`✖`;

        // Add "click outside to close" logic:
        document.addEventListener(`click`, function handler(event) {
          if (!menu.contains(event.target) && event.target !== snowmanButton) {
            menu.style.display = `none`;
            document.removeEventListener(`click`, handler);
          }
        });
      }
    });
      

    // Assemble menu cell:
    menuTd.appendChild(snowmanButton);
    menuTd.appendChild(menu);

    // Add text content to tabe data <td> cells with book values:
    newTitle.textContent = bookObj.title;
    newAuthor.textContent = bookObj.author;

    // Checkbox:
    const newCheckBox = document.createElement(`input`);
    newCheckBox.classList.add(bookObj.id);
    newCheckBox.type = `checkbox`;
    newCheckBox.checked = bookObj.checked;
    newCheckBox.disabled = bookObj.checked;
    newCheckBox.addEventListener(`click`, (event) => {
      this.markRead(event.target, bookObj.id);
    });
    newRead.appendChild(newCheckBox);

    // Append the table data <td> to the table row <tr>:
    newTr.append(newTitle);
    newTr.append(newAuthor);
    newTr.append(newRead);

    // Snowman button column:   Console says error is on this line.
    newTr.appendChild(menuTd);

    // Append the table row <tr> to the table body <tbody>:
    tbody.appendChild(newTr);
    console.log(
      `Your book, "${bookObj.title}" by ${bookObj.author} has been added to the library.`
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

  markUnread(checkBox, id) {
    this.books.forEach((book) => {
      if (book.id === id) {
        book.read = false;
        checkBox.disabled = false;
        checkBox.checked = false;
      }
    });
  }

  markFavorite(bookId) {
    this.books.forEach((book) => {
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
