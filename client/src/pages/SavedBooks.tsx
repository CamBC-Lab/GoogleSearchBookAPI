import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import { removeBookId } from '../utils/localStorage';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { Book } from '../models/Book';


const SavedBooks = () => {
  // Fetch user data
  const { data, loading, error } = useQuery(GET_ME, {
    onError: (error) => {
      console.error('GET_ME Query Error', error);
      //console.log('Error extensions:', error.extensions);
      console.log('Error message:', error.message);

    },
    fetchPolicy: 'network-only',// Always fetch from network
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('id_token')}`,
      },
    }
  });


  const [removeBook] = useMutation(REMOVE_BOOK); // Mutation to remove a book

  console.log('Query Data:', data);
  console.log('Loading:', loading);
  console.log('Error:', error);

  if (loading) return <div>Loading...</div>;

  if (error) {
    console.error('Full Error Object:', error);
    return (
      <div>
        Authentication Error: {error.message}
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }
  

  const userData = data?.me; // User data or empty object

  if (!userData) {
    return <div>No User Data Found. Are you logged in?</div>;
  }

  const handleDeleteBook = async (bookId: string) => {
    try {
      // if (!data || !data.me)   return; }
      await removeBook({
        variables: { bookId },
        update: cache => {
          // const data = cache.readQuery({ query: GET_ME }); // Read current cache
          // const userDataCache = userData?.me ;
          const updatedBooks = userData.savedBooks.filter(
            (book: any) => book.bookId !== bookId // Filter out deleted book
          );
          cache.writeQuery({
            query: GET_ME,
            data: { me: { ...userData, savedBooks: updatedBooks } }, // Write updated cache
          });
        },
      });
      removeBookId(bookId); // Remove book ID from local state (not shown)
    } catch (err) {
      console.error(err); // Log any errors
    }
  };
  return (
    <Container>
      <h2>
        {userData.savedBooks.length
          ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
          : 'You have no saved books!'}
      </h2>
      <Row>
        {userData.savedBooks.map((book: Book) => (
          <Col md="4" key={book.bookId}>
            <Card border="dark">
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <Button className="btn-block btn-danger" onClick={() => handleDeleteBook(book.bookId)}>
                  Delete this Book!
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SavedBooks;
