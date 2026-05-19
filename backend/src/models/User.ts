import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';

export interface IUser extends Document {
  fullName: string;
  email: string;
  password?: string;
  role: 'user' | 'admin' | 'superadmin';
  profileImage?: string;
  faceRecognitionImage?: string;
  faceEncoding?: number[];
  isVerified: boolean;
  matchPassword(enteredPassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, 'Please add a full name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Security best practice: don't return password by default
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'superadmin'],
      default: 'user',
    },
    profileImage: {
      type: String,
      default: 'no-photo.jpg',
    },
    faceRecognitionImage: {
      type: String, // Path or URL to the encrypted reference image
    },
    faceEncoding: {
      type: [Number], // Array of 128 floats for face recognition
      select: false,  // Don't return by default
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password!, salt);
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as any
  };
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET as string, options);
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password!);
};

export default mongoose.model<IUser>('User', userSchema);
