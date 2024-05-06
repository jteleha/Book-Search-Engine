import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../graphql/queries';
import { REMOVE_BOOK } from '../graphql/mutations';

const SavedBooks = () => {
  const { data, loading, error } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK, {
    update(cache, { data: { removeBook } }) {
      cache.modify({
        fields: {
          me(existingMeData) {
            const newBooksList = existingMeData.savedBooks.filter(
              book => book.bookId !== removeBook.bookId
            );
            return { ...existingMeData, savedBooks: newBooksList };
          }
        }
      });
    }
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;

  return (
    <div>
      <h2>Your Saved Books</h2>
      {data.me.savedBooks.length ? (
        <ul>
          {data.me.savedBooks.map(book => (
            <li key={book.bookId}>
              {book.title} by {book.authors.join(', ')}
              <button onClick={() => removeBook({ variables: { bookId: book.bookId } })}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No saved books</p>
      )}
    </div>
  );
};

export default SavedBooks;