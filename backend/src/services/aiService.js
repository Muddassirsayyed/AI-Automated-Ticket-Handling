/**
 * AI Service - Uses OpenAI if API key is set, otherwise uses mock AI
 * Handles: classification, priority detection, sentiment analysis, response suggestions
 */

// Department mapping based on category
const DEPARTMENT_MAP = {
  'Technical Issue': 'Technical Support',
  'Billing': 'Finance & Billing',
  'Account Access': 'Account Management',
  'Feature Request': 'Product Team',
  'General Query': 'General Support'
};

// Mock AI analysis using keyword matching
const mockAnalyzeTicket = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();

  // Category detection
  let category = 'General Query';
  let confidence = 70;

  if (/bug|error|crash|broken|not working|issue|problem|fail|500|404/.test(text)) {
    category = 'Technical Issue'; confidence = 88;
  } else if (/bill|payment|invoice|charge|refund|subscription|price|cost/.test(text)) {
    category = 'Billing'; confidence = 92;
  } else if (/login|password|access|locked|account|sign in|forgot|reset/.test(text)) {
    category = 'Account Access'; confidence = 90;
  } else if (/feature|request|suggest|improve|add|new|enhancement|wish/.test(text)) {
    category = 'Feature Request'; confidence = 85;
  }

  // Priority detection
  let priority = 'Medium';
  if (/urgent|critical|asap|immediately|emergency|down|outage|production/.test(text)) {
    priority = 'Critical';
  } else if (/high|important|serious|major|severe/.test(text)) {
    priority = 'High';
  } else if (/low|minor|small|whenever|not urgent/.test(text)) {
    priority = 'Low';
  }

  // Sentiment analysis
  let sentiment = 'Neutral';
  if (/angry|furious|terrible|awful|worst|hate|disgusting|unacceptable/.test(text)) {
    sentiment = 'Frustrated';
  } else if (/frustrated|disappointed|unhappy|bad|poor|slow/.test(text)) {
    sentiment = 'Negative';
  } else if (/thank|great|good|happy|appreciate|love|excellent/.test(text)) {
    sentiment = 'Positive';
  }

  // AI suggested response
  const suggestions = {
    'Technical Issue': `Thank you for reporting this technical issue. I've reviewed your ticket and our technical team will investigate this immediately. Could you please provide any error messages or screenshots? We aim to resolve technical issues within 24 hours.`,
    'Billing': `Thank you for contacting our billing support. I understand your concern regarding the billing matter. Our finance team will review your account and provide a detailed response within 1-2 business days. If this is urgent, please reference your ticket number.`,
    'Account Access': `I understand you're having trouble accessing your account. For security purposes, I'll need to verify your identity. Please check your email for a verification link. If you don't receive it within 5 minutes, check your spam folder.`,
    'Feature Request': `Thank you for your valuable feature suggestion! We appreciate users who help us improve our product. I've forwarded your request to our product team for review. We'll keep you updated on its status.`,
    'General Query': `Thank you for reaching out to our support team. I've received your query and will provide a comprehensive response shortly. Our team is here to help and typically responds within a few hours.`
  };

  return {
    category,
    priority,
    sentiment,
    department: DEPARTMENT_MAP[category],
    aiSuggestion: suggestions[category],
    aiConfidence: confidence
  };
};

// OpenAI-powered analysis
const openAIAnalyzeTicket = async (title, description) => {
  try {
    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `Analyze this support ticket and respond with ONLY valid JSON:
Title: "${title}"
Description: "${description}"

Return JSON with these exact fields:
{
  "category": one of ["Technical Issue","Billing","Account Access","Feature Request","General Query"],
  "priority": one of ["Low","Medium","High","Critical"],
  "sentiment": one of ["Positive","Neutral","Negative","Frustrated"],
  "aiSuggestion": "a professional 2-3 sentence response to the user",
  "aiConfidence": number between 70-99
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 400
    });

    const result = JSON.parse(response.choices[0].message.content);
    result.department = DEPARTMENT_MAP[result.category] || 'General Support';
    return result;
  } catch (err) {
    console.log('OpenAI failed, using mock AI:', err.message);
    return mockAnalyzeTicket(title, description);
  }
};

// Main export - uses OpenAI if key exists, else mock
const analyzeTicket = async (title, description) => {
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    return await openAIAnalyzeTicket(title, description);
  }
  return mockAnalyzeTicket(title, description);
};

// Generate chatbot response
const generateChatbotResponse = (userMessage) => {
  const msg = userMessage.toLowerCase();
  if (/hello|hi|hey/.test(msg)) return "Hello! I'm your AI support assistant. How can I help you today?";
  if (/status|update/.test(msg)) return "You can check your ticket status in 'My Tickets'. I'll notify you of any updates via email.";
  if (/billing|payment/.test(msg)) return "For billing issues, I recommend creating a ticket with category 'Billing'. Our finance team responds within 1-2 business days.";
  if (/password|login|access/.test(msg)) return "For account access issues, try the 'Forgot Password' option. If that doesn't work, create an 'Account Access' ticket.";
  if (/thank/.test(msg)) return "You're welcome! Is there anything else I can help you with?";
  return "I understand your concern. For the best assistance, please create a support ticket and our team will respond promptly. Can I help you with anything else?";
};

module.exports = { analyzeTicket, generateChatbotResponse };
