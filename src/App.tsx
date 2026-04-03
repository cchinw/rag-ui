import { useState } from "react"

function App() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)

  const askQuestion = async () => {
    if (!question.trim()) return

    setLoading(true)
    setAnswer("")

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question})
      })

      const data = await response.json()
      setAnswer(data.answer)
    } catch (error) {
      setAnswer("Something went wrong. Is the backend running?")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: "600px", margin: "60px auto", padding: "0 20px"}}>
      <h1>Ask Wendy's RAG</h1>

      <textarea
      rows={3}
      style={{width: "100%", padding: "10px", fontSize: "16px"}}
      placeholder="Ask a question about Chinwendu..."
      value={question}
      onChange={(e) => setQuestion(e.target.value)}
      />

      <button
      onClick={askQuestion}
      disabled={loading}
      style={{marginTop: "10px", padding: "10px 20px", fontSize: "16px"}}
      >
        {loading ? "Thinking..." : "Ask"}
      </button>

      {answer && (
        <div
        style={{marginTop: "30px"}}
        >
          <h3>Answer:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  )
}

export default App