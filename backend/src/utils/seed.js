/**
 * Seed script - creates demo users and sample tickets
 * Run: node src/utils/seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Message = require('../models/Message');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Promise.all([User.deleteMany(), Ticket.deleteMany(), Message.deleteMany()]);
  console.log('Cleared existing data');

  // Create users
  const [admin, agent, user] = await User.create([
    { name: 'Admin User', email: 'admin@demo.com', password: 'password123', role: 'admin' },
    { name: 'Support Agent', email: 'agent@demo.com', password: 'password123', role: 'agent', department: 'Technical Support' },
    { name: 'John Doe', email: 'user@demo.com', password: 'password123', role: 'user' },
  ]);
  console.log('Created users');

  // Create sample tickets
  const ticketData = [
    { title: 'Cannot login to my account', description: 'I have been trying to login for the past hour but keep getting an error message saying invalid credentials. I have tried resetting my password but still cannot access my account.', category: 'Account Access', priority: 'High', status: 'Open', sentiment: 'Frustrated' },
    { title: 'Incorrect charge on my invoice', description: 'I was charged $99 instead of $49 for my monthly subscription. Please review my account and issue a refund for the difference.', category: 'Billing', priority: 'High', status: 'In Progress', sentiment: 'Negative' },
    { title: 'App crashes on startup', description: 'The mobile app crashes immediately after the splash screen on iOS 17. This started happening after the latest update.', category: 'Technical Issue', priority: 'Critical', status: 'Open', sentiment: 'Frustrated' },
    { title: 'Feature request: Dark mode', description: 'It would be great to have a dark mode option in the dashboard. Many users prefer dark themes for extended use.', category: 'Feature Request', priority: 'Low', status: 'Pending', sentiment: 'Positive' },
    { title: 'How do I export my data?', description: 'I need to export all my ticket history to CSV format for our quarterly report. Is this feature available?', category: 'General Query', priority: 'Medium', status: 'Resolved', sentiment: 'Neutral' },
    { title: 'API rate limit exceeded', description: 'Our integration is hitting the API rate limit during peak hours. We need to discuss increasing our limit or upgrading our plan.', category: 'Technical Issue', priority: 'High', status: 'In Progress', sentiment: 'Negative' },
  ];

  const tickets = await Ticket.create(
    ticketData.map(t => ({
      ...t,
      createdBy: user._id,
      assignedTo: agent._id,
      aiSuggestion: `Thank you for contacting support. I've reviewed your ${t.category.toLowerCase()} issue and our team will assist you promptly.`,
      aiConfidence: Math.floor(Math.random() * 20) + 80,
      department: { 'Technical Issue': 'Technical Support', 'Billing': 'Finance & Billing', 'Account Access': 'Account Management', 'Feature Request': 'Product Team', 'General Query': 'General Support' }[t.category],
      timeline: [{ action: 'Ticket created', performedBy: user._id }]
    }))
  );

  // Add sample messages
  await Message.create([
    { ticketId: tickets[0]._id, sender: user._id, text: 'I still cannot access my account. This is very urgent!' },
    { ticketId: tickets[0]._id, sender: agent._id, text: 'I understand your frustration. Let me look into this right away. Can you confirm the email address associated with your account?' },
    { ticketId: tickets[1]._id, sender: user._id, text: 'I need this resolved ASAP. The overcharge is affecting my budget.' },
    { ticketId: tickets[1]._id, sender: agent._id, text: 'I apologize for the inconvenience. I can see the discrepancy in your account. I will process the refund within 3-5 business days.' },
  ]);

  console.log('✅ Seed completed successfully!');
  console.log('\nDemo Credentials:');
  console.log('Admin: admin@demo.com / password123');
  console.log('Agent: agent@demo.com / password123');
  console.log('User:  user@demo.com / password123');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
