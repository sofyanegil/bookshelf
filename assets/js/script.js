const books = [];
const RENDER_EVENT = "render-book";
const STORAGE_KEY = "BOOKS_APPS";

const addBtn = document.querySelector("button#addBtn");
const modal = document.querySelector(".modal");
const closeBtn = document.querySelector(".close");
const isBookComplete = document.querySelector("input#inputBookIsComplete");
const bookSubmit = document.querySelector("button#bookSubmit span");
const search = document.getElementById("searchBook");

search.addEventListener("submit", searchBook);

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

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  if (isStorageExist()) {
    readBook();
  }
  const bookForm = document.getElementById("inputBook");
  bookForm.addEventListener("submit", (e) => {
    modal.classList.toggle("hide");
    e.preventDefault();
    addBook();
    document.getElementById("inputBook").reset();
  });
});

function toast(msg, status) {
  let message = document.getElementById("toast");
  message.style.backgroundColor = status;
  message.innerText = msg;
  message.className = "show";
  setTimeout(() => {
    message.className = message.className.add("show", "");
  }, 3000);
}

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

function readBook() {
  const bookData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(bookData);
  if (data !== null) {
    for (bookItem of data) {
      books.push(bookItem);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
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

function searchBook(e) {
  e.preventDefault();
  const keyword = document.getElementById("searchBookField").value.toLowerCase();
  const booksDisplay = document.getElementsByClassName("item");
  for (const bookItem of booksDisplay) {
    const title = bookItem.firstElementChild.textContent;
    if (title.toLocaleLowerCase().indexOf(keyword) != -1) {
      bookItem.style.display = "";
    } else {
      bookItem.style.display = "none";
    }
  }
}

function findBook(bookId) {
  for (bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

function displayBook(bookObj) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObj.title;
  const textAuthor = (document.createElement("p").innerText = bookObj.author);
  textAuthor.innerText = bookObj.author;
  const textYear = document.createElement("p");
  textYear.innerText = bookObj.year;
  const textContainer = document.createElement("div");
  textContainer.classList.add("book");
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement("div");
  container.classList.add("item", "card");

  const editBtn = document.createElement("button");
  editBtn.classList.add("btn", "btn-third");
  editBtn.innerText = "Ubah";
  editBtn.addEventListener("click", (e) => {
    modal.classList.toggle("hide");
    editBook(bookObj.id);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("btn", "btn-danger");
  deleteBtn.innerText = "Hapus";
  deleteBtn.addEventListener("click", () => {
    if (confirm("Yakin ingin menghapus Buku?")) {
      deleteBook(bookObj.id);
      toast("Buku dihapus", "#EF8677");
    }
  });

  const readBtn = document.createElement("button");
  if (bookObj.isCompleted) {
    readBtn.classList.add("btn", "btn-secondary");
    readBtn.innerText = "Belum Selesai Dibaca";
    readBtn.addEventListener("click", () => {
      removeFromCompleted(bookObj.id);
      toast("Buku Belum selesai dibaca", "#f3f186");
    });
  } else {
    readBtn.classList.add("btn", "btn-secondary");
    readBtn.innerText = "Selesai Dibaca";
    readBtn.addEventListener("click", () => {
      moveToCompleted(bookObj.id);
      toast("Buku selesai dibaca", "#82B6D9");
    });
  }
  container.append(textContainer, readBtn, editBtn, deleteBtn);
  container.setAttribute("id", `book-${bookObj.id}`);
  return container;
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

document.addEventListener(RENDER_EVENT, function () {
  const unFinishBook = document.getElementById("not-finish");
  unFinishBook.innerHTML = "";

  const finishBook = document.getElementById("finish-book");
  finishBook.innerHTML = "";

  for (bookItem of books) {
    const bookElement = displayBook(bookItem);
    if (bookItem.isCompleted == false) unFinishBook.append(bookElement);
    else finishBook.append(bookElement);
  }
  const eMessage = "Daftar Buku Kosong";
  !finishBook.hasChildNodes() ? (finishBook.innerHTML = "<h3>" + eMessage + "</h3>") : 0;
  !unFinishBook.hasChildNodes() ? (unFinishBook.innerHTML = "<h3>" + eMessage + "</h3>") : 0;
});
