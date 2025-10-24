export const TIME_OPTIONS = [
  { time: 120, label: '2 mins', difficulty: 'Beginner', color: 'bg-green-600 hover:bg-green-700' },
  { time: 300, label: '5 mins', difficulty: 'Intermediate', color: 'bg-orange-600 hover:bg-orange-700' },
  { time: 600, label: '10 mins', difficulty: 'Advanced', color: 'bg-red-600 hover:bg-red-700' },
];

export const getDebuggingChallenges = (gameDuration: number) => {
  const beginner = [
    {
      id: 'accessibility_disability_act',
      penaltyKey: 'DisabilityAct',
      initialMessage: 'Accessibility issue detected! The image in your homepage is missing its alt text. Add a descriptive alt attribute before the client sues for breaking the Disability Act!',
      urgentMessage: 'URGENT: Fix alt in img1 - Accessibility violation!',
      penaltyMessage: 'You are fined for breaking the Disability Act. Accessibility is not optional!',
      initialTime: Math.floor(gameDuration * 0.25),
      urgentTime: Math.floor(gameDuration * 0.5),
      penaltyTime: Math.floor(gameDuration * 0.75)
    }
  ];

  const intermediate = [
    {
      id: 'accessibility_disability_act',
      penaltyKey: 'DisabilityAct',
      initialMessage: 'Accessibility issue detected! The image in your homepage is missing its alt text. Add a descriptive alt attribute before the client sues for breaking the Disability Act!',
      urgentMessage: 'URGENT: Fix alt in img1 - Accessibility violation!',
      penaltyMessage: 'You are fined for breaking the Disability Act. Accessibility is not optional!',
      initialTime: Math.floor(gameDuration * 0.10),
      urgentTime: Math.floor(gameDuration * 0.20),
      penaltyTime: Math.floor(gameDuration * 0.30)
    },
    {
      id: 'input_validation_tort',
      penaltyKey: 'LawsOfTort_Validation',
      initialMessage: 'Validation issue detected! Your form accepts any text as an email. Add proper validation or risk violating the Laws of Tort for negligence!',
      urgentMessage: 'URGENT: Fix input validation - Tort violation!',
      penaltyMessage: 'You are fined for breaking the Laws of Tort. User data validation was missing!',
      initialTime: Math.floor(gameDuration * 0.25),
      urgentTime: Math.floor(gameDuration * 0.35),
      penaltyTime: Math.floor(gameDuration * 0.45)
    },
    {
      id: 'user_login_bankruptcy',
      penaltyKey: 'Bankruptcy',
      initialMessage: 'Your login button doesn\'t work! Customers can\'t access their accounts — fix this before your company declares bankruptcy!',
      urgentMessage: 'URGENT: Fix user login - Bankruptcy risk!',
      penaltyMessage: 'You have been declared bankrupt! No one can log in, and your app has gone out of business.',
      initialTime: Math.floor(gameDuration * 0.50),
      urgentTime: Math.floor(gameDuration * 0.60),
      penaltyTime: Math.floor(gameDuration * 0.70)
    }
  ];

  const advanced = [
    {
      id: 'accessibility_disability_act',
      penaltyKey: 'DisabilityAct',
      initialMessage: 'Accessibility issue detected! The image in your homepage is missing its alt text. Add a descriptive alt attribute before the client sues for breaking the Disability Act!',
      urgentMessage: 'URGENT: Fix alt in img1 - Accessibility violation!',
      penaltyMessage: 'You are fined for breaking the Disability Act. Accessibility is not optional!',
      initialTime: Math.floor(gameDuration * 0.10),
      urgentTime: Math.floor(gameDuration * 0.15),
      penaltyTime: Math.floor(gameDuration * 0.20)
    },
    {
      id: 'input_validation_tort',
      penaltyKey: 'LawsOfTort_Validation',
      initialMessage: 'Validation issue detected! Your form accepts any text as an email. Add proper validation or risk violating the Laws of Tort for negligence!',
      urgentMessage: 'URGENT: Fix input validation - Tort violation!',
      penaltyMessage: 'You are fined for breaking the Laws of Tort. User data validation was missing!',
      initialTime: Math.floor(gameDuration * 0.20),
      urgentTime: Math.floor(gameDuration * 0.25),
      penaltyTime: Math.floor(gameDuration * 0.30)
    },
    {
      id: 'user_login_bankruptcy',
      penaltyKey: 'Bankruptcy',
      initialMessage: 'Your login button doesn\'t work! Customers can\'t access their accounts — fix this before your company declares bankruptcy!',
      urgentMessage: 'URGENT: Fix user login - Bankruptcy risk!',
      penaltyMessage: 'You have been declared bankrupt! No one can log in, and your app has gone out of business.',
      initialTime: Math.floor(gameDuration * 0.30),
      urgentTime: Math.floor(gameDuration * 0.35),
      penaltyTime: Math.floor(gameDuration * 0.40)
    },
    {
      id: 'secure_database_tort',
      penaltyKey: 'LawsOfTort_Database',
      initialMessage: 'Security alert! Your database connection is insecure. Encrypt passwords and secure the database before you get hacked!',
      urgentMessage: 'URGENT: Fix secure database - Security breach!',
      penaltyMessage: 'You got hacked and have broken the Laws of Tort for failing to secure your database.',
      initialTime: Math.floor(gameDuration * 0.40),
      urgentTime: Math.floor(gameDuration * 0.45),
      penaltyTime: Math.floor(gameDuration * 0.50)
    },
    {
      id: 'data_privacy_breach',
      penaltyKey: 'PrivacyBreach',
      initialMessage: 'Privacy alert! Your API response is leaking user passwords. Fix it immediately before you\'re sued for a privacy breach!',
      urgentMessage: 'URGENT: Fix data exposure - Privacy violation!',
      penaltyMessage: 'You violated user privacy and are fined for leaking sensitive data under the Data Protection Act!',
      initialTime: Math.floor(gameDuration * 0.50),
      urgentTime: Math.floor(gameDuration * 0.55),
      penaltyTime: Math.floor(gameDuration * 0.60)
    },
    {
      id: 'commented_security_negligence',
      penaltyKey: 'SecurityNegligence',
      initialMessage: 'Developer negligence detected! The login authentication code has been commented out. Uncomment it before unauthorized users exploit your system!',
      urgentMessage: 'URGENT: Uncomment authentication - Security risk!',
      penaltyMessage: 'You have been charged with negligence — authentication checks were disabled!',
      initialTime: Math.floor(gameDuration * 0.60),
      urgentTime: Math.floor(gameDuration * 0.65),
      penaltyTime: Math.floor(gameDuration * 0.70)
    }
  ];

  return { beginner, intermediate, advanced };
};

