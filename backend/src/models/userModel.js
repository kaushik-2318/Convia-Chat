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
        passwordResetToken: { type: String },
        passwordResetExpires: { type: Date },
        passwordResetLastSent: { type: Date },

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

userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) return;
    this.password = await bcrypt.hash(this.password, 14);
});

userSchema.pre('save', async function () {
    if (!this.isModified('otp') || !this.otp) return;
    this.otp = await bcrypt.hash(this.otp.toString(), 14);
});

userSchema.pre('save', async function () {
    if (this.friends.length === 0) {
        this.friends.push(this._id);
    }
});

userSchema.pre('save', async function () {
    if (!this.isModified('password') || this.isNew || !this.password) return;
    this.passwordChangedAt = Date.now() - 1000;
});

userSchema.methods.correctPassword = async function (canditatePassword, userPassword) {
    return await bcrypt.compare(canditatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimeStamp < changedTimeStamp;
    }
    return false;
};

userSchema.methods.createPasswordResetToken = async function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
