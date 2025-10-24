const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const prisma = new PrismaClient();

// Middleware
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3002"],
    credentials: true
}));
app.use(express.json());

// Store active sessions and their timers
const activeSessions = new Map();
const messageIntervals = new Map();

// Initialize default tasks
const initializeTasks = async () => {
    const tasks = [
        {
            title: "Fix alt attribute in img1",
            description: "Add proper alt text to the image element for accessibility compliance",
            code: `<img src="profile.jpg" alt="" />`,
            solution: `<img src="profile.jpg" alt="User profile picture" />`,
            violation: "Disability Act",
            difficulty: "easy"
        },
        {
            title: "Fix input validation",
            description: "Add proper validation to prevent malicious input",
            code: `function processInput(userInput) {
  return userInput;
}`,
            solution: `function processInput(userInput) {
  if (!userInput || typeof userInput !== 'string') {
    throw new Error('Invalid input');
  }
  return userInput.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}`,
            violation: "Tort",
            difficulty: "medium"
        },
        {
            title: "Fix user login security",
            description: "Implement secure authentication mechanism",
            code: `function login(username, password) {
  if (username === 'admin' && password === 'password') {
    return true;
  }
  return false;
}`,
            solution: `async function login(username, password) {
  const user = await findUser(username);
  if (!user) return false;
  
  const isValid = await bcrypt.compare(password, user.hashedPassword);
  if (!isValid) return false;
  
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  return { token, user: { id: user.id, username: user.username } };
}`,
            violation: "Bankruptcy",
            difficulty: "hard"
        },
        {
            title: "Fix secure database connection",
            description: "Implement secure database connection with proper error handling",
            code: `const db = require('mysql');
const connection = db.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'myapp'
});`,
            solution: `const mysql = require('mysql2/promise');
const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
});`,
            violation: "Tort",
            difficulty: "hard"
        }
    ];

    for (const task of tasks) {
        // Check if task already exists
        const existingTask = await prisma.task.findFirst({
            where: { title: task.title }
        });

        if (existingTask) {
            // Update existing task
            await prisma.task.update({
                where: { id: existingTask.id },
                data: task
            });
        } else {
            // Create new task
            await prisma.task.create({
                data: task
            });
        }
    }
};

// API Routes

// Tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await prisma.task.findMany();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Users
app.get('/api/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/users', async (req, res) => {
    try {
        const { email, name } = req.body;
        const user = await prisma.user.create({
            data: { email, name }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Sessions
app.get('/api/sessions', async (req, res) => {
    try {
        const sessions = await prisma.session.findMany({
            include: {
                user: true,
                sessionTasks: {
                    include: { task: true }
                },
                messages: true,
                verdicts: true
            }
        });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/sessions', async (req, res) => {
    try {
        const { userId } = req.body;

        // Create session tasks for all available tasks first
        const tasks = await prisma.task.findMany();

        const session = await prisma.session.create({
            data: { userId },
            include: {
                user: true,
                sessionTasks: {
                    include: { task: true }
                }
            }
        });

        // Create session tasks for all available tasks
        for (const task of tasks) {
            await prisma.sessionTask.create({
                data: {
                    sessionId: session.id,
                    taskId: task.id,
                    status: 'pending'
                }
            });
        }

        // Fetch the session again with all session tasks
        const sessionWithTasks = await prisma.session.findUnique({
            where: { id: session.id },
            include: {
                user: true,
                sessionTasks: {
                    include: { task: true }
                }
            }
        });

        // Start the session timer
        startSessionTimer(session.id);

        res.json(sessionWithTasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/sessions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { phase, score, penalties, completed, ignored } = req.body;

        const session = await prisma.session.update({
            where: { id },
            data: { phase, score, penalties, completed, ignored }
        });

        // Emit real-time update
        io.emit('sessionUpdate', session);
        res.json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Session Tasks
app.post('/api/session-tasks', async (req, res) => {
    try {
        const { sessionId, taskId, output, status } = req.body;

        const sessionTask = await prisma.sessionTask.create({
            data: {
                sessionId,
                taskId,
                output,
                status: status || 'completed'
            }
        });

        res.json(sessionTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/session-tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const sessionTask = await prisma.sessionTask.findUnique({
            where: { id },
            include: { task: true, session: true }
        });
        res.json(sessionTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/session-tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, output, penalty } = req.body;

        const sessionTask = await prisma.sessionTask.update({
            where: { id },
            data: { status, output, penalty },
            include: { task: true, session: true }
        });

        // Emit real-time update
        io.emit('sessionTaskUpdate', sessionTask);
        res.json(sessionTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/session-tasks/:id/save', async (req, res) => {
    try {
        const { id } = req.params;
        const { output } = req.body;

        const sessionTask = await prisma.sessionTask.update({
            where: { id },
            data: { output },
            include: { task: true, session: true }
        });

        res.json(sessionTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/session-tasks/:id/show-solution', async (req, res) => {
    try {
        const { id } = req.params;
        const sessionTask = await prisma.sessionTask.findUnique({
            where: { id },
            include: { task: true, session: true }
        });

        if (!sessionTask) {
            return res.status(404).json({ error: 'Session task not found' });
        }

        // Add penalty for showing solution
        const penalty = 10;
        const updatedSessionTask = await prisma.sessionTask.update({
            where: { id },
            data: {
                penalty: sessionTask.penalty + penalty,
                status: 'failed'
            },
            include: { task: true, session: true }
        });

        // Update session penalties
        await prisma.session.update({
            where: { id: sessionTask.sessionId },
            data: { penalties: { increment: penalty } }
        });

        res.json({
            sessionTask: updatedSessionTask,
            solution: sessionTask.task.solution,
            penalty
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Messages
app.get('/api/messages', async (req, res) => {
    try {
        const { sessionId } = req.query;
        const messages = await prisma.message.findMany({
            where: sessionId ? { sessionId } : {},
            orderBy: { timestamp: 'desc' }
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/messages', async (req, res) => {
    try {
        const { sessionId, sender, content } = req.body;
        const message = await prisma.message.create({
            data: { sessionId, sender, content }
        });

        // Emit real-time message
        io.emit('newMessage', message);
        res.json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Verdicts
app.get('/api/verdicts', async (req, res) => {
    try {
        const verdicts = await prisma.verdict.findMany({
            include: { session: true }
        });
        res.json(verdicts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/verdicts', async (req, res) => {
    try {
        const { sessionId, taskId, violation, penalty, reason } = req.body;
        const verdict = await prisma.verdict.create({
            data: { sessionId, taskId, violation, penalty, reason }
        });

        // Emit courtroom transition
        io.emit('courtroomTransition', { sessionId, verdict });
        res.json(verdict);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Session timer logic
function startSessionTimer(sessionId) {
    const timer = setTimeout(async () => {
        // End session after 5 minutes
        await prisma.session.update({
            where: { id: sessionId },
            data: {
                phase: 'ENDED',
                endTime: new Date()
            }
        });

        // Clear intervals
        if (messageIntervals.has(sessionId)) {
            clearInterval(messageIntervals.get(sessionId));
            messageIntervals.delete(sessionId);
        }

        activeSessions.delete(sessionId);
        io.emit('sessionEnded', { sessionId });
    }, 5 * 60 * 1000); // 5 minutes

    activeSessions.set(sessionId, timer);

    // Start periodic messages
    startPeriodicMessages(sessionId);
}

function startPeriodicMessages(sessionId) {
    const interval = setInterval(async () => {
        const senders = ['Boss', 'Family', 'Agile'];
        const messages = [
            'Where is the report?',
            'Can you pick up groceries?',
            'The sprint is behind schedule!',
            'Did you finish the presentation?',
            'Dinner is ready!',
            'We need to deploy today!',
            'Can you help with homework?',
            'The client is waiting!'
        ];

        const sender = senders[Math.floor(Math.random() * senders.length)];
        const content = messages[Math.floor(Math.random() * messages.length)];

        const message = await prisma.message.create({
            data: { sessionId, sender, content }
        });

        io.emit('newMessage', message);
    }, Math.random() * 10000 + 20000); // 20-30 seconds

    messageIntervals.set(sessionId, interval);
}

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Initialize database and start server
async function main() {
    await initializeTasks();

    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});

module.exports = app;
