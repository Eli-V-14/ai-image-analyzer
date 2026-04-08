import { useState } from 'react'

function App() {
  const [file, setFile] = useState(null) // State to hold the uploaded file
  const [prompt, setPrompt] = useState('') // State to hold the typed prompt
  const [caption, setCaption] = useState('') // State to hold the generated caption
  const [loading, setLoading] = useState(false) // State to indicate loading status

  const handleSubmit = async () => {
    // handleSubmit : Function to handle the submission of the image and prompt to the backend
    // async : Indicates that this function will perform asynchronous operations, such as making API calls

    if (!file || !prompt) {
      // Check if either the file or prompt is missing
      alert('Please upload an image and enter a prompt.');
      return;
    }

    setLoading(true); // Set loading state to true while the request is being processed

    const formData = new FormData(); // Create a new FormData object to hold the file and prompt
    formData.append('file', file); // Append the uploaded file to the FormData object
    formData.append('prompt', prompt); // Append the typed prompt to the FormData object

    try {
      const response = await fetch('http://localhost:8000/caption', {
        method: 'POST', // Specify the HTTP method as POST
        body: formData, // Set the body of the request to the FormData object
      });

      const data = await response.json(); // Parse the JSON response from the backend
      setCaption(data.caption); // Update the caption state with the generated caption from the response
    } catch (error) {
      console.error('Error:', error); // Log any errors that occur during the fetch operation
      alert('An error occurred while generating the caption. Please try again.'); // Alert the user about the error
    } finally {
      setLoading(false); // Set loading state back to false after the request is completed
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>AI Image Captioner</h1>
      {/* Upload Image */}
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])} // Update the file state when a new file is selected
      />

      <br /><br /> {/* Line break for spacing */}

      {/* Prompt Input */}
      <input
        type="text"
        placeholder="Enter a prompt ..."
        value={prompt} // Bind the input value to the prompt state
        onChange={(e) => setPrompt(e.target.value)} // Update the prompt state when the input value changes
        style={{ width: '300px' }} // Inline styles for the input field
      />

      <br /><br />  

      {/* Submit Button */}
      <button onClick={handleSubmit}>
        Generate Caption 
      </button>

      <br /><br />

      {/* Loading State */}
      {loading && <p>Generating...</p>} {/* Display a loading message while the caption is being generated */}
      
      {/* Output */}
      {caption && (
        <div>
          <h3>Result:</h3>
          <p>{caption}</p>
        </div>
      )}
    </div>
  )
}

export default App