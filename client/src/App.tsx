import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloProvider, InMemoryCache } from '@apollo/client';
import { ApolloClient } from '@apollo/client';
import Navbar from './components/Navbar';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter> 
        <Navbar />
        <Outlet />
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
