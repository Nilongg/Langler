import { useState, useEffect, useRef } from 'react'
import '../App.css'


/**
 * The main page for the app
 * This is where the learning process happens
 * @param {*} props
 * @function randomizeWord Randomizes the word pairs and returns the word in the selected language
 * @function startLearning Starts the learning process
 * @function showScore Shows the score page
 * @function checkAnswer Checks if the answer is correct (inside startLearning)
 * @returns The home page
 */
const Home = (props) => {
  const inputRef = useRef();
  const [questionsLeft, setQuestionsLeft] = useState()
  const [score, setScore] = useState(0)
  const [selectedOption, setOption] = useState(null)
  const [selectedLanguage, setLanguage] = useState('English')

  const { engWordPairs = [], sweWordPairs = [] } = props

  /**
   * Listens to the wordPairs and updates the questionsLeft
   */
  useEffect(() => {
    if(selectedLanguage === 'English') {
      setQuestionsLeft(engWordPairs.length)
    } else {
      setQuestionsLeft(sweWordPairs.length)
    }

  }, [engWordPairs ,sweWordPairs, selectedLanguage])

  /**
   * Randomizes the word pairs and returns the word in the selected language
   * @returns {string} The word in the selected language
   */
  function randomizeWord(randomizedWordLanguage = null) {
    const wordPairs = selectedLanguage === 'English' ? engWordPairs : sweWordPairs

    const randomIndex = Math.floor(Math.random() * wordPairs.length)
    const word = wordPairs[randomIndex]

    if(selectedLanguage === 'English') {

      if (selectedOption === 'EngFin') {
        return word.english
      }
      if (selectedOption === 'FinEng') {
        return word.finnish
      } else {
        switch (randomizedWordLanguage) {
          case 'Finnish':
            return word.finnish
          case 'English':
            return word.english
          default:
            return "Error"
        }
      }
    } else {
      if (selectedOption === 'SweFin') {
        return word.swedish
      }
      if (selectedOption === 'FinSwe') {
        return word.finnish
      } else {
        switch (randomizedWordLanguage) {
          case 'Finnish':
            return word.finnish
          case 'Swedish':
            return word.swedish
          default:
            return "Error"
        }
      }
    }
  }

  /**
   * Starts the learning process
   * @returns The ui for the learning page
  */
  function startLearning() {
    function getQuestionHeading() {
      let word = randomizeWord();

      if (selectedLanguage === 'Swedish') {
        switch (selectedOption) {
          case 'SweFin':
            return { question: 'What is the Finnish word for:', word: word };
          case 'FinSwe':
            return { question: 'What is the Swedish word for:', word: word };
          case 'NoPref':
            { const language = Math.random() < 0.5 ? 'Finnish' : 'Swedish';
            word = randomizeWord(language);
            const questionText = language === 'Finnish' ? 'What is the Swedish word for:' : 'What is the Finnish word for:';
            return { question: questionText, word: word }; }
          default:
            return 'Oops.. Something went wrong';
        }
      } else if (selectedLanguage === 'English') {
        switch (selectedOption) {
          case 'EngFin':
            return { question: 'What is the Finnish word for:', word: word };
          case 'FinEng':
            return { question: 'What is the English word for:', word: word };
          case 'NoPref':
            { const language = Math.random() < 0.5 ? 'Finnish' : 'English';
            word = randomizeWord(language);
            const questionText = language === 'Finnish' ? 'What is the English word for:' : 'What is the Finnish word for:';
            return { question: questionText, word: word }; }
          default:
            return 'Oops.. Something went wrong';
        }
      }
      return ''; // Should never reach this
    }
    const checkAnswer = () => {
      const inputValue = String(inputRef.current.value).toLowerCase()
      const word = document.getElementById('question').textContent

      if(selectedLanguage === 'English') {
        const correctAnswer = engWordPairs.find(pair => {
          if (selectedOption === 'EngFin') {
            return pair.english === word
          }
          if (selectedOption === 'FinEng') {
            return pair.finnish === word
          }
          return pair.english === word || pair.finnish === word
        })
        if(!correctAnswer) {
          return false;
        }
        if (selectedOption === 'EngFin') {
          return correctAnswer.finnish === inputValue
        }
        if (selectedOption === 'FinEng') {
          return correctAnswer.english === inputValue
        }
        return correctAnswer.english === inputValue || correctAnswer.finnish === inputValue
      } else {
        const correctAnswer = sweWordPairs.find(pair => {
          if (selectedOption === 'SweFin') {
            return pair.swedish === word
          }
          if (selectedOption === 'FinSwe') {
            return pair.finnish === word
          }
          return pair.swedish === word || pair.finnish === word
        })
        if(!correctAnswer) {
          return false;
        }
        if (selectedOption === 'SweFin') {
          return correctAnswer.finnish === inputValue
        }
        if (selectedOption === 'FinSwe') {
          return correctAnswer.swedish === inputValue
        }
        return correctAnswer.swedish === inputValue || correctAnswer.finnish === inputValue
      }
    }

    if (questionsLeft === 0) {
      return showScore()
    }
    const wordPairs = selectedLanguage === 'English' ? engWordPairs : sweWordPairs
    const question = getQuestionHeading();


    return <div className='question-container'>
      <h1>Solve the following question</h1>
      <ul>
        <li>
          <h2>{question.question}</h2>
          <h2 id='question'>{question.word}</h2>
          <input ref={inputRef} type='text' placeholder='Type your answer here'></input>
          <button onClick={() => {
            checkAnswer() ? setScore(score + 1) : setScore(score);
            setQuestionsLeft(questionsLeft - 1);
            startLearning();
            inputRef.current.value = ''
          }}>Next</button>
        </li>
      </ul>
      <h2>Question</h2>
      <p>{questionsLeft}/{wordPairs.length}</p>
    </div>
  }
  /**
   * Shows the score page
   * @returns The score page
   */
  function showScore() {
    // Using the question-container class to style the score page as well
    // Even though it's not a question

    const wordPairs = selectedLanguage === 'English' ? engWordPairs : sweWordPairs
    return <div className='question-container'>
      <h1>Game over!</h1>
      <h2>Your score was: {score}/{wordPairs.length}</h2>
      <button onClick={() => {
        setOption(null)
        setScore(0)
        setQuestionsLeft(wordPairs.length)
      }}>Exit</button>
    </div>
  }

  if (selectedOption === null) {
    return ( <div>
      <h2>Choose the language you want to learn</h2>
      <select id='language' value={selectedLanguage} onChange={(e) => setLanguage(e.target.value)}>
        <option value='English'>English</option>
        <option value='Swedish'>Swedish</option>
      </select>

      {selectedLanguage == 'Swedish' ? <div>
        <h1>Choose one of the following options:</h1>
        <ul id='option-list'>
          <li>
            <h2>Learn Finnish To Swedish</h2>
            <button onClick={() => setOption('FinSwe')}>Start</button>
          </li>
          <li>
            <h2>Learn Swedish To Finnish</h2>
            <button onClick={() => setOption('SweFin')}>Start</button>
          </li>
          <li>
            <h2>Learn both ways</h2>
            <button onClick={() => setOption('NoPref')}>Start</button>
          </li>
        </ul>
      </div>
      :
      <div>
        <h1>Choose one of the following options:</h1>
        <ul id='option-list'>
          <li>
            <h2>Learn Finnish To English</h2>
            <button onClick={() => setOption('FinEng')}>Start</button>
          </li>
          <li>
            <h2>Learn English To Finnish</h2>
            <button onClick={() => setOption('EngFin')}>Start</button>
          </li>
          <li>
            <h2>Learn both ways</h2>
            <button onClick={() => setOption('NoPref')}>Start</button>
          </li>
        </ul>
      </div>
      }
    </div>
    )
  } else {
    return startLearning()
  }
}

export default Home
