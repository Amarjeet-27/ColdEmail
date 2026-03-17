🚀 Agentic AI Email Automation Platform

An AI-powered web application that automates cold email generation and delivery using LLMs. The system enables users to upload recipient data, generate personalized emails based on resume context, and send them at scale with minimal manual effort.

🧠 Overview

This platform leverages Google Gemini API to generate context-aware, personalized cold emails. It follows an agent-like workflow where the system processes input data, generates responses, refines them, and executes email delivery.

✨ Features

📄 Upload Excel files containing recipient email addresses and company details

🧠 Generate personalized cold emails using LLM (Gemini API)

🎯 Dynamic tone selection (formal, friendly, etc.)

🏢 Enhanced personalization using company-specific context

🔁 Multi-step response refinement using iterative API calls

🤖 Agent-like workflow: generate → refine → send

📬 Automated email delivery to recipients

⚡ Backend-driven API orchestration for scalability

🏗️ Tech Stack
Frontend

React.js

Axios

Backend

Node.js

Express.js

Axios

AI Integration

Google Gemini API (gemini-2.5-flash)

⚙️ System Architecture

User uploads Excel file with recipient details

User provides resume summary and preferences (tone, etc.)

Backend processes input data

Gemini API generates initial email draft

Second API call refines the generated content

Final email is sent to recipients

📡 API Endpoint
POST /api/generate

Generates email content using Gemini API

Request Body
{
"messages": [
{
"content": "Your resume summary or prompt"
}
]
}
Response
{
"content": [
{
"text": "Generated email content"
}
]
}
