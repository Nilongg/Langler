/**
   * The documentation tab for the app
   * @returns The documentation tab
   */
const DocTab = () => {
  const handleMainDocClick = () => {
    // Redirect to frontend/docs/global.html
    window.location.href = 'api/manual/frontend'

  }
  const handleBackendDocClick = () => {
    // Redirect to backend/docs/global.html
    window.location.href = 'api/manual/backend'
    
  }

  return (
    <div>
      <h1>How to use the UI</h1>
      <h2>For Students</h2>
      <p>Choose one of the options in the For Students tab and start learning the words</p>
      <h2>For Teachers</h2>
      <p>Use the control panel to add, delete and update word pairs {'(For Teachers Tab)'}</p>
      <h2>How to use API for other purposes</h2>
      <h3>Get all pairs</h3>
      <p>https://language-learning-app-1.onrender.com/api/languages/swedish</p>
      <p>https://language-learning-app-1.onrender.com/api/languages/english</p>
      <h3>Get by id</h3>
      <p>https://language-learning-app-1.onrender.com/api/languages/swedish/id-here</p>
      <p>https://language-learning-app-1.onrender.com/api/languages/english/id-here</p>
      <div>
        <h2>Note that documentation only displays global.html</h2>
        <p>If you wish to view the full documentation then visit the project's github page</p>
        <p>Note+ that HOME buttons do not work because only the global.html is available</p>
        
        <h2>Documentation for frontend</h2>
        <button onClick={handleMainDocClick}>here</button>
        <h2>Documentation for backend</h2>
        <button onClick={handleBackendDocClick}>here</button>
      </div>
    </div>
  )
}

export default DocTab;