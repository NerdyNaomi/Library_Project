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
    this.authors = new Set();
  }

  addBook(book) {
    if (!book) {
      console.log(`Creating new book...`);
      // Select inputs from the form -- title, author, read:
      const title = document.getElementById(`title`);
      const author = document.getElementById(`author`);
      const read = document.getElementById(`read`);

      // Make sure fields aren't blank:
      const titleText = title.value.trim();
      const authorText = author.value.trim();

      //Check for duplicates:
      const existing = this.books.some(
        (b) =>
          b.title.trim().toLowerCase() === titleText.toLowerCase() &&
          b.author.trim().toLowerCase() === authorText.toLowerCase()
      );

      if (existing) {
        alert(`A book titled "${titleText}" already exists in the library.`);
        return;
      }

      // Increment book count property:
      this.nextId++;

      // Create an instance from my Book class with the input values:
      var newBook = new Book(
        this.nextId,
        title.value,
        author.value,
        read.checked
      );

      // // Check for a blank title or author:
      // if (!titleText || !authorText) {
      //   alert(`Oops! Looks like something's missing. Make sure both title and author are filled in!`);
      //   return;
      // }
      // The HTML does this for me but I'm keeping this for future reference.

      // Check for suspicious titles and authors:
      const validTitlePattern = /[a-zA-Z0-9]{2,}/;
      const validAuthorPattern = /[a-zA-Z]{2,}/;

      if (!validTitlePattern.test(titleText)) {
        const proceed = confirm(
          `Does this title look right to you?\n\n${titleText}`
        );
        if (!proceed) return;
      }

      if (!validAuthorPattern.test(authorText)) {
        const proceed = confirm(
          `Does this author look right to you?\n\n${authorText}`
        );
        if (!proceed) return;
      }

      // Push the new book instance into the books array:
      this.books.push(newBook);

      // Clear the form inputs after successful entry:
      title.value = "";
      author.value = "";
      read.checked = false;
    }

    const bookObj = book ?? newBook;

    // Author list management:
    this.authors.add(bookObj.author);
    this.updateAuthorSuggestions();

    // Render the table of book titles:
    this.renderBook(bookObj);
    console.log(
      `Your book, "${bookObj.title}" by ${bookObj.author} has been added to the library.`
    );
  }

  renderBook(book) {
    // Testing:
    console.log(`Book Object:`, book);

    // Select the table body:
    const tbody = document.getElementById(`tableBody`);

    // Create new table row:
    const newTr = document.createElement(`tr`);
    newTr.classList.add(book.id);

    //create three new table data cells:
    const newTitle = document.createElement(`td`);
    const newAuthor = document.createElement(`td`);
    const newRead = document.createElement(`td`);

    // New menu button:
    const menuTd = document.createElement(`td`);
    menuTd.classList.add(`menuCell`);

    // Snowman button:
    const snowmanButton = document.createElement(`button`);
    snowmanButton.classList.add(`snowmanButton`);
    snowmanButton.textContent = `...`;

    // Snowman Menu:
    const menu = document.createElement(`div`);
    menu.classList.add(`menuButton`);
    menu.style.display = `none`;

    // Menu buttons:
    const markUnreadButton = document.createElement(`button`);
    markUnreadButton.textContent = `Mark Unread`;

    // Remove "Mark Unread" if the book is already unread:
    if (!book.read) {
      markUnreadButton.style.display = "none";
    }

    markUnreadButton.addEventListener(`click`, (e) => {
      e.stopPropagation();
      const row = document.getElementsByClassName(book.id)[0];
      const checkBox = row.querySelector("input[type='checkbox']");
      this.markUnread(checkBox, book.id);
      menu.style.display = `none`;
      snowmanButton.textContent = `...`;

      // Hide "Mark Unread" after option is used:
      markUnreadButton.style.display = "none";
    });

    const favoriteButton = document.createElement(`button`);
    favoriteButton.textContent = book.favorite ? `Unfavorite` : `Favorite`;
    favoriteButton.addEventListener(`click`, (e) => {
      e.stopPropagation();
      this.markFavorite(book.id);
      favoriteButton.textContent = book.favorite ? `Unfavorite` : `Favorite`;
      menu.style.display = `none`;
      snowmanButton.textContent = `...`;
    });

    const deleteButton = document.createElement(`button`);
    deleteButton.textContent = `Delete`;
    deleteButton.addEventListener(`click`, (e) => {
      e.stopPropagation();
      const confirmDelete = confirm(
        `Would you like to permanently delete this book?\n\n${book.title} by ${book.author}`
      );
      if (!confirmDelete) return;

      this.removeBook(book.id);
      menu.style.display = `none`;
      snowmanButton.textContent = `...`;
    });

    // Append buttons to the menu:
    menu.appendChild(markUnreadButton);
    menu.appendChild(favoriteButton);
    menu.appendChild(deleteButton);

    // Toggle menu button when clicking snowman:
    menu.addEventListener("animationend", function handleFadeOut(event) {
      if (event.animationName === "fadeOutMenu") {
        menu.style.display = "none";
        menu.classList.remove("fadeOut");
      }
    });

    snowmanButton.addEventListener("click", (e) => {
      e.stopPropagation();

      const isOpen = menu.style.display === "block";

      if (isOpen) {
        menu.classList.remove("fadeIn");

        // Force reflow to restart animation properly
        void menu.offsetWidth;

        menu.classList.add("fadeOut");
        snowmanButton.textContent = "...";
      } else {
        menu.classList.remove("fadeOut");
        menu.classList.add("fadeIn");

        menu.style.display = "block";
        snowmanButton.textContent = "✖";

        // FULL DISCLOSURE: I struggled with this for weeks and so this section is copy-pasted.
        const outsideClickHandler = (event) => {
          if (!menu.contains(event.target) && event.target !== snowmanButton) {
            menu.classList.remove("fadeIn");
            menu.classList.add("fadeOut");
            snowmanButton.textContent = "...";

            // Wait for animation end to hide the menu
            menu.addEventListener("animationend", function hideAfterFade(e) {
              if (e.animationName === "fadeOutMenu") {
                menu.style.display = "none";
                menu.classList.remove("fadeOut");
                menu.removeEventListener("animationend", hideAfterFade);
              }
            });

            document.removeEventListener("click", outsideClickHandler);
          }
        };

        setTimeout(() => {
          document.addEventListener("click", outsideClickHandler);
        }, 0);
        // End copy-pasted section.
      }
    });

    // Assemble menu cell:
    menuTd.appendChild(snowmanButton);
    menuTd.appendChild(menu);

    // Add text content to tabe data <td> cells with book values:
    newTitle.textContent = book.title;
    newAuthor.textContent = book.author;

    // Checkbox:
    const newCheckBox = document.createElement(`input`);
    newCheckBox.classList.add(book.id);
    newCheckBox.type = `checkbox`;
    newCheckBox.checked = book.read;
    newCheckBox.disabled = book.read;
    newCheckBox.addEventListener(`click`, (event) => {
      this.markRead(event.target, book.id);
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
  }

  updateAuthorSuggestions() {
    const dataList = document.getElementById("author-list");
    if (!dataList) {
      console.warn(`Datalist element not found: #author-list`);
      return;
    }
    // Clear previous suggestions:
    dataList.innerHTML = "";

    this.authors.forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      dataList.appendChild(option);
    });
  }

  markRead(checkBox, id) {
    this.books.forEach((book) => {
      if (id === book.id) {
        book.read = true;
        const row = document.getElementsByClassName(id)[0];
        if (row) {
          const menu = row.querySelector(".menuButton");
          const markUnreadBtn = [...menu.children].find((btn) =>
            btn.textContent.includes("Mark Unread")
          );
          if (markUnreadBtn) {
            markUnreadBtn.style.display = "block";
          }
        }
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

  sortBooks(type) {
    let sorted = [...this.books]; //Make a copy of the list

    switch (type) {
      case "title-asc":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "author-asc":
        sorted.sort((a, b) => a.author.localeCompare(b.author));
        break;
      case "author-desc":
        sorted.sort((a, b) => b.author.localeCompare(a.author));
        break;
      case "read":
        sorted.sort((a, b) => Number(b.read) - Number(a.read));
        break;
      case "unread":
        sorted.sort((a, b) => Number(a.read) - Number(b.read));
        break;
    }

    // Clear and re-render table:
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";
    sorted.forEach((book) => this.renderBook(book));
  }
}

document.addEventListener(`DOMContentLoaded`, () => {
  const library = new Library(books);

  if (books.length > 0) {
    library.books.forEach((book) => {
      library.renderBook(book);
      library.authors.add(book.author);
    });
    library.updateAuthorSuggestions();
  }

  const form = document.getElementById(`form`);

  form.addEventListener(`submit`, (event) => {
    event.preventDefault();
    library.addBook();
  });

  const sortSelect = document.getElementById("sort");

  sortSelect.addEventListener("change", (event) => {
    library.sortBooks(event.target.value);
  });
});
