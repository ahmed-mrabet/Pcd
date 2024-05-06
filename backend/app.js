import express from "express";
import { findUserByUsernameAndRole, generateWalletAddress, registerUser } from "./database.js";
import cors from "cors";
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use(cors());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(3000, () => {
    console.log('App listening on port 3000');
});

// Function to generate wallet address based on user's role
app.post('/SignUp', async (req, res) => {
    const { name, lastname, username, password, role } = req.body;
    try {
        const user = await registerUser(name, lastname, username, password, role);
        const walletAddress=generateWalletAddress(role);
        
        res.status(201).json({ message: 'User registered successfully', user,role, walletAddress });
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Endpoint for user login
app.post('/login', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const user = await findUserByUsernameAndRole(username, role);

        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ username: user.username, role: user.role }, 'your_secret_key');
        const walletAddress = generateWalletAddress(role);

        res.status(200).json({ token, role,walletAddress });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
