using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using System;

namespace webapi_02.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BookController : ControllerBase
    {
        // Logger
        private readonly ILogger<BookController> _logger;

        public BookController(ILogger<BookController> logger)
        {
            _logger = logger;
        }

        // Connection string
        private static string serverName = @"MSI\SQLEXPRESS"; // Change to the "Server Name" you see when you launch SQL Server Management Studio.
        private static string databaseName = "db2024_01"; // Change to the database where you created your Employee table.
        private static string connectionString = $"data source={serverName}; database={databaseName}; Integrated Security=true;Encrypt=true;TrustServerCertificate=true;";

        [HttpGet]
        [Route("/Books")]
        public Response SearchBooks(string search = "", int pageSize = 10, int pageNumber = 1, string sort = "BookId")
        {
            Response response = new Response();

            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(connectionString))
                {
                    sqlConnection.Open();

                    // Select books
                    response.BookResponse = Book.SearchBooks(sqlConnection, search, pageSize, pageNumber, sort);
                    response.Message = $"{response.BookResponse?.Books?.Count} books selected.";

                    response.Result = Result.success;
                }
            }
            catch (Exception ex)
            {
                response.Message = $"An error occurred in SearchBooks: {ex.Message}";
                response.Result = Result.error;
            }

            return response;
        }

        [HttpGet]
        [Route("/InsertBook")]
        public Response InsertBook(string Title, string Author, string search = "", int pageSize = 10, int pageNumber = 1, string sort = "BookId")
        {
            Response response = new Response();

            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(connectionString))
                {
                    sqlConnection.Open();

                    // Insert book
                    int rowsInserted = Book.InsertBook(sqlConnection, Title, Author);
                    response.Message = $"{rowsInserted} books inserted.";

                    // Select books after insert
                    response.BookResponse = Book.SearchBooks(sqlConnection, search, pageSize, pageNumber, sort);
                    response.Message += $" {response.BookResponse?.Books?.Count} books selected.";

                    response.Result = Result.success;
                }
            }
            catch (Exception ex)
            {
                response.Message = $"An error occurred in InsertBook: {ex.Message}";
                response.Result = Result.error;
            }

            return response;
        }

        [HttpGet]
        [Route("/UpdateBook")]
        public Response UpdateBook(int BookId, string Title, string Author, bool hasBeenRead, bool isOnWishlist, DateTime? DateRead = null, string notes = "", string search = "", int pageSize = 10, int pageNumber = 1, string sort = "BookId")
        {
            Response response = new Response();

            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(connectionString))
                {
                    sqlConnection.Open();

                    // Update book
                    int rowsUpdated = Book.UpdateBook(sqlConnection, BookId, Title, Author, hasBeenRead, isOnWishlist, DateRead, notes);
                    response.Message = $"{rowsUpdated} books updated.";

                    // Select books after update
                    response.BookResponse = Book.SearchBooks(sqlConnection, search, pageSize, pageNumber, sort);
                    response.Message += $" {response.BookResponse?.Books?.Count} books selected.";

                    response.Result = Result.success;
                }
            }
            catch (Exception ex)
            {
                response.Message = $"An error occurred in UpdateBook: {ex.Message}";
                response.Result = Result.error;
            }

            return response;
        }

        [HttpGet]
        [Route("/DeleteBook")]
        public Response DeleteBook(int BookId, string search = "", int pageSize = 10, int pageNumber = 1, string sort = "BookId")
        {
            Response response = new Response();

            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(connectionString))
                {
                    sqlConnection.Open();

                    // Delete book
                    int rowsDeleted = Book.DeleteBook(sqlConnection, BookId);
                    response.Message = $"{rowsDeleted} books deleted.";

                    // Select books after delete
                    response.BookResponse = Book.SearchBooks(sqlConnection, search, pageSize, pageNumber, sort);
                    response.Message += $" {response.BookResponse?.Books?.Count} books selected.";

                    response.Result = Result.success;
                }
            }
            catch (Exception ex)
            {
                response.Message = $"An error occurred in DeleteBook: {ex.Message}";
                response.Result = Result.error;
            }

            return response;
        }
    }

    // public class Response
    // {
    //     public BookResponse? BookResponse { get; set; }
    //     public string? Message { get; set; }
    //     public Result Result { get; set; }
    // }

    // public class BookResponse
    // {
    //     public List<Book>? Books { get; set; }
    // }

    // public class Book
    // {
    //     public int BookId { get; set; }
    //     public string? Title { get; set; }
    //     public string? Author { get; set; }

    //     public static BookResponse SearchBooks(SqlConnection sqlConnection, string search, int pageSize, int pageNumber, string sort)
    //     {
    //         var bookResponse = new BookResponse();
    //         bookResponse.Books = new List<Book>();

    //        // string query = "SELECT * FROM Books WHERE Title LIKE @search OR Author LIKE @search ORDER BY @sort OFFSET @pageSize * (@pageNumber - 1) ROWS FETCH NEXT @pageSize ROWS ONLY";
    //        string query = GetSearchQuery();
    //         using (SqlCommand sqlCommand = new SqlCommand(query, sqlConnection))
    //         {
    //             sqlCommand.Parameters.AddWithValue("@search", "%" + search + "%");
    //             sqlCommand.Parameters.AddWithValue("@pageSize", pageSize);
    //             sqlCommand.Parameters.AddWithValue("@pageNumber", pageNumber);
    //             sqlCommand.Parameters.AddWithValue("@sort", sort);

    //             using (SqlDataReader reader = sqlCommand.ExecuteReader())
    //             {
    //                 while (reader.Read())
    //                 {
    //                     var book = new Book
    //                     {
    //                         BookId = reader.GetInt32(reader.GetOrdinal("BookId")),
    //                         Title = reader.GetString(reader.GetOrdinal("Title")),
    //                         Author = reader.GetString(reader.GetOrdinal("Author"))
    //                     };
    //                     bookResponse.Books.Add(book);
    //                 }
    //             }
    //         }

    //         return bookResponse;
    //     }

    //     public static int InsertBook(SqlConnection sqlConnection, string title, string author)
    //     {
    //         string query = "INSERT INTO Books (Title, Author) VALUES (@Title, @Author)";
    //         using (SqlCommand sqlCommand = new SqlCommand(query, sqlConnection))
    //         {
    //             sqlCommand.Parameters.AddWithValue("@Title", title);
    //             sqlCommand.Parameters.AddWithValue("@Author", author);

    //             return sqlCommand.ExecuteNonQuery();
    //         }
    //     }

    //     public static int UpdateBook(SqlConnection sqlConnection, int bookId, string title, string author)
    //     {
    //         string query = "UPDATE Books SET Title = @Title, Author = @Author WHERE BookId = @BookId";
    //         using (SqlCommand sqlCommand = new SqlCommand(query, sqlConnection))
    //         {
    //             sqlCommand.Parameters.AddWithValue("@BookId", bookId);
    //             sqlCommand.Parameters.AddWithValue("@Title", title);
    //             sqlCommand.Parameters.AddWithValue("@Author", author);

    //             return sqlCommand.ExecuteNonQuery();
    //         }
    //     }

    //     public static int DeleteBook(SqlConnection sqlConnection, int bookId)
    //     {
    //         string query = "DELETE FROM Books WHERE BookId = @BookId";
    //         using (SqlCommand sqlCommand = new SqlCommand(query, sqlConnection))
    //         {
    //             sqlCommand.Parameters.AddWithValue("@BookId", bookId);

    //             return sqlCommand.ExecuteNonQuery();
    //         }
    //     }
    // }

    // public enum Result
    // {
    //     success,
    //     error
    // }
}