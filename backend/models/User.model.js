import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    phone: { type: String, required: true },
    dietary_restrictions: { type: String, required: true, enum: ['Hypertension', 'Diabetes', 'Lactose Intolerance', 'Vegan', 'High Protein Diet', 'Anti Inflammatory Diet', 'Celiac Disease', 'Renal Diet', 'Ulcers Diet' ] },
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);
export default User;