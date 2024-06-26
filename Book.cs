using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;

namespace webapi_02
{
    public class Book
    {
        public int BookId { get; set; }
        public string? Title { get; set; }
        public string? Author { get; set; }
        public bool HasBeenRead { get; set; }
        public DateTime? DateRead { get; set; }
        public bool IsOnWishlist { get; set; }
        public string? Notes { get; set; }

        public void ShowBook()
        {
            Console.WriteLine($"Book ID: {BookId}, Title: {Title}, Author: {Author}, Has Been Read: {HasBeenRead}, Date Read: {(DateRead.HasValue ? DateRead.Value.ToString("yyyy-MM-dd") : "N/A")}, Is On Wishlist: {IsOnWishlist}, Notes: {Notes}");
        }


        //Static Methods
        public static void ShowBooks(List<Book> books)
        {
            Console.WriteLine("----------------------------------------------------------------------------------------------------");
            Console.WriteLine("BookId | Title           | Author          | Has Been Read | Date Read   | Is On Wishlist | Notes");
            Console.WriteLine("----------------------------------------------------------------------------------------------------");

            foreach (Book book in books)
            {
                book.ShowBook();  // Call ShowBook on each Book instance
            }
        }

        // }
        // public class BookSearch
        // {
        // public List<Book> Books { get; set; } = new List<Book>();
        // public int StartRow { get; set; }
        //  public int EndRow { get; set; }
        //   public int TotalRows { get; set; }

        public static BookResponse SearchBooks(SqlConnection sqlConnection, string search, int pageSize, int pageNumber, string sort)
        {
            BookResponse bookResponse = new BookResponse();

            // Set the SQL statement
            string sqlStatement = GetSearchQuery();

            // Create a SqlCommand
            using (SqlCommand sqlCommand = new SqlCommand(sqlStatement, sqlConnection))
            {
                // Set parameters
                sqlCommand.Parameters.AddWithValue("@Search", "%" + search + "%");
                sqlCommand.Parameters.AddWithValue("@PageSize", pageSize);
                sqlCommand.Parameters.AddWithValue("@PageNumber", pageNumber);
                sqlCommand.Parameters.AddWithValue("@Sort", sort);

                // Create a SqlDataReader and execute the SQL command
                using (SqlDataReader sqlDataReader = sqlCommand.ExecuteReader())
                {
                    // Check if the reader has rows
                    if (sqlDataReader.HasRows)
                    {
                        int row = 1;

                        // Read each row from the data reader
                        while (sqlDataReader.Read())
                        {
                            //Create an book object
                            Book book = new Book();

                            // Populate the book object from the database row
                            book.BookId = sqlDataReader.GetInt32(sqlDataReader.GetOrdinal("BookId"));
                            book.Title = sqlDataReader.IsDBNull(sqlDataReader.GetOrdinal("Title")) ? null : sqlDataReader.GetString(sqlDataReader.GetOrdinal("Title"));
                            book.Author = sqlDataReader.IsDBNull(sqlDataReader.GetOrdinal("Author")) ? null : sqlDataReader.GetString(sqlDataReader.GetOrdinal("Author"));
                            book.HasBeenRead = sqlDataReader.GetBoolean(sqlDataReader.GetOrdinal("HasBeenRead"));
                            book.IsOnWishlist = sqlDataReader.GetBoolean(sqlDataReader.GetOrdinal("IsOnWishlist"));
                            book.DateRead = sqlDataReader.IsDBNull(sqlDataReader.GetOrdinal("DateRead")) ? null : (DateTime?)sqlDataReader.GetDateTime(sqlDataReader.GetOrdinal("DateRead"));
                            book.Notes = sqlDataReader.IsDBNull(sqlDataReader.GetOrdinal("Notes")) ? null : sqlDataReader.GetString(sqlDataReader.GetOrdinal("Notes"));
                            if (row == 1)
                            {
                                bookResponse.StartRow = sqlDataReader.GetInt32(sqlDataReader.GetOrdinal("StartRow"));
                                bookResponse.EndRow = sqlDataReader.GetInt32(sqlDataReader.GetOrdinal("EndRow"));
                                bookResponse.TotalRows = sqlDataReader.GetInt32(sqlDataReader.GetOrdinal("TotalRows"));
                            }

                            // Add the current book to a list of books
                            bookResponse.Books.Add(book);

                            row++;
                        }
                    }
                    else
                    {
                        Console.WriteLine("No rows found.");
                    }
                }
            }

            return bookResponse;
        }


