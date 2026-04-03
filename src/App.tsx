import { useEffect, useRef, useState } from "react"
import { 
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  IconButton,
  InputBase,
  Paper,
  TextField,
  Typography
} from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { AutoAwesomeMosaicOutlined, Send } from "@mui/icons-material"

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#F5F0E8"
    },
    primary: {
      main: "#C96D3F",
    },
  },
  typography: {
    fontFamily: " 'Georgia', serif"
  },
})

type Message = {
  role: "user" | "assistant"
  content: string
}

function App() {
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth"})
  }, [messages, loading])

  const askQuestion = async () => {
    if (!question.trim() || loading) return

    const userMessage = question.trim()
    setQuestion("")
    setMessages((prev) => [...prev, {role: "user", content: userMessage}])
    setLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userMessage})
      })

      const data = await response.json()
      setMessages((prev) => [
        ...prev,
        {role: "assistant", content: data.answer}
      ])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {role: "assistant", content: "Something went wrong. Is the backend running?"},
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if(e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      askQuestion()
    }
  }

  return (
<ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#F5F0E8",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            borderBottom: "1px solid #E0D9CE",
            px: 3,
            py: 2,
            backgroundColor: "#FAF7F2",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <AutoAwesomeMosaicOutlined sx={{ color: "#C96D3F", fontSize: 20 }} />
          <Typography
            sx={{
              fontFamily: "'Georgia', serif",
              fontSize: "15px",
              fontWeight: 600,
              color: "#2C2C2C",
              letterSpacing: "-0.01em",
            }}
          >
            Wendy's RAG
          </Typography>
          <Typography
            sx={{
              fontSize: "12px",
              color: "#9E9589",
              ml: 0.5,
            }}
          >
            Powered by Claude & LangChain
          </Typography>
        </Box>

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            py: 4,
          }}
        >
          <Container maxWidth="md">
            {messages.length === 0 && (
              <Box
                sx={{
                  textAlign: "center",
                  mt: 12,
                  opacity: 0.6,
                }}
              >
                <AutoAwesomeMosaicOutlined
                  sx={{ fontSize: 36, color: "#C96D3F", mb: 2 }}
                />
                <Typography
                  sx={{
                    fontFamily: "'Georgia', serif",
                    fontSize: "20px",
                    color: "#5C5248",
                    mb: 1,
                  }}
                >
                  Ask me anything
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "#9E9589",
                  }}
                >
                  Questions about Chinwendu are answered using document context
                </Typography>
              </Box>
            )}

            {messages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                  mb: 3,
                }}
              >
                {msg.role === "assistant" && (
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      backgroundColor: "#C96D3F",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1.5,
                      mt: 0.5,
                      flexShrink: 0,
                    }}
                  >
                    <AutoAwesomeMosaicOutlined
                      sx={{ fontSize: 14, color: "white" }}
                    />
                  </Box>
                )}

                <Box
                  sx={{
                    maxWidth: "72%",
                    backgroundColor:
                      msg.role === "user" ? "#2C2C2C" : "#FAF7F2",
                    color: msg.role === "user" ? "#F5F0E8" : "#2C2C2C",
                    borderRadius:
                      msg.role === "user"
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                    px: 2.5,
                    py: 1.5,
                    border:
                      msg.role === "assistant"
                        ? "1px solid #E0D9CE"
                        : "none",
                    boxShadow:
                      msg.role === "user"
                        ? "0 1px 4px rgba(0,0,0,0.12)"
                        : "0 1px 3px rgba(0,0,0,0.06)",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Georgia', serif",
                      fontSize: "15px",
                      lineHeight: 1.7,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {msg.content}
                  </Typography>
                </Box>
              </Box>
            ))}

            {loading && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    backgroundColor: "#C96D3F",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <AutoAwesomeMosaicOutlined sx={{ fontSize: 14, color: "white" }} />
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#FAF7F2",
                    border: "1px solid #E0D9CE",
                    borderRadius: "18px 18px 18px 4px",
                    px: 2.5,
                    py: 1.5,
                    display: "flex",
                    gap: 0.5,
                    alignItems: "center",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: "#C96D3F",
                        animation: "pulse 1.2s ease-in-out infinite",
                        animationDelay: `${i * 0.2}s`,
                        "@keyframes pulse": {
                          "0%, 100%": { opacity: 0.3, transform: "scale(0.8)" },
                          "50%": { opacity: 1, transform: "scale(1.2)" },
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            <div ref={bottomRef} />
          </Container>
        </Box>

        {/* Input */}
        <Box
          sx={{
            borderTop: "1px solid #E0D9CE",
            backgroundColor: "#FAF7F2",
            px: 3,
            py: 2.5,
          }}
        >
          <Container maxWidth="md">
            <Paper
              elevation={0}
              sx={{
                display: "flex",
                alignItems: "flex-end",
                gap: 1,
                border: "1.5px solid #E0D9CE",
                borderRadius: "16px",
                px: 2,
                py: 1,
                backgroundColor: "#FFFFFF",
                "&:focus-within": {
                  borderColor: "#C96D3F",
                },
                transition: "border-color 0.2s ease",
              }}
            >
              <InputBase
                fullWidth
                multiline
                maxRows={4}
                placeholder="Ask a question about Chinwendu..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                sx={{
                  fontFamily: "'Georgia', serif",
                  fontSize: "15px",
                  color: "#2C2C2C",
                  py: 0.5,
                  "& ::placeholder": {
                    color: "#B5AEA5",
                    opacity: 1,
                  },
                }}
              />
              <IconButton
                onClick={askQuestion}
                disabled={loading || !question.trim()}
                sx={{
                  backgroundColor:
                    question.trim() && !loading ? "#C96D3F" : "#E0D9CE",
                  color: "white",
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  flexShrink: 0,
                  transition: "background-color 0.2s ease",
                  "&:hover": {
                    backgroundColor:
                      question.trim() && !loading ? "#B35D32" : "#E0D9CE",
                  },
                  "&.Mui-disabled": {
                    color: "#A09890",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={16} sx={{ color: "#A09890" }} />
                ) : (
                  <Send sx={{ fontSize: 16 }} />
                )}
              </IconButton>
            </Paper>
            <Typography
              sx={{
                fontSize: "11px",
                color: "#B5AEA5",
                textAlign: "center",
                mt: 1,
              }}
            >
              Press Enter to send · Shift+Enter for new line
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App