// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;


contract Library {
    struct Book {
        uint id;
        string title;
        string author;
        address current_holder;
        bool is_avalible;
    }

    Book[] public books;
    
    event new_book(uint id, string title, string author);
    event book_borrowed(uint id, address borrower);
    event book_returned(uint id);

    function add_book(string memory _title, string memory _author) public {
        uint id = books.length;
        books.push(Book(id, _title, _author, address(0), true));
        emit new_book(id, _title, _author);
    }

    function borrow_book(uint _id) public {
        require(_id < books.length, "Book doesn't exist");
        require(books[_id].is_avalible, "Book is currently unavalible");

        books[_id].current_holder = msg.sender;
        books[_id].is_avalible = false;
        emit book_borrowed(_id, msg.sender);
    }

    function return_book(uint _id) public {
        require(_id < books.length, "Book doesn't exist");
        require(books[_id].current_holder == msg.sender, "You are not current holder of this book");

        books[_id].current_holder = address(0);
        books[_id].is_avalible = true;
        emit book_returned(_id);
        
    }

    function read_all_books() external view returns (Book[] memory){
        return books;
    }

}
