import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloProvider, InMemoryCache } from '@apollo/client';
import { BrowserRouter as Router } from 'react-router-dom'; // This line can be kept
import { ApolloClient } from '@apollo/client';
import Navbar from './components/Navbar';
const client = new ApolloClient({
    uri: '/graphql',
    cache: new InMemoryCache(),
});
function App() {
    return (<ApolloProvider client={client}>
      <Router> {/* Use BrowserRouter here */}
        <Navbar />
        <Outlet />
      </Router>
    </ApolloProvider>);
}
export default App;
