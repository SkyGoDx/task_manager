
// Admin: Can manage tasks and users.
// User: Can only see tasks assigned to them, comment, and update task status.

const { User } = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = {
    getAllUsers: async (req, res) => {
        try {
            const userList = await User.find({});
            return res.json({
                result: 1,
                userList
            })
        } catch (e) {
            return res.status(500).json({result:0, msg:e.message})
        }
    },
    userLogin: async (req, res) => {
        const { username, password } = req.body;
        try {
          const user = await User.findOne({ username });
          if (!user) return res.status(400).json({ result: 0,message: 'Invalid credentials' });
      
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
      
          const token = jwt.sign({ id: user._id, password: password }, 
            process.env.JWT_SECRET, { expiresIn: '1h' }
        );
          res.status(200).json({ token, user });
        } catch (e) {
          res.status(500).json({ message: e.message });
        }
    },
    createNewUser: async (req, res) => {
        const { username, password, role } = req.body;
        // check if user already exist
        const user = await User.findOne({
            username
        });
        console.log(user)
        if(user) return res.status(500).json({
            result: 1,
            msg: "user already exist"
        });
        // if not create new
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log(hashedPassword)
        try {
            const newUser =  new User({
                username,
                password: hashedPassword,
                role
            });
            await newUser.save();
            return res.json({
                result: 1,
                msg: "user created successfully"
            })
        } catch (e) {
            console.log(e)
            return res.json({
                result: 0,
                msg: e.message
            })
        }
    }
}