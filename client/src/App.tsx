import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloProvider, InMemoryCache } from '@apollo/client';
import { ApolloClient } from '@apollo/client';
import Navbar from './components/Navbar';

const token = localStorage.getItem('id_token');  // Retrieve the token from localStorage
console.log('Authorization Token:', token);  

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
  cache: new InMemoryCache(),
  headers: {
    authorization: localStorage.getItem('id_token') 
      ? `Bearer ${localStorage.getItem('id_token')}` 
      : '', // Empty string ensures no Authorization header is sent if there's no token
  },
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;