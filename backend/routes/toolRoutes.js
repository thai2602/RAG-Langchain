import express from 'express';
import axios from 'axios';
import { blogTools, executeBlogTool } from '../tools/blogTools.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Helper function to call Groq API with tools
async function callGroqAPIWithTools(userMessage) {
  try {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    
    if (!GROQ_API_KEY) {
      console.error('GROQ_API_KEY not found in environment');
      throw new Error('GROQ_API_KEY not configured in environment');
    }

    const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

    const response = await axios.post(
      GROQ_URL,
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ],
        tools: blogTools,
        tool_choice: 'auto',
        temperature: 0.7,
        max_tokens: 2048
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    return response.data;
  } catch (error) {
    console.error('Groq API Error:', error.response?.data || error.message);
    throw new Error('AI API Error: ' + (error.response?.data?.error?.message || error.message));
  }
}

// Endpoint to create blog with AI assistance
router.post('/create-blog-with-ai', async (req, res) => {
  try {
    const { userRequest } = req.body;

    if (!userRequest) {
      return res.status(400).json({ success: false, error: 'User request is required' });
    }

    // Call Groq API with tools
    const aiResponse = await callGroqAPIWithTools(userRequest);

    // Check if AI wants to use a tool
    const toolCalls = aiResponse.choices[0].message.tool_calls;

    if (!toolCalls || toolCalls.length === 0) {
      // No tool calls, just return AI response
      return res.json({
        success: true,
        message: aiResponse.choices[0].message.content,
        toolUsed: false
      });
    }

    // Execute tool calls
    const toolResults = [];
    for (const toolCall of toolCalls) {
      const toolName = toolCall.function.name;
      const toolInput = JSON.parse(toolCall.function.arguments);

      console.log(`Executing tool: ${toolName}`, toolInput);

      const result = await executeBlogTool(toolName, toolInput);
      toolResults.push({
        toolName,
        result
      });
    }

    // Return results
    return res.json({
      success: true,
      message: aiResponse.choices[0].message.content,
      toolUsed: true,
      toolResults: toolResults
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint to get available tools
router.get('/available-tools', (req, res) => {
  res.json({
    success: true,
    tools: blogTools.map(tool => ({
      name: tool.function.name,
      description: tool.function.description
    }))
  });
});

export default router;
