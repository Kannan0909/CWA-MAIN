const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create a default user
    const user = await prisma.user.upsert({
        where: { email: 'developer@example.com' },
        update: {},
        create: {
            email: 'developer@example.com',
            name: 'Software Developer'
        }
    });

    console.log('✅ User created:', user.email);

    // Create default tasks
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

    for (const taskData of tasks) {
        // Check if task already exists
        const existingTask = await prisma.task.findFirst({
            where: { title: taskData.title }
        });

        if (existingTask) {
            // Update existing task
            const task = await prisma.task.update({
                where: { id: existingTask.id },
                data: taskData
            });
            console.log('✅ Task updated:', task.title);
        } else {
            // Create new task
            const task = await prisma.task.create({
                data: taskData
            });
            console.log('✅ Task created:', task.title);
        }
    }

    console.log('🎉 Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
