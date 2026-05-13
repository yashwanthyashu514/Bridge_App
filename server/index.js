require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://bridge-app-admin.vercel.app",
  "https://bridge-app-parent.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors());



app.use(express.json());

// Routes
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/admin',       require('./routes/admin'));
app.use('/api/teacher',     require('./routes/teacher'));
app.use('/api/student',     require('./routes/student'));
app.use('/api/management',  require('./routes/management'));
app.use('/api/parent',      require('./routes/parent'));
app.use('/api/common',      require('./routes/common'));

app.get('/', (req, res) => res.json({ message: 'Bridge App API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