        private static string GetSearchQuery()
        {
            string searchQuery = "";

            searchQuery += "SELECT BookId, ";
            searchQuery += "Title, ";
            searchQuery += "Author, ";
            searchQuery += "HasBeenRead, ";
            searchQuery += "DateRead, ";
            searchQuery += "IsOnWishlist, ";
            searchQuery += "Notes, ";
            searchQuery += "(@PageSize * (@PageNumber - 1) + 1) AS StartRow, ";
            searchQuery += "CASE WHEN (@PageSize * @PageNumber) < TotalRows THEN (@PageSize * @PageNumber) ELSE TotalRows END AS EndRow, ";
            searchQuery += "TotalRows ";
            searchQuery += "FROM ( ";
            searchQuery += "SELECT BookId, ";
            searchQuery += "Title, ";
            searchQuery += "Author, ";
            searchQuery += "HasBeenRead, ";
            searchQuery += "DateRead, ";
            searchQuery += "IsOnWishlist, ";
            searchQuery += "Notes, ";
            searchQuery += "COUNT(*) OVER () AS TotalRows, ";
            searchQuery += "ROW_NUMBER() OVER ( ";
            searchQuery += "ORDER BY ";
            searchQuery += "CASE WHEN @Sort = 'BookId' THEN BookId END, ";
            searchQuery += "CASE WHEN @Sort = 'BookIdDesc' THEN BookId END DESC, ";
            searchQuery += "CASE WHEN @Sort = 'Title' THEN Title END, ";
            searchQuery += "CASE WHEN @Sort = 'TitleDesc' THEN Title END DESC, ";
            searchQuery += "CASE WHEN @Sort = 'Author' THEN Author END, ";
            searchQuery += "CASE WHEN @Sort = 'AuthorDesc' THEN Author END DESC, ";
            searchQuery += "CASE WHEN @Sort = 'HasBeenRead' THEN HasBeenRead END, ";
            searchQuery += "CASE WHEN @Sort = 'HasBeenReadDesc' THEN HasBeenRead END DESC, ";
            searchQuery += "CASE WHEN @Sort = 'DateRead' THEN DateRead END, ";
            searchQuery += "CASE WHEN @Sort = 'DateReadDesc' THEN DateRead END DESC, ";
            searchQuery += "CASE WHEN @Sort = 'IsOnWishlist' THEN IsOnWishlist END, ";
            searchQuery += "CASE WHEN @Sort = 'IsOnWishlistDesc' THEN IsOnWishlist END DESC, ";
            searchQuery += "CASE WHEN @Sort = 'Notes' THEN Notes END, ";
            searchQuery += "CASE WHEN @Sort = 'NotesDesc' THEN Notes END DESC ";
            searchQuery += ") AS rn ";
            searchQuery += "FROM Book ";
            searchQuery += "WHERE 1 = 1 ";
            searchQuery += "AND ( ";
            searchQuery += "BookId LIKE @Search ";
            searchQuery += "OR Title LIKE @Search ";
            searchQuery += "OR Author LIKE @Search ";
            searchQuery += ") ";
            searchQuery += ") x ";
            searchQuery += "WHERE rn BETWEEN (@PageSize * (@PageNumber - 1) + 1) AND (@PageSize * @PageNumber) ";
            searchQuery += "ORDER BY rn ";

            return searchQuery;
        }



        public static int InsertBook(SqlConnection sqlConnection, string Title, string Author)
        {
            int rowsUpdated = 0;

            // Set the SQL statement
            string sqlStatement = "insert into Book (Title, Author) values (@Title, @Author)";

            // Create a SqlCommand
            using (SqlCommand sqlCommand = new SqlCommand(sqlStatement, sqlConnection))
            {
                // Add parameters
                sqlCommand.Parameters.AddWithValue("@Title", Title);
                sqlCommand.Parameters.AddWithValue("@Author", Author);

                // Execute the SQL command (and capture number of rows updated)
                rowsUpdated = sqlCommand.ExecuteNonQuery();
            }

            return rowsUpdated;
        }

        public static int UpdateBook(SqlConnection sqlConnection, int BookId, string Title, string Author, bool hasBeenRead, bool isOnWishlist, DateTime? DateRead, string notes)
        {
            int rowsUpdated = 0;

            // Set the SQL statement
            string sqlStatement = "";
            if (DateRead == null)
            {
                sqlStatement = "UPDATE Book SET Title = @Title, Author = @Author, HasBeenRead = @HasBeenRead, IsOnWishlist = @IsOnWishlist, DateRead = null, Notes = @Notes WHERE BookId = @BookId";
            }
            else
            {
                sqlStatement = "UPDATE Book SET Title = @Title, Author = @Author, HasBeenRead = @HasBeenRead, IsOnWishlist = @IsOnWishlist, DateRead = @DateRead, Notes = @Notes WHERE BookId = @BookId";
            }

            // Create a SqlCommand
            using (SqlCommand sqlCommand = new SqlCommand(sqlStatement, sqlConnection))
            {
                // Add parameters
                sqlCommand.Parameters.AddWithValue("@BookId", BookId);
                sqlCommand.Parameters.AddWithValue("@Title", Title);
                sqlCommand.Parameters.AddWithValue("@Author", Author);
                sqlCommand.Parameters.AddWithValue("@HasBeenRead", hasBeenRead);
                sqlCommand.Parameters.AddWithValue("@IsOnWishlist", isOnWishlist);
                if (DateRead != null)
                {
                    sqlCommand.Parameters.AddWithValue("@DateRead", DateRead);
                }
                sqlCommand.Parameters.AddWithValue("@Notes", notes);

                // Execute the SQL command (and capture number of rows updated)
                rowsUpdated = sqlCommand.ExecuteNonQuery();
            }

            return rowsUpdated;
        }





        public static int DeleteBook(SqlConnection sqlConnection, int BookId)
        {
            int rowsDeleted = 0;

            // Set the SQL statement
            string sqlStatement = "delete from Book where BookId = @BookId";

            using (SqlCommand sqlCommand = new SqlCommand(sqlStatement, sqlConnection))
            {
                // Add parameters
                sqlCommand.Parameters.AddWithValue("@BookId", BookId);

                // Execute the SQL command (and capture number of rows deleted)
                rowsDeleted = sqlCommand.ExecuteNonQuery();
            }

            return rowsDeleted;
        }

    }
}