// geminiApi.ts
// Frontend API service for communicating with Gemini backend
// Handles both regular and streaming responses

const API_BASE_URL = 'http://localhost:3001/api'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatRequest {
  message: string
  conversationHistory?: ChatMessage[]
}

export interface ChatResponse {
  response: string
  success: boolean
  error?: string
}

// Test backend connection
export async function testBackendConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.ok
  } catch (error) {
    console.error('Backend connection test failed:', error)
    return false
  }
}

// Regular chat request (non-streaming)
export async function askGemini(message: string, conversationHistory?: ChatMessage[]): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversationHistory,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: ChatResponse = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Failed to get response from Gemini')
    }

    return data.response
  } catch (error) {
    console.error('Error calling Gemini API:', error)
    throw error
  }
}

// Streaming chat request
export async function* askGeminiStream(message: string, conversationHistory?: ChatMessage[]): AsyncGenerator<string, void, unknown> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversationHistory,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('No response body reader available')
    }

    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')

        // Keep the last incomplete line in buffer
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.trim() === '') continue

          try {
            // Handle Server-Sent Events format
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                return
              }

              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  yield parsed.content
                }
              } catch (parseError) {
                // If it's not JSON, treat as plain text
                if (data.trim()) {
                  yield data
                }
              }
            }
          } catch (error) {
            console.error('Error processing streaming chunk:', error)
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  } catch (error) {
    console.error('Error in streaming request:', error)
    throw error
  }
}

// Get conversation history from backend
export async function getConversationHistory(): Promise<ChatMessage[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/conversation/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.history || []
  } catch (error) {
    console.error('Error fetching conversation history:', error)
    return []
  }
}

// Clear conversation history
export async function clearConversationHistory(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/conversation/clear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return response.ok
  } catch (error) {
    console.error('Error clearing conversation history:', error)
    return false
  }
}
