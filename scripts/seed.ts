import mongoose from 'mongoose';
import Question from '../src/models/Question';
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
  // DIFFICULTY 1 (Absolute Basics)
  { difficulty: 1, prompt: "What does HTML stand for?", choices: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyper Tool Markup Language"], correctAnswer: "Hyper Text Markup Language" },
  { difficulty: 1, prompt: "Which tag is used for the largest heading in HTML?", choices: ["<h6>", "<head>", "<h1>", "<header>"], correctAnswer: "<h1>" },
  { difficulty: 1, prompt: "What is the correct syntax to output 'Hello World' in Python?", choices: ["print('Hello World')", "echo 'Hello World'", "console.log('Hello World')", "System.out.println('Hello World')"], correctAnswer: "print('Hello World')" },
  { difficulty: 1, prompt: "Which of these is NOT a programming language?", choices: ["Python", "Java", "HTML", "C++"], correctAnswer: "HTML" },
  { difficulty: 1, prompt: "What symbol is used for comments in JavaScript?", choices: ["//", "#", "<!-- -->", "/* */"], correctAnswer: "//" },
  { difficulty: 1, prompt: "Which company developed the Java language?", choices: ["Microsoft", "Google", "Sun Microsystems", "Apple"], correctAnswer: "Sun Microsystems" },
  { difficulty: 1, prompt: "What does CSS stand for?", choices: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"], correctAnswer: "Cascading Style Sheets" },
  { difficulty: 1, prompt: "Which HTML tag is used to define an internal style sheet?", choices: ["<css>", "<script>", "<style>", "<design>"], correctAnswer: "<style>" },
  { difficulty: 1, prompt: "In Git, command to download a repository from GitHub is?", choices: ["git push", "git fork", "git clone", "git commit"], correctAnswer: "git clone" },
  { difficulty: 1, prompt: "What is the file extension for a JavaScript file?", choices: [".java", ".js", ".script", ".xml"], correctAnswer: ".js" },
  { difficulty: 1, prompt: "Which operator is used to assign a value to a variable?", choices: ["*", "-", "=", "=="], correctAnswer: "=" },
  { difficulty: 1, prompt: "What does 'GUI' stand for?", choices: ["Global User Interface", "Graphical User Interface", "General User Interface", "Guidance User Interface"], correctAnswer: "Graphical User Interface" },
  { difficulty: 1, prompt: "Which key is used to refresh a page in most browsers?", choices: ["F1", "F5", "F12", "F6"], correctAnswer: "F5" },
  { difficulty: 1, prompt: "What allows you to store multiple values in a single variable?", choices: ["String", "Array", "Integer", "Boolean"], correctAnswer: "Array" },
  { difficulty: 1, prompt: "Select the boolean value:", choices: ["'True'", "10", "True", "0.5"], correctAnswer: "True" },

  // DIFFICULTY 2 (Beginner)
  { difficulty: 2, prompt: "What is the result of 3 + '3' in JavaScript?", choices: ["6", "'33'", "Error", "NaN"], correctAnswer: "'33'" },
  { difficulty: 2, prompt: "Which CSS property changes the text color?", choices: ["text-color", "fg-color", "color", "font-color"], correctAnswer: "color" },
  { difficulty: 2, prompt: "How do you select an element with id 'demo' in CSS?", choices: [".demo", "#demo", "demo", "*demo"], correctAnswer: "#demo" },
  { difficulty: 2, prompt: "Which HTML attribute specifies an alternate text for an image?", choices: ["title", "src", "alt", "href"], correctAnswer: "alt" },
  { difficulty: 2, prompt: "Which data structure follows LIFO?", choices: ["Queue", "Array", "Stack", "Tree"], correctAnswer: "Stack" },
  { difficulty: 2, prompt: "What does SQL stand for?", choices: ["Structured Question Language", "Structured Query Language", "Simple Query Language", "Strong Query Language"], correctAnswer: "Structured Query Language" },
  { difficulty: 2, prompt: "In Python, which keyword defines a function?", choices: ["func", "def", "function", "define"], correctAnswer: "def" },
  { difficulty: 2, prompt: "Which port is standard for HTTP?", choices: ["21", "443", "80", "22"], correctAnswer: "80" },
  { difficulty: 2, prompt: "What is an infinite loop?", choices: ["A loop that never starts", "A loop that runs exactly once", "A loop that never ends", "A syntax error"], correctAnswer: "A loop that never ends" },
  { difficulty: 2, prompt: "Which command shows the current directory in Linux?", choices: ["ls", "cd", "pwd", "mkdir"], correctAnswer: "pwd" },
  { difficulty: 2, prompt: "What is 'npm'?", choices: ["Node Project Manager", "Node Package Manager", "New Project Manager", "Net Package Manager"], correctAnswer: "Node Package Manager" },
  { difficulty: 2, prompt: "Which protocol sends email?", choices: ["HTTP", "FTP", "SMTP", "POP3"], correctAnswer: "SMTP" },
  { difficulty: 2, prompt: "What is the output of len('Hello') in Python?", choices: ["4", "5", "6", "Error"], correctAnswer: "5" },
  { difficulty: 2, prompt: "Which variable declaration is block-scoped in JS?", choices: ["var", "let", "global", "scope"], correctAnswer: "let" },
  { difficulty: 2, prompt: "What does API stand for?", choices: ["Application Programming Interface", "Advanced Programming Interface", "Application Process Interface", "Automated Program Instruction"], correctAnswer: "Application Programming Interface" },

  // DIFFICULTY 3 (Junior Dev)
  { difficulty: 3, prompt: "Which status code means 'Unauthorized'?", choices: ["200", "404", "500", "401"], correctAnswer: "401" },
  { difficulty: 3, prompt: "What is the worst-case complexity of Bubble Sort?", choices: ["O(n)", "O(log n)", "O(n^2)", "O(1)"], correctAnswer: "O(n^2)" },
  { difficulty: 3, prompt: "In React, what are 'props'?", choices: ["Internal component state", "Arguments passed into components", "External libraries", "Database properties"], correctAnswer: "Arguments passed into components" },
  { difficulty: 3, prompt: "Which keyword prevents a class from being inherited in Java/C#?", choices: ["static", "final", "abstract", "private"], correctAnswer: "final" },
  { difficulty: 3, prompt: "What does JSON stand for?", choices: ["Java Standard Object Notation", "JavaScript Object Notation", "Java System Object Network", "JavaScript Object Network"], correctAnswer: "JavaScript Object Notation" },
  { difficulty: 3, prompt: "Which command creates a new branch in Git?", choices: ["git checkout -b", "git branch -n", "git new-branch", "git push origin"], correctAnswer: "git checkout -b" },
  { difficulty: 3, prompt: "What is the default port for MongoDB?", choices: ["3306", "5432", "27017", "6379"], correctAnswer: "27017" },
  { difficulty: 3, prompt: "In CSS, what is the 'Box Model'?", choices: ["A layout mode", "Margin, Border, Padding, Content", "A prompt box", "Grid system"], correctAnswer: "Margin, Border, Padding, Content" },
  { difficulty: 3, prompt: "True or False: 'null' is an object in JavaScript.", choices: ["True", "False"], correctAnswer: "True" },
  { difficulty: 3, prompt: "What does 'DNS' do?", choices: ["Encrypts data", "Maps domain names to IPs", "Routes packets", "Stores website files"], correctAnswer: "Maps domain names to IPs" },
  { difficulty: 3, prompt: "Which hook manages state in React?", choices: ["useEffect", "useContext", "useState", "useProps"], correctAnswer: "useState" },
  { difficulty: 3, prompt: "Which method adds an element to the end of an array in JS?", choices: ["push()", "pop()", "shift()", "unshift()"], correctAnswer: "push()" },
  { difficulty: 3, prompt: "What is 'localhost' IP address?", choices: ["192.168.0.1", "127.0.0.1", "10.0.0.1", "0.0.0.0"], correctAnswer: "127.0.0.1" },
  { difficulty: 3, prompt: "What is a 'foreign key'?", choices: ["A key to unlock the DB", "A primary key in another table", "An encrypted key", "A backup key"], correctAnswer: "A primary key in another table" },
  { difficulty: 3, prompt: "Which type of loop executes at least once?", choices: ["for", "while", "do-while", "foreach"], correctAnswer: "do-while" },

  // DIFFICULTY 4 (Developing Competence)
  { difficulty: 4, prompt: "What does ACID stand for?", choices: ["Atomicity, Consistency, Isolation, Durability", "Accuracy, Consistency, Isolation, Database", "Atomicity, Connection, Integrity, Data", "Auto, Const, Int, Double"], correctAnswer: "Atomicity, Consistency, Isolation, Durability" },
  { difficulty: 4, prompt: "Which command maps a hostname to an IP address?", choices: ["PING", "TRACEROUTE", "NSLOOKUP", "NETSTAT"], correctAnswer: "NSLOOKUP" },
  { difficulty: 4, prompt: "Which HTTP method is idempotent?", choices: ["POST", "PUT", "CONNECT", "PATCH"], correctAnswer: "PUT" },
  { difficulty: 4, prompt: "What is 'Hoisting' in JavaScript?", choices: ["Moving declarations to the top", "Lifting weights", "Scaling applications", "Rising error levels"], correctAnswer: "Moving declarations to the top" },
  { difficulty: 4, prompt: "Which Design Pattern ensures a class has only one instance?", choices: ["Factory", "Observer", "Singleton", "Strategy"], correctAnswer: "Singleton" },
  { difficulty: 4, prompt: "What is the difference between '==' and '===' in JS?", choices: ["No difference", "Value equality vs. Value & Type equality", "Assignment vs. Equality", "Reference vs. Value"], correctAnswer: "Value equality vs. Value & Type equality" },
  { difficulty: 4, prompt: "Which layer of the OSI model does IP (Internet Protocol) belong to?", choices: ["Application", "Transport", "Network", "Data Link"], correctAnswer: "Network" },
  { difficulty: 4, prompt: "What is 'Closure' in JavaScript?", choices: ["Closing a file", "A function bundled with its lexical environment", "The end of a loop", "Closing a database connection"], correctAnswer: "A function bundled with its lexical environment" },
  { difficulty: 4, prompt: "Which command in Linux changes file permissions?", choices: ["chown", "chmod", "grep", "sudo"], correctAnswer: "chmod" },
  { difficulty: 4, prompt: "What does 'SOLID' stand for in OOP?", choices: ["5 Principles of Software Design", "A database type", "A state management library", "Hard coding style"], correctAnswer: "5 Principles of Software Design" },
  { difficulty: 4, prompt: "In React, what is the Virtual DOM?", choices: ["A direct copy of the browser DOM", "A lightweight copy for performance optimization", "A 3D model", "An external API"], correctAnswer: "A lightweight copy for performance optimization" },
  { difficulty: 4, prompt: "Which sorting algorithm is arguably the fastest on average?", choices: ["Bubble Sort", "Insertion Sort", "Quick Sort", "Selection Sort"], correctAnswer: "Quick Sort" },
  { difficulty: 4, prompt: "What is a JWT?", choices: ["Java Web Token", "JSON Web Token", "JavaScript Web Token", "Joint Web Token"], correctAnswer: "JSON Web Token" },
  { difficulty: 4, prompt: "What is the purpose of 'Docker'?", choices: ["Virtualization", "Containerization", "Compilation", "Database Management"], correctAnswer: "Containerization" },
  { difficulty: 4, prompt: "Which data structure uses keys and values?", choices: ["Array", "Linked List", "Hash Map", "Stack"], correctAnswer: "Hash Map" },

  // DIFFICULTY 5 (Mid-Level)
  { difficulty: 5, prompt: "What is the time complexity of Binary Search?", choices: ["O(n)", "O(1)", "O(log n)", "O(n^2)"], correctAnswer: "O(log n)" },
  { difficulty: 5, prompt: "In React, which hook handles side effects?", choices: ["useState", "useEffect", "useContext", "useReducer"], correctAnswer: "useEffect" },
  { difficulty: 5, prompt: "What is a 'Race Condition'?", choices: ["A fast algorithm", "Two threads accessing shared data concurrently", "A network speed test", "A database lock"], correctAnswer: "Two threads accessing shared data concurrently" },
  { difficulty: 5, prompt: "Which HTTP header is used for content negotiation?", choices: ["Accept", "Content-Type", "Authorization", "Host"], correctAnswer: "Accept" },
  { difficulty: 5, prompt: "What is the 'Event Loop' in Node.js?", choices: ["A loop that emits events", "Mechanism for handling async callbacks", "A 'while(true)' loop", "An infinite recursion"], correctAnswer: "Mechanism for handling async callbacks" },
  { difficulty: 5, prompt: "Which index type is default in MySQL?", choices: ["Hash", "B-Tree", "R-Tree", "Full-text"], correctAnswer: "B-Tree" },
  { difficulty: 5, prompt: "In Git, what is a 'rebase'?", choices: ["Deleting a branch", "Moving the base of a branch to a new commit", "Merging two branches", "Renaming a commit"], correctAnswer: "Moving the base of a branch to a new commit" },
  { difficulty: 5, prompt: "What is 'Memoization'?", choices: ["Memorizing syntax", "Caching function results based on inputs", "Writing notes in code", "Compressing memory"], correctAnswer: "Caching function results based on inputs" },
  { difficulty: 5, prompt: "Which protocol allows bidirectional communication?", choices: ["HTTP", "WebSocket", "FTP", "SMTP"], correctAnswer: "WebSocket" },
  { difficulty: 5, prompt: "What is 'Deadlock'?", choices: ["A frozen screen", "Two processes waiting for each other indefinitely", "A crashed hard drive", "A stopped service"], correctAnswer: "Two processes waiting for each other indefinitely" },
  { difficulty: 5, prompt: "What does 'REST' stand for?", choices: ["Representational State Transfer", "Remote Execution State Transfer", "Real State Transfer", "Rapid Exchange Standard Transfer"], correctAnswer: "Representational State Transfer" },
  { difficulty: 5, prompt: "In TypeScript, what is `any`?", choices: ["A library", "A type that disables type checking", "A loop construct", "A new primitive"], correctAnswer: "A type that disables type checking" },
  { difficulty: 5, prompt: "What is the purpose of a Load Balancer?", choices: ["Compress files", "Distribute traffic across servers", "Encrypt connections", "Store backups"], correctAnswer: "Distribute traffic across servers" },
  { difficulty: 5, prompt: "In Linux, what does 'grep' do?", choices: ["Deletes files", "Searches text using patterns", "Changes groups", "Installs packages"], correctAnswer: "Searches text using patterns" },
  { difficulty: 5, prompt: "What is a 'Promise' in JS?", choices: ["A guarantee of future code execution", "An object representing eventual completion of async op", "A strict variable", "A function that always returns true"], correctAnswer: "An object representing eventual completion of async op" },

  // DIFFICULTY 6 (Advanced)
  { difficulty: 6, prompt: "Which of these is a Layer 4 protocol?", choices: ["IP", "TCP", "HTTP", "Ethernet"], correctAnswer: "TCP" },
  { difficulty: 6, prompt: "What problem does 'Rate Limiting' solve?", choices: ["Data Corruption", "DDoS/Abuse", "SQL Injection", "Memory Leaks"], correctAnswer: "DDoS/Abuse" },
  { difficulty: 6, prompt: "What is 'Dependency Injection'?", choices: ["Injecting code into a dependency", "Giving an object its dependencies rather than creating them", "Downloading packages", "A virus attack"], correctAnswer: "Giving an object its dependencies rather than creating them" },
  { difficulty: 6, prompt: "Which Graph traversal algorithm uses a Queue?", choices: ["DFS", "BFS", "Dijkstra", "Bellman-Ford"], correctAnswer: "BFS" },
  { difficulty: 6, prompt: "What is 'CORS'?", choices: ["Cross-Origin Resource Sharing", "Computer Origin Resource System", "Code Optimization Resource Strategy", "Central Online Registration System"], correctAnswer: "Cross-Origin Resource Sharing" },
  { difficulty: 6, prompt: "In Docker, what is the difference between image and container?", choices: ["No difference", "Image is a class, Container is an instance", "Image is running, Container is stored", "Container is the file, Image is the process"], correctAnswer: "Image is a class, Container is an instance" },
  { difficulty: 6, prompt: "What is 'Normalization' in Databases?", choices: ["Increasing redundancy", "Reducing redundancy", "Deleting tables", "Creating backups"], correctAnswer: "Reducing redundancy" },
  { difficulty: 6, prompt: "What is the 'Critical Rendering Path'?", choices: ["The fastest way to render", "Sequence of steps browser takes to render a page", "A graphics library", "SEO strategy"], correctAnswer: "Sequence of steps browser takes to render a page" },
  { difficulty: 6, prompt: "Which HTTP status code is a 'Teapot'?", choices: ["404", "418", "503", "200"], correctAnswer: "418" },
  { difficulty: 6, prompt: "What is 'Currying' in Functional Programming?", choices: ["Spicy coding", "Transforming a function with multiple args into sequence of nested functions", "Mixing types", "Looping recursively"], correctAnswer: "Transforming a function with multiple args into sequence of nested functions" },
  { difficulty: 6, prompt: "What is a 'Salt' in cryptography?", choices: ["An algorithm", "Random data added to input before hashing", "A key exchange protocol", "A decryption tool"], correctAnswer: "Random data added to input before hashing" },
  { difficulty: 6, prompt: "Which command lists running containers in Docker?", choices: ["docker run", "docker ps", "docker images", "docker ls"], correctAnswer: "docker ps" },
  { difficulty: 6, prompt: "What is 'SSR' in web dev?", choices: ["Server Side Rendering", "Super Simple React", "Secure Socket Request", "Style Sheet Rendering"], correctAnswer: "Server Side Rendering" },
  { difficulty: 6, prompt: "Which algorithm is used for Shortest Path in weighted graphs?", choices: ["BFS", "DFS", "Dijkstra", "Quicksort"], correctAnswer: "Dijkstra" },
  { difficulty: 6, prompt: "What is the main difference between TCP and UDP?", choices: ["Speed vs Reliability", "Encryption", "Port range", "IPv4 vs IPv6"], correctAnswer: "Speed vs Reliability" },

  // DIFFICULTY 7 (Senior)
  { difficulty: 7, prompt: "Which data structure is best for LRU Cache?", choices: ["Array", "Hash Map + Doubly Linked List", "Binary Search Tree", "Stack"], correctAnswer: "Hash Map + Doubly Linked List" },
  { difficulty: 7, prompt: "What is 'Sharding'?", choices: ["Data Integrity", "Horizontal Partitioning of Data", "Security", "Backup Speed"], correctAnswer: "Horizontal Partitioning of Data" },
  { difficulty: 7, prompt: "What is 'Idempotency'?", choices: ["Operation can be applied multiple times without changing result", "Operation runs only once", "Operation is secure", "Operation is fast"], correctAnswer: "Operation can be applied multiple times without changing result" },
  { difficulty: 7, prompt: "What is 'Middleware' in Express.js?", choices: ["A database", "Functions that access req/res objects before final handler", "Frontend framework", "A compiler"], correctAnswer: "Functions that access req/res objects before final handler" },
  { difficulty: 7, prompt: "Which SQL isolation level prevents 'Phantom Reads'?", choices: ["Read Committed", "Repeatable Read", "Serializable", "Read Uncommitted"], correctAnswer: "Serializable" },
  { difficulty: 7, prompt: "What is 'Webhook'?", choices: ["A phishing attack", "A way for an app to provide other apps with real-time info", "A net for spiders", "A database query"], correctAnswer: "A way for an app to provide other apps with real-time info" },
  { difficulty: 7, prompt: "In Kubernetes, what is a 'Pod'?", choices: ["A storage unit", "Smallest deployable unit", "A master node", "A network policy"], correctAnswer: "Smallest deployable unit" },
  { difficulty: 7, prompt: "What is 'Tree Shaking'?", choices: ["Removing dead leaves", "Dead code elimination during build", "Optimizing binary trees", "Refreshing the DOM"], correctAnswer: "Dead code elimination during build" },
  { difficulty: 7, prompt: "Which status code represents 'Forbidden'?", choices: ["401", "403", "404", "500"], correctAnswer: "403" },
  { difficulty: 7, prompt: "What is 'Event Sourcing'?", choices: ["Finding event venues", "Storing state as a sequence of events", "Hiring event planners", "Listening to DOM events"], correctAnswer: "Storing state as a sequence of events" },
  { difficulty: 7, prompt: "What is the 'Three-Way Handshake'?", choices: ["A greeting", "TCP connection establishment method", "Agile meeting", "Security protocol"], correctAnswer: "TCP connection establishment method" },
  { difficulty: 7, prompt: "What is 'Blue-Green Deployment'?", choices: ["A CSS theme", "Technique to reduce downtime by running two environments", "Planting trees", "Deploying to azure"], correctAnswer: "Technique to reduce downtime by running two environments" },
  { difficulty: 7, prompt: "What is 'Debouncing'?", choices: ["Removing bugs", "Limiting the rate at which a function fires", "Bouncing a server", "Deleting cache"], correctAnswer: "Limiting the rate at which a function fires" },
  { difficulty: 7, prompt: "Which design pattern is used in Redux?", choices: ["MVC", "Flux/Observer", "Strategy", "Factory"], correctAnswer: "Flux/Observer" },
  { difficulty: 7, prompt: "What is 'OAuth'?", choices: ["Open Auth Protocol", "Oracle Auth", "Online Authorization", "Object Auth"], correctAnswer: "Open Auth Protocol" },

  // DIFFICULTY 8 (Staff Engineer)
  { difficulty: 8, prompt: "What is 'CAP Theorem'?", choices: ["Consistency, Availability, Partition Tolerance", "Consistency, Accuracy, Performance", "Capacity, Availability, Partitioning", "Concurrency, Async, Process"], correctAnswer: "Consistency, Availability, Partition Tolerance" },
  { difficulty: 8, prompt: "What is 'Consistent Hashing' used for?", choices: ["Password security", "Distributing data across nodes to minimize reorganization", "Image compression", "Sorting arrays"], correctAnswer: "Distributing data across nodes to minimize reorganization" },
  { difficulty: 8, prompt: "In distributed transaction, what is 2PC?", choices: ["2 Personal Computers", "Two-Phase Commit Protocol", "Second Phase Coding", "Two Point Compression"], correctAnswer: "Two-Phase Commit Protocol" },
  { difficulty: 8, prompt: "What is the 'Circuit Breaker' pattern?", choices: ["Electric wiring", "Preventing cascading failures in distributed systems", "Breaking loops", "Stopping a build"], correctAnswer: "Preventing cascading failures in distributed systems" },
  { difficulty: 8, prompt: "What is 'Bloom Filter'?", choices: ["Image effect", "Probabilistic data structure to test set membership", "Spam filter", "Coffee maker"], correctAnswer: "Probabilistic data structure to test set membership" },
  { difficulty: 8, prompt: "Which complexity class represents problems verifiable in poly-time?", choices: ["P", "NP", "NP-Complete", "NP-Hard"], correctAnswer: "NP" },
  { difficulty: 8, prompt: "What is 'Database Indexing' trade-off?", choices: ["Faster reads, Slower writes", "Slower reads, Faster writes", "More storage, Less cpu", "Less storage, More cpu"], correctAnswer: "Faster reads, Slower writes" },
  { difficulty: 8, prompt: "What is 'Sticky Session'?", choices: ["A user staying logged in", "Routing requests from a user to the same server", "A sweet dessert", "Permanent cookies"], correctAnswer: "Routing requests from a user to the same server" },
  { difficulty: 8, prompt: "In SSL/TLS, what type of encryption is used for the handshake?", choices: ["Symmetric", "Asymmetric", "Hashing", "No encryption"], correctAnswer: "Asymmetric" },
  { difficulty: 8, prompt: "What is 'Head-of-Line Blocking'?", choices: ["Line jumping", "Performance issue where line of packets is held up by first packet", "CSS blocking render", "Traffic jam"], correctAnswer: "Performance issue where line of packets is held up by first packet" },
  { difficulty: 8, prompt: "What is the 'Sidecar' pattern?", choices: ["A motorcycle", "Deploying helper container alongside main container", "A menu bar", "Development branch"], correctAnswer: "Deploying helper container alongside main container" },
  { difficulty: 8, prompt: "What is 'gRPC' based on?", choices: ["REST", "SOAP", "Protocol Buffers", "JSON"], correctAnswer: "Protocol Buffers" },
  { difficulty: 8, prompt: "Which command traces packet path?", choices: ["ping", "traceroute", "netstat", "ip addr"], correctAnswer: "traceroute" },
  { difficulty: 8, prompt: "What is 'Chaos Engineering'?", choices: ["Bad coding", "Experimenting on a system to build confidence in capability to withstand turbulence", "Random testing", "Hacking"], correctAnswer: "Experimenting on a system to build confidence in capability to withstand turbulence" },
  { difficulty: 8, prompt: "What is 'Backpressure'?", choices: ["Peer pressure", "Resistance of data flow when consumer is slower than producer", "Server load", "Network latency"], correctAnswer: "Resistance of data flow when consumer is slower than producer" },

  // DIFFICULTY 9 (Principal Engineer)
  { difficulty: 9, prompt: "What is complexity of Dijkstra with Fibonacci Heap?", choices: ["O(V^2)", "O(E + V log V)", "O(E log V)", "O(V + E)"], correctAnswer: "O(E + V log V)" },
  { difficulty: 9, prompt: "What prevents 'Thundering Herd'?", choices: ["Exponential Backoff", "Round Robin", "Busy Waiting", "TCP Slow Start"], correctAnswer: "Exponential Backoff" },
  { difficulty: 9, prompt: "What is 'CRDT'?", choices: ["Conflict-free Replicated Data Type", "Create Read Delete Test", "Central Registry Data Table", "Critical Route Data Transfer"], correctAnswer: "Conflict-free Replicated Data Type" },
  { difficulty: 9, prompt: "In Kernel, what is 'Context Switch'?", choices: ["Changing text color", "Storing state of process/thread so it can be restored", "Switching monitors", "Changing directories"], correctAnswer: "Storing state of process/thread so it can be restored" },
  { difficulty: 9, prompt: "What is 'False Sharing' in multi-threading?", choices: ["Sharing fake news", "Threads invalidating cache lines of non-shared data due to proximity", "Incorrect variable scope", "Deadlock scenario"], correctAnswer: "Threads invalidating cache lines of non-shared data due to proximity" },
  { difficulty: 9, prompt: "What is 'SSTable'?", choices: ["Sorted String Table", "Super Simple Table", "Spreadsheet Table", "Solid State Table"], correctAnswer: "Sorted String Table" },
  { difficulty: 9, prompt: "Which attack does 'CSRF' token prevent?", choices: ["XSS", "SQL Injection", "Cross-Site Request Forgery", "Man-in-the-middle"], correctAnswer: "Cross-Site Request Forgery" },
  { difficulty: 9, prompt: "What is 'Quorum' in distributed systems?", choices: ["A meeting", "Minimum number of members needed to perform operation", "A chat app", "Server capacity"], correctAnswer: "Minimum number of members needed to perform operation" },
  { difficulty: 9, prompt: "What is 'Zero-Copy'?", choices: ["No copyright", "Technique to avoid CPU data copy between memory buffers", "Plagiarism", "Empty file"], correctAnswer: "Technique to avoid CPU data copy between memory buffers" },
  { difficulty: 9, prompt: "What is 'Amortized Analysis'?", choices: ["Loan repayment", "Average performance over sequence of operations", "Worst case analysis", "Best case analysis"], correctAnswer: "Average performance over sequence of operations" },
  { difficulty: 9, prompt: "What is 'Memory Leak'?", choices: ["Forgetting passwords", "Failure to release memory causing exhaustion", "Hardware failure", "Open ports"], correctAnswer: "Failure to release memory causing exhaustion" },
  { difficulty: 9, prompt: "What is 'Hypervisor'?", choices: ["A manager", "Software creating and running virtual machines", "Super computer", "Cloud provider"], correctAnswer: "Software creating and running virtual machines" },
  { difficulty: 9, prompt: "What is 'Isomorphic JavaScript'?", choices: ["Same shape", "Code that runs on both client and server", "Geometry library", "TypeScript"], correctAnswer: "Code that runs on both client and server" },
  { difficulty: 9, prompt: "What is 'Epoll'?", choices: ["Email poll", "Linux I/O event notification facility", "Election software", "Network protocol"], correctAnswer: "Linux I/O event notification facility" },
  { difficulty: 9, prompt: "What is 'BGP'?", choices: ["Border Gateway Protocol", "Big Gate Protocol", "Basic Graph Protocol", "Binary Group Protocol"], correctAnswer: "Border Gateway Protocol" },

  // DIFFICULTY 10 (Distinguished/Niche)
  { difficulty: 10, prompt: "What is a 'Zombie Process'?", choices: ["Process consuming 100% CPU", "Process that completed but has entry in process table", "Malware", "Daemon"], correctAnswer: "Process that completed but has entry in process table" },
  { difficulty: 10, prompt: "Which consensus algorithm does Raft use?", choices: ["Paxos", "Leader Election", "Proof of Work", "Gossip"], correctAnswer: "Leader Election" },
  { difficulty: 10, prompt: "What is the 'Byzantine Generals Problem'?", choices: ["Military strategy", "Reliability in face of malicious actors", "History question", "Graph theory"], correctAnswer: "Reliability in face of malicious actors" },
  { difficulty: 10, prompt: "What is 'CAS' (Compare-And-Swap)?", choices: ["A sorting algorithm", "Atomic instruction for synchronization", "Cascading Styles", "Cache invalidation"], correctAnswer: "Atomic instruction for synchronization" },
  { difficulty: 10, prompt: "What is 'Instruction Pipelining'?", choices: ["Plumbing", "Technique to increase instruction throughput", "Wiring cables", "Software architecture"], correctAnswer: "Technique to increase instruction throughput" },
  { difficulty: 10, prompt: "What is 'NUMA'?", choices: ["Non-Uniform Memory Access", "New Urban Modern Art", "Network User Management", "Number Algorithm"], correctAnswer: "Non-Uniform Memory Access" },
  { difficulty: 10, prompt: "What is 'Priority Inversion'?", choices: ["Reversing list", "Lower priority task holding resource needed by higher priority task", "Upside down tree", "Negative priority"], correctAnswer: "Lower priority task holding resource needed by higher priority task" },
  { difficulty: 10, prompt: "What is 'Branch Prediction'?", choices: ["Forecasting tree growth", "CPU guessing which way 'if' statement goes", "Git strategy", "Code review"], correctAnswer: "CPU guessing which way 'if' statement goes" },
  { difficulty: 10, prompt: "What is 'Cache Coherence'?", choices: ["Clear thinking", "Consistency of shared resource data in multiple local caches", "Empty cache", "Web browser setting"], correctAnswer: "Consistency of shared resource data in multiple local caches" },
  { difficulty: 10, prompt: "What is 'TCP Fast Open'?", choices: ["Opening door quickly", "Extension to speed up opening successive TCP connections", "Fast internet", "Server setting"], correctAnswer: "Extension to speed up opening successive TCP connections" },
  { difficulty: 10, prompt: "What is 'Meltdown' and 'Spectre'?", choices: ["Disasters", "Microarchitectural timing side-channel attacks", "Viruses", "Software bugs"], correctAnswer: "Microarchitectural timing side-channel attacks" },
  { difficulty: 10, prompt: "What is 'ABA Problem'?", choices: ["Alphabet soup", "Synchronization problem in multithreading", "Music group", "Battery type"], correctAnswer: "Synchronization problem in multithreading" },
  { difficulty: 10, prompt: "What is 'Raft Log Replication'?", choices: ["Building boats", "Mechanism to keep logs consistent across cluster", "Logging errors", "Database backup"], correctAnswer: "Mechanism to keep logs consistent across cluster" },
  { difficulty: 10, prompt: "What is 'Copy-on-Write'?", choices: ["Copyright law", "Optimization strategy to defer copying until modification", "Writing multiple copies", "Backup strategy"], correctAnswer: "Optimization strategy to defer copying until modification" },
  { difficulty: 10, prompt: "What is 'Tail Latency'?", choices: ["Animal tail", "The small percentage of response times that take the longest", "Network lag", "Server boot time"], correctAnswer: "The small percentage of response times that take the longest" }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
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