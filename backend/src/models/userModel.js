import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const userSchema = mongoose.Schema(
    {
        firstName: { type: String, required: [true, 'First Name is required'] },
        lastName: { type: String, required: [true, 'Last Name is required'] },
        avatar: { type: String },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: [true, 'Email already exists'],
            lowercase: true,
            validate: [validator.isEmail, 'Invalid Email'],
        },
        activityStatus: {
            type: String,
            default: 'Hey There! I ❤️ Using Convia Chat 😸',
        },
        onlineStatus: {
            type: String,
            default: 'offline',
            enum: ['online', 'offline'],
        },

        password: { type: String, required: [true, 'Password is required'] },
        passwordChangedAt: { type: Date },

        verified: { type: Boolean, default: false },

        friends: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],

        socialsConnected: {
            type: [String],
            enum: ['google', 'github', 'linkedin'],
        },
    },
    {
        timestamps: true,
    },
);

// Hash the password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) return;
    this.password = await bcrypt.hash(this.password, 14);
});

userSchema.pre('save', async function () {
    if (this.friends.length === 0) {
        this.friends.push(this._id);
    }
});

// Compare plain-text password with hashed password in DB
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
