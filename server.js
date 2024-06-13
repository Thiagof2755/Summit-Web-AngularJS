const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const bodyParser = require('body-parser');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const SECRET_KEY = '123456789';
const expiresIn = '1h';

// Create a token from a payload
function createToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// Verify the token
function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (err) {
        return null;
    }
}

// Check if the user exists in database
function isAuthenticated({ email, password }) {
    const userdb = JSON.parse(fs.readFileSync('./db.json', 'UTF-8')).users;
    return userdb.findIndex(user => user.email === email && user.password === password) !== -1;
}

server.use(middlewares);
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// Register New User
server.post('/register', (req, res) => {
    const { email, password, name } = req.body;
    const userdb = JSON.parse(fs.readFileSync('./db.json', 'UTF-8')).users;

    if (isAuthenticated({ email, password })) {
        const status = 401;
        const message = 'Email and Password already exist';
        res.status(status).json({ status, message });
        return;
    }

    const newUser = { id: userdb.length + 1, email, password, name };
    userdb.push(newUser);
    fs.writeFileSync('./db.json', JSON.stringify({ users: userdb }, null, 2));

    const token = createToken({ email, name });
    res.status(200).json({ token, name });
});

// Login User
server.post('/login', (req, res) => {
    const { email, password } = req.body;
    const userdb = JSON.parse(fs.readFileSync('./db.json', 'UTF-8')).users;

    if (!isAuthenticated({ email, password })) {
        const status = 401;
        const message = 'Incorrect email or password';
        res.status(status).json({ status, message });
        return;
    }

    const user = userdb.find(u => u.email === email && u.password === password);
    const token = createToken({ email, name: user.name });
    res.status(200).json({ token, name: user.name });
});

// Use custom routes before json-server router
server.use('/api', router);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`JSON Server is running on port ${PORT}`);
});
