const { getDB } = require("../database/datastore");


const getAllBooks = async (request, response) => {
  try {
    const db = getDB();
    const getBooksQuery = `
                         SELECT
                             *
                         FROM
                             book
                         ORDER BY
                             book_id;`;
    const booksArray = await db.all(getBooksQuery);
    response.send(booksArray);
    await console.log("Fetched Succesfully");
  } catch (error) {
    console.log("getbooks error:", error);
    response.status(500).json({ error: "Error fetching books" });
  }
};

const getBookbyId = async (request, response) => {
  try {
    const db = getDB();
    const { bookId } = request.params;
    const getSpecifiedBook = `SELECT * FROM book WHERE book_id = ${bookId};`;
    const book = await db.get(getSpecifiedBook);
    response.send(book);
    await console.log("Fetched Succesfully");
  } catch (error) {
    console.log("getbooks error:", error);
    response.status(500).json({ error: "Error fetching books" });
  }
};

const postAbook = async (request, response) => {
  try {
    const db = getDB();
    const bookDetails = request.body;
    const {
      title,
      authorId,
      rating,
      ratingCount,
      reviewCount,
      description,
      pages,
      dateOfPublication,
      editionLanguage,
      price,
      onlineStores,
    } = bookDetails;
    const insertQuery = `
    INSERT INTO
      book (title,author_id,rating,rating_count,review_count,description,pages,date_of_publication,edition_language,price,online_stores)
    VALUES
      (
        '${title}',
         ${authorId},
         ${rating},
         ${ratingCount},
         ${reviewCount},
        '${description}',
         ${pages},
        '${dateOfPublication}',
        '${editionLanguage}',
         ${price},
        '${onlineStores}'
      );`;
    const book = await db.run(insertQuery);
    const bookID = book.lastID;
    response.send({ bookId: bookID });
    await console.log("Fetched Succesfully");
  } catch (error) {
    console.log("getbooks error:", error);
    response.status(500).json({ error: "Error fetching books" });
  }
};

const updateABook = async (request, response) => {
  try {
    const db = getDB();
    const { bookId } = request.params;
    const bookDetails = request.body;
    const {
      title,
      authorId,
      rating,
      ratingCount,
      reviewCount,
      description,
      pages,
      dateOfPublication,
      editionLanguage,
      price,
      onlineStores,
    } = bookDetails;
    const updateQuery = `UPDATE
          book
        SET
          title='${title}',
          author_id=${authorId},
          rating=${rating},
          rating_count=${ratingCount},
          review_count=${reviewCount},
          description='${description}',
          pages=${pages},
          date_of_publication='${dateOfPublication}',
          edition_language='${editionLanguage}',
          price= ${price},
          online_stores='${onlineStores}'
        WHERE
          book_id = ${bookId};`;

    const updateBook = await db.run(updateQuery);
    response.send("book updated Successfully");
  } catch (error) {
    console.log("getbooks error:", error);
    response.status(500).json({ error: "updating of books error" });
  }
};

const DeleteABook = async (request, response) => {
  try {
    const db = getDB();
    const { bookId } = request.params;
    const deleteQuery = `DELETE FROM book WHERE book_id=${bookId};`;
    await db.run(deleteQuery);
    response.send(`Deleted the item ${bookId}`);
  } catch (error) {
    console.log("getbooks error:", error);
    response.status(500).json({ error: "updating of books error" });
  }
};

const bookbyAuthorId = async (request, response) => {
  try {
    const db = getDB();
    const { authorId } = request.params;
    const getQuery = `SELECT
    *
    FROM
        book
    WHERE
        author_id = ${authorId};`;
    const bookArrays = await db.all(getQuery);
    response.send(bookArrays);
  } catch (error) {
    console.log("getbooks error:", error);
    response.status(500).json({ error: "updating of books error" });
  }
};

const searchQuery = async (request, response) => {
  try {
    const db = getDB();
    const { limit, offset, order, order_by, search_q} = request.query;
    const getBooksearchQuery = `SELECT
      *
    FROM
     book
    WHERE
     title LIKE '%${search_q}%'
    ORDER BY ${order_by} ${order}
    LIMIT ${limit} OFFSET ${offset}`;
    console.log(getBookQuery);
    const bookArrayssss = await db.all(getBooksearchQuery);
    response.send(bookArrayssss);
  } catch (error) {
    console.log("getbooks error:", error);
    response.status(500).json({ error: "updating of books error" });
  }
};

// const searchQuery = async (request, response) => {
//   try {
//     const db = getDB();
//     const { limit, offset, order, order_by, search_q } = request.query;
    
//     // Use parameterized query to avoid SQL injection
//     const getBookQuery = `
//       SELECT *
//       FROM book
//       WHERE title LIKE ?
//       ORDER BY ${order_by} ${order}
//       LIMIT ? OFFSET ?`;
      
//     console.log(getBookQuery);

//     // Use placeholders for parameters and pass them in an array
//     const bookArray = await db.all(getBookQuery, [`%${search_q}%`, limit, offset]);
//     response.send(bookArray);
//   } catch (error) {
//     console.log("getbooks error:", error);
//     response.status(500).json({ error: "updating of books error" });
//   }
// };


module.exports = {
  getAllBooks,
  getBookbyId,
  postAbook,
  updateABook,
  DeleteABook,
  bookbyAuthorId,
  searchQuery
};
