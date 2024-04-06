const express = require('express')
const http = require("http");
var cors = require('cors');
const cloudinary = require('cloudinary').v2;
const { Resend } = require('resend');
const generateToken = require('./config/generateToken');

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());

// Database
const connectDB = require('./config/db');
connectDB();

// cloudinary
const { storage } = require('./config/storage');
const multer = require('multer');
const upload = multer({ storage });

// Schema
const User = require('./Models/userModel');


// signup end point
app.post('/api/user/SignUp', async (req, res) => {
    const { name, email, userName, password } = req.body;

    if (!name || !email || !userName || !password) {
        return res.status(400).json({ message: "fill all required details" })
    }

    const userExist = await User.findOne({ email: email });
    if (userExist) {
        return res.status(400).json({ message: "Email already associated to existing user", "user": userExist })
    }

    try {
        const newUser = await User.create({ name: name, email: email, userName: userName, password: password, onBoarding: false });

        const user = await User.findById(newUser._id);
        res.status(201).send({
            message: "User created sucessfully",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.profileUrl,
                token: generateToken(user._id),
                onBoarding: user.onBoarding,
            },
        })

    } catch (error) {
        res.status(400).json({ message: "User not created" })
    }
})

// login up
app.post('/api/user/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.profileUrl,
            password: user.password,
            token: generateToken(user._id),
            onBoarding: user.onBoarding,
        })
    } else {
        res.status(400).json({ message: "Invalid Email or password" })
    }
});

// update details using image file
app.put('/api/user/updatePic', upload.single('image'), async (req, res) => {
    const { location, userId, role } = req.body;
    userId && await cloudinary.uploader.upload(req?.file?.path, { folder: 'InternProject' }, async function (err, result) {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: err
            })
        } else {
            if (result.secure_url != undefined) {
                try {
                    const updatedContent = await User.findByIdAndUpdate(userId, { profileUrl: result.secure_url, location: location, onBoardingRole: role, onBoarding: true }, { new: true });
                    if (!updatedContent) {
                        return res.status(400).send({
                            message: "Error user not found", "data": {
                                _id: updatedContent._id,
                                name: updatedContent.name,
                                email: updatedContent.email,
                                pic: updatedContent.profileUrl,
                                token: generateToken(updatedContent._id),
                                onBoarding: updatedContent.onBoarding,
                            }
                        })
                    }
                    res.status(200).send({
                        message: "Pic and location updated sucessfully", "data": {
                            _id: updatedContent._id,
                            name: updatedContent.name,
                            email: updatedContent.email,
                            pic: updatedContent.profileUrl,
                            token: generateToken(updatedContent._id),
                            onBoarding: updatedContent.onBoarding,
                        }
                    })
                } catch (error) {
                    res.status(401).send({ message: "Error in making entry in database", error })
                }
            } else {
                res.status(401);
            }
        }
    })
});

// update details without image file
app.put('/api/user/updateDetails', async (req, res) => {
    const { location, userId, role, image } = req.body;
    try {
        const updatedContent = await User.findByIdAndUpdate(userId, { profileUrl: image, location: location, onBoardingRole: role, onBoarding: true }, { new: true });

        if (!updatedContent) {
            return res.status(401).send({
                message: "Error user not found", "data": {
                    _id: updatedContent._id,
                    name: updatedContent.name,
                    email: updatedContent.email,
                    pic: updatedContent.profileUrl,
                    token: generateToken(updatedContent._id),
                    onBoarding: updatedContent.onBoarding,
                }
            })
        }
        res.status(200).send({
            message: "Pic and location updated sucessfully", "data": {
                _id: updatedContent._id,
                name: updatedContent.name,
                email: updatedContent.email,
                pic: updatedContent.profileUrl,
                token: generateToken(updatedContent._id),
                onBoarding: updatedContent.onBoarding,
            }
        })
    } catch (error) {
        res.status(401).send({ message: "Error in making entry in database", error })
    }
});

app.post('/api/sendEmail', async (req, res) => {
    const { userEmail } = req.body;
    if (!userEmail) {
        return res.status(400).send({ message: "Email not found" })
    }

    const resend = new Resend(process.env.RESENT_KEY);
    const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        /*
         due to free tier restrictions in resend, I'am using my own gmail to recieve emails
         */
        // to: [userEmail]   //  use to send email to users email id
        to: ['ayushbahuguna1122@gmail.com'],

        subject: 'Thank you for Logging in GitInit',
        html: `Hi there,<br/>Just a quick note to say thank you for logging in to GitInit! Your engagement means a lot to us. If you have any questions or feedback, feel free to reach out.<br/><br/>Best regards,<br/>GitInit team`,
    });
    error ? res.status(400).json({ message: "Error", error })
        : res.status(200).json({ message: "sucessfully sent", data: data })
});


server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
});

