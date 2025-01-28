import { BrowserRouter } from 'react-router-dom'
import { useState, useEffect} from 'react'
import './App.css'
import { Routes, Route, Link} from 'react-router-dom'

import Home from './AppComponents/learnEngTab'
import AdminTab from './AppComponents/adminTab'
import DocTab from './AppComponents/helpTab'

/**
 * The main page for the app
 * This is where the structure of the app is defined
 * @returns The main page
*/
function App() {
  // The word pairs that are fetched from the backend
  const [engWordPairs, setEngWordPairs] = useState([])
  const [sweWordPairs, setSweWordPairs] = useState([])
  const [currentPage, setCurrentPage] = useState('home'); 
   
  // State to keep track of loading state
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch English word pairs
        const response = await fetch(`/api/languages/english`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem('savedKey')
          }
          });
        const data = await response.json();
        setEngWordPairs(data);

        // Fetch Swedish word pairs
        const response2 = await fetch(`/api/languages/swedish`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem('savedKey')
          }
        });
        const data2 = await response2.json();
        setSweWordPairs(data2);

        setLoading(false); 
      } catch (error) {
        // Handle errors
        console.error("Error fetching data:", error);
        setLoading(false); 
      }
    }

    fetchData();
  }, []);

  


  if (loading) {
    // Display some kind of loading indicator while fetching the data
    return <div>Loading...</div>;
  }
  return (
    <div className='App'>
      <header className='App-header'>
        <nav id='navigation'>
          <button
            id='home'
            className={currentPage === 'home' ? 'active' : ''}
            onClick={() => setCurrentPage('home')}
          >
          For Students
          </button>
          <button
            id='admin'
            className={currentPage === 'admin' ? 'active' : ''}
            onClick={() => setCurrentPage('admin')}
          >
          For Teachers
          </button>
          <button
            id='help'
            className={currentPage === 'doc' ? 'active' : ''}
            onClick={() => setCurrentPage('doc')}
          >
          Help
          </button>
        </nav>
      </header>
      <main>
        {currentPage === 'home' && <Home engWordPairs={engWordPairs} sweWordPairs={sweWordPairs} />}
        {currentPage === 'admin' && <AdminTab engWordPairs={engWordPairs} sweWordPairs={sweWordPairs} setEngWordPairs={setEngWordPairs} setSweWordPairs={setSweWordPairs} />}
        {currentPage === 'doc' && <DocTab />}
      </main>
    </div>
  );
}
  

export default App
