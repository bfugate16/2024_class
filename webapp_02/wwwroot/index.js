//Define our application
function webapp_02() {
    //Gobal variables (use sparingly)
    var sortOrder = "AuthorID";

    //Get elements
    var navPage01 = document.getElementById("nav-page-01");
    var navPage02 = document.getElementById("nav-page-02");
    var navPage03 = document.getElementById("nav-page-03");

    var page01 = document.getElementById("page-01");
    var page02 = document.getElementById("page-02");
    var page03 = document.getElementById("page-03");

    var inputBookSearch = document.getElementById("input-book-search");
    var buttonBooksShowAll = document.getElementById("button-books-show-all");
    var buttonBooksClear = document.getElementById("button-books-clear");
    var buttonBookInsert = document.getElementById("button-book-insert");
    var bookTable = document.getElementById("book-table");


    var buttonPagePrevious = document.getElementById("button-page-previous");
    var buttonPageNext = document.getElementById("button-page-next");
    var inputPage = document.getElementById("input-page");
    var selectPageSize = document.getElementById("select-page-size");
    var divPaginationMessage = document.getElementById("div-pagination-message");

    var formBookInsert = document.getElementById("form-book-insert");
    var inputBookInsertTitle = document.getElementById("input-book-insert-title");
    var inputBookInsertAuthor = document.getElementById("input-book-insert-author");
    // var inputBookInsertBookID = document.getElementById("input-book-insert-book-id");
    var buttonBookInsertSave = document.getElementById("button-book-insert-save");
    var buttonBookInsertCancel = document.getElementById("button-book-insert-cancel");

    var inputBookInsertTitleValidationMessage = document.getElementById("input-book-insert-title-validation-message");
    var inputBookInsertAuthorNameValidationMessage = document.getElementById("input-book-insert-author-validation-message");
    //var inputBookInsertBookIDValidationMessage = document.getElementById("input-book-insert-book-id-validation-message");

    var formBookUpdate = document.getElementById("form-book-update");
    var inputBookUpdateBookId = document.getElementById("input-book-update-book-id");
    var inputBookUpdateTitle = document.getElementById("input-book-update-title");
    var inputBookUpdateAuthor = document.getElementById("input-book-update-author");
    var inputBookUpdateHasBeenRead = document.getElementById("input-book-update-has-been-read");
    var inputBookUpdateDateRead = document.getElementById("input-book-update-date-read");
    var inputBookUpdateIsOnWishlist = document.getElementById("input-book-update-is-on-wishlist");
    var inputBookUpdateNotes = document.getElementById("input-book-update-notes");
    var buttonBookUpdateSave = document.getElementById("button-book-update-save");
    var buttonBookUpdateCancel = document.getElementById("button-book-update-cancel");



    //Add event listeners
    window.addEventListener('popstate', handlePopState);

    navPage01.addEventListener("click", handleButtonNavPage01Click);
    //navPage02.addEventListener("click", handleButtonNavPage02Click);
    navPage03.addEventListener("click", handleButtonNavPage03Click);

    inputBookSearch.addEventListener("keyup", handleInputBooksSearchClick);
    buttonBooksShowAll.addEventListener("click", handleButtonBooksShowAllClick);
    buttonBooksClear.addEventListener("click", handleButtonBooksClearClick);

    buttonBookInsert.addEventListener("click", handleButtonBookInsertClick);
    buttonBookInsertSave.addEventListener("click", handleButtonBookInsertSaveClick);
    buttonBookInsertCancel.addEventListener("click", handleButtonBookInsertCancelClick);

    inputBookInsertTitle.addEventListener("blur", validateBookInsertTitle);
    inputBookInsertAuthor.addEventListener("blur", validateBookInsertAuthor);


    buttonPagePrevious.addEventListener("click", handleButtonPagePreviousClick);
    buttonPageNext.addEventListener("click", handleButtonPageNextClick);
    selectPageSize.addEventListener("change", handleSelectPageSizeChange);

    buttonBookUpdateSave.addEventListener("click", handleButtonBookUpdateSaveClick);
    buttonBookUpdateCancel.addEventListener("click", handleButtonBookUpdateCancelClick);

    //Functions
    function handleButtonNavPage01Click(event) {
        event.preventDefault();
        window.history.pushState({}, "", "/" + "Books");
        showPage("Books");
    }

    function handleButtonNavPage02Click(event) {
        event.preventDefault();
        window.history.pushState({}, "", "/" + "ToBeRead");
        showPage("To Be Read");
    }

    function handleButtonNavPage03Click(event) {
        event.preventDefault();
        window.history.pushState({}, "", "/" + "About");
        showPage("About");
    }

    function showPage(page) {
        if (page.toLowerCase() === "books" || page === "") {  //lowercase comparison
            showPage01();
            hidePage02();
            hidePage03();
        } else if (page.toLowerCase() === "customers") {  //lowercase comparison
            hidePage01();
            showPage02();
            hidePage03();
        } else if (page.toLowerCase() === "products") {  //lowercase comparison
            hidePage01();
            hidePage02();
            showPage03();
        }
    }

    function showPage01() {
        navPage01.classList.remove("link-secondary");
        navPage01.classList.remove("link-opacity-50");
        navPage01.classList.add("link-body-emphasis");
        navPage01.classList.add("link-opacity-100");
        page01.classList.remove("visually-hidden");
    }

    function hidePage01() {
        page01.classList.add("visually-hidden");
        navPage01.classList.add("link-secondary");
        navPage01.classList.add("link-opacity-50");
        navPage01.classList.remove("link-body-emphasis");
        navPage01.classList.remove("link-opacity-100");
    }

    /* function showPage02() {
         navPage02.classList.remove("link-secondary");
         navPage02.classList.remove("link-opacity-50");
         navPage02.classList.add("link-body-emphasis");
         navPage02.classList.add("link-opacity-100");
         page02.classList.remove("visually-hidden");
     }
 
      function hidePage02() {
         page02.classList.add("visually-hidden");
         navPage02.classList.add("link-secondary");
         navPage02.classList.add("link-opacity-50");
         navPage02.classList.remove("link-body-emphasis");
         navPage02.classList.remove("link-opacity-100");
     }*/

    // function showPage03() {
    //     navPage03.classList.remove("link-secondary");
    //     navPage03.classList.remove("link-opacity-50");
    //     navPage03.classList.add("link-body-emphasis");
    //     navPage03.classList.add("link-opacity-100");
    //     page03.classList.remove("visually-hidden");
    // }

    // function hidePage03() {
    //     page03.classList.add("visually-hidden");
    //     navPage03.classList.add("link-secondary");
    //     navPage03.classList.add("link-opacity-50");
    //     navPage03.classList.remove("link-body-emphasis");
    //     navPage03.classList.remove("link-opacity-100");
    // }

    function handleNewUrl() {
        var page = window.location.pathname.split('/')[1];

        if (page === "") {
            window.history.replaceState({}, "", "/" + "Books");
        } else {
            window.history.replaceState({}, "", "/" + page);
        }

        showPage(page);
    }

    function handlePopState() {
        var page = window.location.pathname.split('/')[1];
        showPage(page);
    }

    function handleInputBooksSearchClick(event) {
        event.preventDefault();

        inputPage.value = 1;
        searchBooks();
    }

    function handleButtonBooksShowAllClick(event) {
        event.preventDefault();

        inputPage.value = 1;
        inputBookSearch.value = "";
        sortOrder = "BookId";
        searchBooks();
    }

    function searchBooks() {
        var url = "http://localhost:5284/books";  //Port must be the port the API is running on
        url += "?search=" + inputBookSearch.value;
        url += "&pagesize=" + selectPageSize.value;
        url += "&pagenumber=" + inputPage.value;
        url += "&sort=" + sortOrder;
        callAPI(url);
    }

    function insertBook() {
        var url = "http://localhost:5284/insertbook";  //Port must be the port the API is running on
        url += "?title=" + inputBookInsertTitle.value;
        url += "&author=" + inputBookInsertAuthor.value;
        url += "&search=" + inputBookSearch.value;
        url += "&pagesize=" + selectPageSize.value;
        url += "&pagenumber=" + inputPage.value;
        url += "&sort=" + sortOrder;
        callAPI(url);
    }

    function updateBook() {
        var url = "http://localhost:5284/updatebook";  //Port must be the port the API is running on
        url += "?bookid=" + inputBookUpdateBookId.value;
        url += "&title=" + inputBookUpdateTitle.value;
        url += "&author=" + inputBookUpdateAuthor.value;
        url += "&notes=" + inputBookUpdateNotes.value;
        url += "&hasbeenread=" + (inputBookUpdateHasBeenRead.checked ? "true" : "false");
        url += "&dateread=" + inputBookUpdateDateRead.value;
        url += "&isonwishlist=" + (inputBookUpdateIsOnWishlist.checked ? "true" : "false");
        url += "&search=" + inputBookSearch.value;
        url += "&pagesize=" + selectPageSize.value;
        url += "&pagenumber=" + inputPage.value;
        url += "&sort=" + sortOrder;
        //  alert(url);
        callAPI(url);
    }

    function deleteBook(employeeId) {
        var url = "http://localhost:5284/deletebook";  //Port must be the port the API is running on
        url += "?bookid=" + employeeId
        url += "&search=" + inputBookSearch.value;
        url += "&pagesize=" + selectPageSize.value;
        url += "&pagenumber=" + inputPage.value;
        url += "&sort=" + sortOrder;
        callAPI(url);
    }

    function callAPI(url) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = doAfterAPIResultsArrive;
        xhr.open("GET", url);
        xhr.send(null);

        function doAfterAPIResultsArrive() {
            var DONE = 4; // readyState 4 means the request is done.
            var OK = 200; // status 200 is a successful return.
            if (xhr.readyState === DONE) {
                if (xhr.status === OK) {

                    //Deserialize JSON response into a javascript object
                    var response = JSON.parse(xhr.responseText);

                    if (response.result === "success") {
                        //alert(response.message);

                        makePaginationMessage(response.bookResponse);

                        //Turn array of employees into an html table
                        makeBookTable(response.bookResponse.books);
                    } else {
                        alert("API Error: " + response.message);
                    }
                } else {
                    alert("Server Error: " + xhr.status + " " + xhr.statusText);
                }
            }
        }
    }

    function handleButtonBooksClearClick(event) {
        event.preventDefault();

        sortOrder = "BookId";
        inputPage.value = 1;
        inputBookSearch.value = "";
        bookTable.innerHTML = "";
    }

    function makePaginationMessage(bookResponse) {
        var startRow = bookResponse.startRow;
        var endRow = bookResponse.endRow;
        var totalRows = bookResponse.totalRows;
        var paginationMessage = "<p>" + startRow + " through " + endRow + " of " + totalRows + "</p>";

        if (totalRows > 0) {
            divPaginationMessage.innerHTML = paginationMessage;
        } else {
            divPaginationMessage.innerHTML = "";
        }
    }

    function makeBookTable(books) {

        //Create table top boilerplate
        var empString = '<table class="table table-sm">';

        empString += '<thead>';
        empString += '<tr>';
        empString += '<th scope="col">ID <button type="button" id="button-sort-book-id" class="btn btn-outline-secondary btn-sm btn-my-sort"><i class="bi bi-arrow-down-up"></i></button></th>';
        empString += '<th scope="col">Title <button type="button" id="button-sort-title" class="btn btn-outline-secondary btn-sm btn-my-sort"><i class="bi bi-arrow-down-up"></i></button></th>';
        empString += '<th scope="col">Author <button type="button" id="button-sort-author" class="btn btn-outline-secondary btn-sm btn-my-sort"><i class="bi bi-arrow-down-up"></i></button></th>';
        empString += '<th scope="col">Read <button type="button" id="button-sort-has-been-read" class="btn btn-outline-secondary btn-sm btn-my-sort"><i class="bi bi-arrow-down-up"></i></button></th>';
        empString += '<th scope="col">Date Read <button type="button" id="button-sort-date-read" class="btn btn-outline-secondary btn-sm btn-my-sort"><i class="bi bi-arrow-down-up"></i></button></th>';
        empString += '<th scope="col"> Wishlist <button type="button" id="button-sort-is-on-wishlist" class="btn btn-outline-secondary btn-sm btn-my-sort"><i class="bi bi-arrow-down-up"></i></button></th>';
        empString += '<th scope="col">Notes <button type="button" id="button-sort-notes" class="btn btn-outline-secondary btn-sm btn-my-sort"><i class="bi bi-arrow-down-up"></i></button></th>';
        empString += '<th scope="col"></th>';
        empString += '</tr>';
        empString += '</thead>';
        empString += '<tbody>';

        //Loop over employees array and build the table rows
        for (var i = 0; i < books.length; i++) {
            var book = books[i];
            empString += '<tr>';
            empString += '<td scope="row">' + book.bookId + '</td>';
            empString += '<td id="book-' + book.bookId + '-title">' + book.title + '</td>';
            empString += '<td id="book-' + book.bookId + '-author">' + book.author + '</td>';
            empString += '<td id="book-' + book.bookId + '-has-been-read">' + (book.hasBeenRead ? 'Yes' : 'No') + '</td>';
            var dateRead = (book.dateRead == null) ? "" : book.dateRead.substr(0, 10);
            empString += '<td id="book-' + book.bookId + '-date-read">' + dateRead + '</td>';
            empString += '<td id="book-' + book.bookId + '-is-on-wishlist">' + (book.isOnWishlist ? 'Yes' : 'No') + '</td>';
            var notes = (book.notes == null) ? "" : book.notes;
            // alert(book.notes + "xxx" + notes);
            empString += '<td id="book-' + book.bookId + '-notes">' + notes + '</td>';



            empString += '<td>';
            empString += '  <button type="button" class="btn btn-outline-secondary btn-sm book-table-update_button" data-book-id="' + book.bookId + '">Update</button>';
            empString += '  <button type="button" class="btn btn-outline-secondary btn-sm book-table-delete_button" data-book-id="' + book.bookId + '">Delete</button>';
            empString += '</td>';
            empString += '</tr>';


        }

        //Create table bottom boilerplate
        empString += '</tbody>';
        empString += '</table>';

        //Inject the table string
        bookTable.innerHTML = empString;

        //Get new elements we just created
        var buttonSortBookId = document.getElementById("button-sort-book-id");
        var buttonSortTitle = document.getElementById("button-sort-title");
        var buttonSortAuthor = document.getElementById("button-sort-author");
        var buttonSortHasBeenRead = document.getElementById("button-sort-has-been-read");
        var handleButtonSortDateRead = document.getElementById("button-sort-date-read");
        var buttonSortNotes = document.getElementById("button-sort-notes");
        var buttonSortIsOnWishlist = document.getElementById("button-sort-is-on-wishlist");




        var updateButtons = document.getElementsByClassName("book-table-update_button");
        var deleteButtons = document.getElementsByClassName("book-table-delete_button");

        //Add event listeners for new elements we just created
        buttonSortBookId.addEventListener("click", handleButtonSortBookIdClick);
        buttonSortTitle.addEventListener("click", handleButtonSortTitleClick);
        buttonSortAuthor.addEventListener("click", handleButtonSortAuthorClick);
        buttonSortHasBeenRead.addEventListener("click", handleButtonSortHasBeenReadClick);
        buttonSortNotes.addEventListener("click", handleButtonSortNotesClick);
        buttonSortIsOnWishlist.addEventListener("click", handleButtonSortIsOnWishlistClick);
        handleButtonSortDateRead.addEventListener("click", handleButtonSortDateReadClick);

        for (var i = 0; i < updateButtons.length; i++) {
            var updateButton = updateButtons[i];
            updateButton.addEventListener("click", handleBookTableUpdateClick);
        }

        for (var i = 0; i < deleteButtons.length; i++) {
            var deleteButton = deleteButtons[i];
            deleteButton.addEventListener("click", handleBookTableDeleteClick);
        }
    }

    function handleButtonPagePreviousClick(event) {
        event.preventDefault();

        var page = Number(inputPage.value);

        if (page > 1) {
            page = page - 1;
        } else {
            page = 1;
        }

        inputPage.value = page;

        searchBooks();
    }

    function handleButtonPageNextClick(event) {
        event.preventDefault();

        var page = Number(inputPage.value);
        inputPage.value = page + 1;
        searchBooks();
    }

    function handleSelectPageSizeChange() {
        inputPage.value = 1;
        searchBooks();
    }

    function handleButtonSortBookIdClick(event) {
        event.preventDefault();

        if (sortOrder === "BookId") {
            sortOrder = "BookIdDesc";
        } else {
            sortOrder = "BookId";
        }

        searchBooks();
    }

    function handleButtonSortTitleClick(event) {
        event.preventDefault();

        if (sortOrder === "Title") {
            sortOrder = "TitleDesc";
        } else {
            sortOrder = "Title";
        }

        searchBooks();
    }

    function handleButtonSortAuthorClick(event) {
        event.preventDefault();

        if (sortOrder === "Author") {
            sortOrder = "AuthorDesc";
        } else {
            sortOrder = "Author";
        }

        searchBooks();
    }

    function handleButtonSortHasBeenReadClick(event) {
        event.preventDefault();

        if (sortOrder === "HasBeenRead") {
            sortOrder = "HasBeenRead-Desc";
        } else {
            sortOrder = "HasBeenRead";
        }

        searchBooks();

        // alert("you clicked");
    }

    function handleButtonSortDateReadClick(event) {
        event.preventDefault();

        if (sortOrder === "DateRead") {
            sortOrder = "DateRead-Desc";
        } else {
            sortOrder = "DateRead";
        }

        searchBooks();

        // alert("you clicked");
    }

    function handleButtonSortIsOnWishlistClick(event) {
        event.preventDefault();

        if (sortOrder === "IsOnWishlist") {
            sortOrder = "IsOnWishlist-Desc";
        } else {
            sortOrder = "IsOnWishlist";
        }

        searchBooks();

        // alert("you clicked");
    }

    function handleButtonSortNotesClick(event) {
        event.preventDefault();

        if (sortOrder === "Notes") {
            sortOrder = "Notes-Desc";
        } else {
            sortOrder = "Notes";
        }

        searchBooks();

        //  alert("you clicked");
    }



    function handleButtonBookInsertClick(event) {
        event.preventDefault();

        formBookInsert.classList.remove("visually-hidden");
        formBookUpdate.classList.add("visually-hidden");
        sortOrder = "BookIdDesc";
        inputPage.value = 1;
        inputBookSearch.value = "";
        searchBooks();
    }

    function handleButtonBookInsertSaveClick(event) {
        event.preventDefault();

        var isValidBookInsertForm = validateBookInsert();

        if (isValidBookInsertForm) {
            event.preventDefault();
            insertBook();
            hideFormBookInsert();
        }
    }

    function validateBookInsert() {
        var isValid = true;

        if (!validateBookInsertTitle()) {
            isValid = false;
        }

        if (!validateBookInsertAuthor()) {
            isValid = false;
        }



        return isValid;
    }

    function validateBookInsertTitle() {
        var isValid = inputBookInsertTitle.value.trim().length >= 1;

        if (isValid) {
            inputBookInsertTitleValidationMessage.classList.add("visually-hidden");
        } else {
            inputBookInsertTitle.value = "";
            inputBookInsertTitleValidationMessage.classList.remove("visually-hidden");
        }

        return isValid;
    }

    function validateBookInsertAuthor() {
        var isValid = inputBookInsertAuthor.value.trim().length >= 1;

        if (isValid) {
            inputBookInsertAuthorNameValidationMessage.classList.add("visually-hidden");
        } else {
            inputBookInsertAuthor.value = "";
            inputBookInsertAuthorNameValidationMessage.classList.remove("visually-hidden");
        }

        return isValid;
    }




    function handleButtonBookInsertCancelClick(event) {
        event.preventDefault();

        inputBookInsertTitleValidationMessage.classList.add("visually-hidden");
        inputBookInsertAuthorNameValidationMessage.classList.add("visually-hidden");

        hideFormBookInsert();
        sortOrder = "BookId";
        searchBooks();
    }

    function hideFormBookInsert() {
        formBookInsert.classList.add("visually-hidden");
        inputBookInsertTitle.value = "";
        inputBookInsertAuthor.value = "";
    }

    function handleBookTableUpdateClick(event) {
        event.preventDefault();

        var bookId = event.target.getAttribute("data-book-id");

        var title = document.getElementById("book-" + bookId + "-title");
        var author = document.getElementById("book-" + bookId + "-author");
        var dateread = document.getElementById("book-" + bookId + "-date-read");
        var notes = document.getElementById("book-" + bookId + "-notes");
        var hasbeenread = document.getElementById("book-" + bookId + "-has-been-read");
        var isonwishlist = document.getElementById("book-" + bookId + "-is-on-wishlist");

        inputBookUpdateBookId.value = bookId;
        inputBookUpdateTitle.value = title.innerText;
        inputBookUpdateAuthor.value = author.innerText;
        inputBookUpdateDateRead.value = dateread.innerText;
        inputBookUpdateNotes.value = notes.innerText;
        inputBookUpdateHasBeenRead.checked = (hasbeenread.innerText === 'Yes' ? 'checked' : '');
        inputBookUpdateIsOnWishlist.checked = (isonwishlist.innerText === 'Yes' ? 'checked' : '');

        formBookUpdate.classList.remove("visually-hidden");
        formBookInsert.classList.add("visually-hidden");
    }

    function handleBookTableDeleteClick(event) {
        event.preventDefault();

        var bookId = event.target.getAttribute("data-book-id");

        var userConfirmedDelete = confirm("Are you sure you want to delete book " + bookId + "?");

        if (userConfirmedDelete) {
            deleteBook(bookId);
        }
    }

    function handleButtonBookUpdateSaveClick(event) {
        event.preventDefault();

        updateBook();
        hideFormBookUpdate();
    }

    function handleButtonBookUpdateCancelClick(event) {
        event.preventDefault();

        hideFormBookUpdate();
    }

    function hideFormBookUpdate() {
        formBookUpdate.classList.add("visually-hidden");
        inputBookUpdateBookId.value = "";
        inputBookUpdateTitle.value = "";
        inputBookUpdateAuthor.value = "";
        inputBookUpdateHasBeenRead.value = "";
        inputBookUpdateIsOnWishlist.value = "";
        inputBookUpdateNotes.value = "";
        inputBookUpdateDateRead.value = "";
    }




    //Execute any functions that need to run on page load
    handleNewUrl();

}

//Run our application
webapp_02();