export const DISTRACTION_MESSAGES: Omit<Message, 'id' | 'isCritical' | 'penaltyKey' | 'timestamp' | 'gameTime' | 'messageType' | 'priority'>[] = [
  { source: 'Family', text: 'Can you pick up the kids after work? I have a late meeting.' },
  { source: 'Boss', text: 'Are you done with sprint 1? The client is asking for a demo.' },
  { source: 'Agile', text: 'Fix: change Title colour to Red per product owner request.' },
  { source: 'Family', text: 'Don\'t forget about dinner tonight!' },
  { source: 'Boss', text: 'The deadline is approaching, how is the project going?' },
  { source: 'Agile', text: 'We need to update the user interface design.' }
];

export const EASY_CODE = `
<div style="border:1px solid black; padding:10px;">
  <h3 style="color:blue;">User Profile (Easy)</h3>
  
  <img id="img1" src="/assets/banner.png">
  
  <label style="display:block; margin-top:10px;">Email:</label>
  <input type="text" id="email" value="bad-email" style="border:1px solid #ccc;">

  <button onclick="saveData()" style="background-color:gray; color:white; padding:5px 10px;">Save</button>
</div>

<script>
  function saveData() {
    const email = document.getElementById('email').value;
    console.log('Saving profile...');
    alert('Saved');
  }
</script>
`.trim();

export const MEDIUM_CODE = `
<div style="border:1px solid black; padding:10px;">
  <h3 style="color:blue;">User Profile (Medium)</h3>

  <img id="img1" src="/assets/banner.png">
  
  <label style="display:block; margin-top:10px;">Email:</label>
  <input type="text" id="email" value="bad-email" style="border:1px solid #ccc;">

  <button onclick="saveData()" style="background-color:gray; color:white; padding:5px 10px;">Save</button>

  <div style="margin-top:12px;">
    <label>Login:</label>
    <input id="login-username" placeholder="username"/>
    <input id="login-password" type="password" placeholder="password"/>
    <button id="loginBtn" disabled>Login</button>
  </div>
</div>

<script>
  function saveData() {
    const email = document.getElementById('email').value;
    console.log('Saving profile...');
    alert('Saved');
  }

  function login() {
    const u = document.getElementById('login-username').value;
    const p = document.getElementById('login-password').value;
    if (u && p) {
      alert('Logged in');
    }
  }
</script>
`.trim();

export const DIFFICULT_CODE = `
<div style="border:1px solid black; padding:10px;">
  <h3 style="color:blue;">User Profile (Difficult)</h3>

  <img id="img1" src="/assets/banner.png">
  
  <label style="display:block; margin-top:10px;">Email:</label>
  <input type="text" id="email" value="bad-email" style="border:1px solid #ccc;">

  <button onclick="saveData()" style="background-color:gray; color:white; padding:5px 10px;">Save</button>

  <div style="margin-top:12px;">
    <label>Login:</label>
    <input id="login-username" placeholder="username"/>
    <input id="login-password" type="password" placeholder="password"/>
    <button id="loginBtn" disabled>Login</button>
  </div>
</div>

<script>
  // Database connection
  const db = connect("insecure_database");

  function saveData() {
    const email = document.getElementById('email').value;
    console.log('Saving data to insecure database...');
    alert('Saved');
  }

  function login() {
    const u = document.getElementById('login-username').value;
    const p = document.getElementById('login-password').value;
    if (u && p) {
      alert('Logged in');
    }
  }

  // API endpoint
  function getUsers() {
    return [
      { username: "alex", password: "12345" },
      { username: "sam", password: "abcd" },
    ];
  }

  // Authentication check (commented out)
  // if (!isAuthenticated(user)) {
  //   throw new Error("Unauthorized access");
  // }
  console.log("Access granted");
</script>
`.trim();

export type Message = {
  id: number;
  source: 'Boss' | 'Family' | 'Agile' | 'Ethical/Legal' | 'Court Order';
  text: string;
  isCritical: boolean;
  penaltyKey?: 'DisabilityAct' | 'LawsOfTort_Validation' | 'LawsOfTort_Database' | 'Bankruptcy' | 'PENALTY' | 'Distraction';
  timestamp?: Date;
  gameTime?: number;
  messageType?: 'initial' | 'urgent' | 'distraction';
  priority?: 'low' | 'medium' | 'high' | 'critical';
};
