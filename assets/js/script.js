const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-books";
const STORAGE_KEY = "BOOKS_APPS";

const addBtn = document.querySelector("button#addBtn");
const modal = document.querySelector(".modal");
const closeBtn = document.querySelector(".close");
const isBookComplete = document.querySelector("input#inputBookIsComplete");
const bookSubmit = document.querySelector("button#bookSubmit span");

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function toast(msg, status) {
  let message = document.getElementById("toast");
  message.style.backgroundColor = status;
  message.innerText = msg;
  message.className = "show";
  setTimeout(() => {
    message.className = message.className.replace("show", "");
  }, 3000);
}

addBtn.addEventListener("click", () => {
  modal.classList.toggle("hide");
});

closeBtn.addEventListener("click", () => {
  modal.classList.toggle("hide");
});

isBookComplete.addEventListener("click", (e) => {
  if (e.target.checked) bookSubmit.innerText = "Selesai";
  else bookSubmit.innerText = "Belum selesai";
});

function resetForm() {
  document.getElementById("inputBook").reset();
}

document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("inputBook");

  bookForm.addEventListener("submit", (e) => {
    modal.classList.toggle("hide");

    e.preventDefault();
    addBook();
    resetForm();
  });

  if (isStorageExist()) {
    loadDataBook();
  }
});

function addBook() {
  const id = +new Date();
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const isCompleted = document.getElementById("inputBookIsComplete").checked;

  const bookObj = { id, title, author, year, isCompleted };

  books.push(bookObj);

  document.dispatchEvent(new Event(RENDER_EVENT));
  toast("Buku berhasil ditambahkan!", "#A0E77D");
  saveData();
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    // document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function createBook(bookObj) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObj.title;
  const textAuthor = document.createElement("p");
  textAuthor.innerText = bookObj.author;
  const textYear = document.createElement("p");
  textYear.innerText = bookObj.year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("book");
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement("div");
  container.classList.add("item", "card");

  const editBtn = document.createElement("button");
  editBtn.classList.add("btn", "btn-third", "btn-edit");
  editBtn.innerText = "Edit";
  editBtn.addEventListener("click", (e) => {
    //! console.log("hehe");
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("btn", "btn-danger", "btn-delete");
  deleteBtn.innerText = "Delete";
  deleteBtn.addEventListener("click", () => {
    if (confirm("Yakin ingin menghapus Buku?")) {
      deleteBook(bookObj.id);
      toast("Buku dihapus", "#EF8677");
    }
  });

  const readBtn = document.createElement("button");

  if (bookObj.isCompleted) {
    readBtn.classList.add("btn", "btn-secondary", "btn-uncompleted");
    readBtn.innerText = "Belum Selesai Dibaca";
    readBtn.addEventListener("click", () => {
      removeFromCompleted(bookObj.id);
      toast("Buku Belum selesai dibaca", "#f3f186");
    });
  } else {
    readBtn.classList.add("btn", "btn-secondary", "btn-completed");
    readBtn.innerText = "Selesai Dibaca";
    readBtn.addEventListener("click", () => {
      moveToCompleted(bookObj.id);
      toast("Buku selesai dibaca", "#82B6D9");
    });
  }
  container.append(textContainer, readBtn, editBtn, deleteBtn);

  container.setAttribute("id", `books-${bookObj.id}`);

  return container;
}

document.addEventListener(RENDER_EVENT, function () {
  const unFinishBook = document.getElementById("not-finish");
  unFinishBook.innerHTML = "";

  const finishBook = document.getElementById("finish-book");
  finishBook.innerHTML = "";

  for (bookItem of books) {
    const bookElement = createBook(bookItem);
    if (bookItem.isCompleted == false) unFinishBook.append(bookElement);
    else finishBook.append(bookElement);
  }
  const eMessage = "Daftar Buku Kosong";
  !finishBook.hasChildNodes() ? (finishBook.innerHTML = "<h3>" + eMessage + "</h3>") : 0;
  !unFinishBook.hasChildNodes() ? (unFinishBook.innerHTML = "<h3>" + eMessage + "</h3>") : 0;
});

function loadDataBook() {
  const bookData = localStorage.getItem(STORAGE_KEY);

  let data = JSON.parse(bookData);

  if (data !== null) {
    for (bookItem of data) {
      books.push(bookItem);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function findBook(bookId) {
  for (bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function moveToCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function deleteBook(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function editBook(bookId) {
  const bookTarget = findBook(bookId);
  console.log(bookTarget.title);

  const form = document.querySelector(".input-section");

  const title = document.querySelector(".input-section h2");
  const editTitle = document.getElementById("inputBookTitle");
  const editAuthor = document.getElementById("inputBookAuthor");
  const editYear = document.getElementById("inputBookYear");
  const editComplete = document.getElementById("inputBookIsComplete");

  title.innerText = "Edit Buku";
  editTitle.value = bookTarget.title;
  editAuthor.value = bookTarget.author;
  editYear.value = bookTarget.year;
  editComplete.checked = bookTarget.isCompleted;
}
