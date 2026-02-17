import mongoose from 'mongoose';
import Question from '@/models/Question'; // Ensure this path matches your project structure (e.g., '../models/Question' or '@/models/Question')
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable');
  process.exit(1);
}

const REAL_QUESTIONS = [
  // DIFFICULTY 1-2 (Basics)
  { difficulty: 1, prompt: "What is the time complexity of accessing an array element by index?", choices: ["O(1)", "O(n)", "O(log n)", "O(n^2)"], correctAnswer: "O(1)" },
  { difficulty: 1, prompt: "Which HTTP status code represents 'Not Found'?", choices: ["200", "404", "500", "403"], correctAnswer: "404" },
  { difficulty: 1, prompt: "What does HTML stand for?", choices: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Mark Language", "Home Tool Markup Language"], correctAnswer: "Hyper Text Markup Language" },
  { difficulty: 2, prompt: "Which data structure follows LIFO (Last In First Out)?", choices: ["Queue", "Stack", "Tree", "Graph"], correctAnswer: "Stack" },
  { difficulty: 2, prompt: "In JavaScript, which of these is NOT a primitive type?", choices: ["String", "Boolean", "Object", "Number"], correctAnswer: "Object" },

  // DIFFICULTY 3-4 (Junior Dev)
  { difficulty: 3, prompt: "What is the worst-case time complexity of Bubble Sort?", choices: ["O(n)", "O(n log n)", "O(n^2)", "O(1)"], correctAnswer: "O(n^2)" },
  { difficulty: 3, prompt: "Which protocol is used for secure web browsing?", choices: ["HTTP", "FTP", "HTTPS", "SMTP"], correctAnswer: "HTTPS" },
  { difficulty: 4, prompt: "What does ACID stand for in databases?", choices: ["Atomicity, Consistency, Isolation, Durability", "Accuracy, Consistency, Isolation, Database", "Atomicity, Connection, Integrity, Data", "Auto, Const, Int, Double"], correctAnswer: "Atomicity, Consistency, Isolation, Durability" },
  { difficulty: 4, prompt: "Which command maps a hostname to an IP address?", choices: ["PING", "TRACEROUTE", "NSLOOKUP", "NETSTAT"], correctAnswer: "NSLOOKUP" },

  // DIFFICULTY 5-6 (Mid-Level)
  { difficulty: 5, prompt: "What is the time complexity of Binary Search on a sorted array?", choices: ["O(n)", "O(1)", "O(log n)", "O(n^2)"], correctAnswer: "O(log n)" },
  { difficulty: 5, prompt: "In React, which hook is used to handle side effects?", choices: ["useState", "useEffect", "useContext", "useReducer"], correctAnswer: "useEffect" },
  { difficulty: 6, prompt: "Which of these is a Layer 4 (Transport) protocol?", choices: ["IP", "TCP", "HTTP", "Ethernet"], correctAnswer: "TCP" },
  { difficulty: 6, prompt: "What problem does 'Rate Limiting' solve?", choices: ["Data Corruption", "DDoS/Abuse", "SQL Injection", "Memory Leaks"], correctAnswer: "DDoS/Abuse" },

  // DIFFICULTY 7-8 (Senior/System Design)
  { difficulty: 7, prompt: "Which data structure is best for implementing an LRU Cache?", choices: ["Array", "Hash Map + Doubly Linked List", "Binary Search Tree", "Stack"], correctAnswer: "Hash Map + Doubly Linked List" },
  { difficulty: 7, prompt: "What is the primary benefit of Database Sharding?", choices: ["Data Integrity", "Horizontal Scaling", "Security", "Backup Speed"], correctAnswer: "Horizontal Scaling" },
  { difficulty: 8, prompt: "In a Distributed System, what does CAP theorem stand for?", choices: ["Consistency, Availability, Partition Tolerance", "Consistency, Accuracy, Performance", "Capacity, Availability, Partitioning", "Concurrency, Async, Process"], correctAnswer: "Consistency, Availability, Partition Tolerance" },

  // DIFFICULTY 9-10 (Expert/Niche)
  { difficulty: 9, prompt: "What is the time complexity of Dijkstra's Algorithm using a Fibonacci Heap?", choices: ["O(V^2)", "O(E + V log V)", "O(E log V)", "O(V + E)"], correctAnswer: "O(E + V log V)" },
  { difficulty: 9, prompt: "Which of these prevents the 'Thundering Herd' problem?", choices: ["Exponential Backoff", "Round Robin", "Busy Waiting", "TCP Slow Start"], correctAnswer: "Exponential Backoff" },
  { difficulty: 10, prompt: "What is the 'Zombie Process' in Linux?", choices: ["A process consuming 100% CPU", "A process that has completed execution but still has an entry in the process table", "A malware process", "A daemon process"], correctAnswer: "A process that has completed execution but still has an entry in the process table" },
  { difficulty: 10, prompt: "Which consensus algorithm is used by Raft?", choices: ["Paxos", "Leader Election", "Proof of Work", "Gossip"], correctAnswer: "Leader Election" }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    // Fix: Handle deprecated options if necessary, but usually just URI is enough for Mongoose 6+
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected.');

    console.log('Clearing existing questions...');
    await Question.deleteMany({});

    console.log(`Inserting ${REAL_QUESTIONS.length} real questions...`);
    await Question.insertMany(REAL_QUESTIONS);

    console.log('✅ Seeding complete! The database now has real content.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();