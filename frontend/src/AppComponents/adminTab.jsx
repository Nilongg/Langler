import { useState, useEffect, useRef} from 'react'
import '../App.css'

/**
   * The admin tab
   * includes functions to add, delete and update word pairs
   * @param {Array} engWordPairs - The english word pairs fetched from the database
   * @param {Array} sweWordPairs - The swedish word pairs fetched from the database
   * @param {Function} setEngWordPairs - The function to set the word pairs for english
   * @param {Function} setSweWordPairs - The function to set the word pairs for swedish
   * @function deleteWordPair - Deletes a word pair from the database
   * @function addWordPair - Adds a new word pair to the database
   * @function updateWordPair - Updates a word pair in the database
   * @returns The admin tab
   */
const AdminTab = (props) => {
  const { engWordPairs = [], sweWordPairs = [], setEngWordPairs, setSweWordPairs } = props
  const [ language, setLanguage ] = useState('english')

  const [ accessGranted, setAccessGranted ] = useState(false)

  useEffect(() => {
    // Check if the user has the required permissions to access the page
    checkAccess()

  }, [])

  async function checkAccess() {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key: localStorage.getItem('savedKey') })
      })
      if(response.status === 200) {
        setAccessGranted(true)
      } else {
        setAccessGranted(false)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }


  /**
   * Deletes a word pair from the database using input field's value
   */
  const deleteWordPair = async () => {
    const id = document.querySelector('#idToDelete').value
    const url = language === 'english' ? `/api/languages/english` : `/api/languages/swedish`
    // Delete the word pair with the given id
    const response = await fetch(url + `/${id}`, {
      method: 'DELETE',
      headers: {
        'authorization': localStorage.getItem('savedKey')
      },
    })

    if (response.status === 200) {
      const response = await fetch(url);
      const data = await response.json();
      if(language === 'english') {
        setEngWordPairs(data)
      } else {
        setSweWordPairs(data)
      }
    } else {
      alert('Please provide the id of the word pair you want to delete')
    }
  }
  /**
   * Adds a new word pair to the database by using fetch api using input field's value
   */
  const addWordPair = async () => {
    const finnish = String(document.querySelector('#finWord').value).toLowerCase()
    const foreign = String(document.querySelector('#foreignWord').value).toLowerCase()
    const url = language === 'english' ? `/api/languages/english` : `/api/languages/swedish`
    const body = language === 'english' ? { finnish: finnish, english: foreign } : { finnish: finnish, swedish: foreign }
    // Add a new word pair
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem('savedKey')
      },
      body: JSON.stringify(body)
    })
    if (response.status === 201) {
      const response = await fetch(url);
      const data = await response.json();
      if(language === 'english') {
        setEngWordPairs(data)
      } else {
        setSweWordPairs(data)
      }
    } else {
      alert('Please provide the words for the word pair')
    }
  }

  /**
   * Updates a word pair in the database by using fetch api using input field's value
   * If only one of the words is given, update only that word
   */
  const updateWordPair = async () => {
    const id = document.querySelector('#oldPID').value
    const finnish = String(document.querySelector('#newFi').value).toLowerCase()
    const foreign = String(document.querySelector('#newForeign').value).toLowerCase()
    const url = language === 'english' ? `/api/languages/english/${id}` : `/api/languages/swedish/${id}`

    if (id === undefined || id === '' || id === null) {
      alert('Please provide the id of the word pair you want to update')
      return
    }

    // If only one of the words is given, update only that word
    if (finnish === '' || foreign === '') {
      if (finnish === '') {
        // Update the word pair with the given id using fetch and the PATCH method
        const body = language === 'english' ? { english: foreign } : { swedish: foreign }

        const response = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem('savedKey')
          },
          body: JSON.stringify(body)
        })
        if (response.status === 200) {
          // Fetch the updated data and set the state
          const data = await fetch(url);
          const pairs = await data.json();
          if(language === 'english') {
            setEngWordPairs(pairs)
          } else {
            setSweWordPairs(pairs)
          }
        } else {
          alert('Please provide the new words for the word pair')
        }

      } else {
        // Update the word pair with the given id using fetch and the PATCH method
        const response = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem('savedKey')

          },
          body: JSON.stringify({ finnish: finnish })
        })
        if (response.status === 200) {
          const data = await fetch(url);
          const pairs = await data.json();
          if(language === 'english') {
            setEngWordPairs(pairs)
          } else {
            setSweWordPairs(pairs)
          }
        } else {
          alert('Please provide the new words for the word pair')
        }
      }
    } else if (finnish !== '' && foreign !== '') {
      // Update the word pair with the given id using fetch and the PUT method
      const body = language === 'english' ? { finnish: finnish, english: foreign } : { finnish: finnish, swedish: foreign }

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'authorization': localStorage.getItem('savedKey')
        },
        body: JSON.stringify(body)
      })
      if (response.status === 200) {
        const data = await fetch(url);
        const pairs = await data.json();
        if(language === 'english') {
          setEngWordPairs(pairs)
        } else {
          setSweWordPairs(pairs)
        }
      }
    } else {
      alert('Please provide the new words for the word pair')
    }
  }

  async function getPermission() {
    // Check if the user has the required permissions to access the page¨

    const access = prompt('Please provide the access key')

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key: access })
      })
      if(response.status === 200) {
        setAccessGranted(true)
        localStorage.setItem('savedKey', access)
        alert('Access granted')
      } else {
        alert('Access denied')
      }

    } catch (error) {
      console.error('Error:', error)
    }
  }

  if(!accessGranted) {
    return (
      <div>
        <h1>Access denied</h1>
        <p>You do not have the required permissions to access this page</p>
        <button onClick={() => getPermission()}>Get access</button>

      </div>
    )
  }
  return (
    <div>
      <h1>Welcome to the control panel🔧</h1>
      <p>Select language to update pairs</p>
      <select id='language' onChange={(e) => setLanguage(e.target.value)}>
        <option value='english'>English</option>
        <option value='swedish'>Swedish</option>
      </select>
      <div>
        <h3>All word pairs</h3>
        <ul id='words_a'
            className={Array.isArray(language === 'swedish' ? sweWordPairs : engWordPairs) &&
              (language === 'swedish' ? sweWordPairs : engWordPairs).length > 5
              ? 'multi-row'
              : 'single-column'}
          >

          {/* Safeguard against empty arrays */ }
          {Array.isArray(language === 'swedish' ? sweWordPairs : engWordPairs)
            ? (language === 'swedish'
              ? sweWordPairs.map(pair => <li key={pair.id}>id: {pair.id} | {pair.finnish} - {pair.swedish}</li>)
              : engWordPairs.map(pair => <li key={pair.id}>id: {pair.id} | {pair.finnish} - {pair.english}</li>)
            )
            : <p>No word pairs available</p>
          }
        </ul>
      </div>
      <div>
        <h3>Add a new word pair</h3>
        <input id='finWord' type='text' placeholder='Finnish word'></input>
        <input
          id='foreignWord'
          type='text'
          placeholder={language == 'english' ? 'English word' : 'Swedish word'}>
        </input>
        <button onClick={addWordPair}>Add</button>
      </div>
      <div>
        <h3>Delete a word pair by id</h3>
        <input id='idToDelete' type='text' placeholder='id'></input>
        <button onClick={deleteWordPair}>Delete</button>
      </div>
      <div>
        <h3>Update a word pair</h3>
        <input id='oldPID' type='text' placeholder='Old pair ID'></input>
        <input id='newFi' type='text' placeholder='New Finnish word'></input>
        <input
          id='newForeign'
          type='text'
          placeholder={language == 'english' ? 'New English word' : 'New Swedish word'}>
        </input>
        <button onClick={updateWordPair}>Update</button>
      </div>
    </div>
  )
}

export default AdminTab;