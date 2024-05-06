import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../graphql/mutations';
import { getSavedBookIds, saveBookIds } from '../utils/localStorage';

const SearchBooks = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());
  const [saveBook] = useMutation(SAVE_BOOK, {
    onCompleted: (data) => {
      setSavedBookIds(prevSavedBookIds => [...prevSavedBookIds, data.saveBook.bookId]);
    }
  });

  const handleSaveBook = async (bookId) => {
    const bookToSave = searchedBooks.find(book => book.bookId === bookId);
    if (!bookToSave) return;

    try {
      await saveBook({ variables: { input: bookToSave } });
      const newSavedBookIds = [...savedBookIds, bookId];
      saveBookIds(newSavedBookIds);
      setSavedBookIds(newSavedBookIds);
    } catch (e) {
      console.error(e);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!searchInput) return;
    setSearchInput('');
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Search for books"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <ul>
        {searchedBooks.map(book => (
          <li key={book.bookId}>
            {book.title} by {book.authors.join(', ')}
            <button onClick={() => handleSaveBook(book.bookId)}>Save</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBooks;