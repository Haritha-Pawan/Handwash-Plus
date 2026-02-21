import mongoose from 'mongoose';

import {ROLES} from '../../@core/constants/roles.constants';


const userSchema = new mongoose.Schema({
      firstName: {
    type: String,
    required: true,
    trim: true
  },

    lastName: {
    type: String,
    required: true,
    trim: true
  },

    email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

   password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  },

  role: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.STAFF
  },

    schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: function() {
      return this.role !== ROLES.SUPER_ADMIN;
    }
  },

    isBlocked: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  refreshToken: {
    type: String,
    select: false
  },
  passwordChangedAt: {
    type: Date
  },
  passwordResetToken: String,
  passwordResetExpires: Date
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ schoolId: 1, role: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Methods
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.refreshToken;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  return user;
};

userSchema.methods.isPasswordChanged = function(jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return jwtTimestamp < changedTimestamp;
  }
  return false;
};

export const User = mongoose.model('User', userSchema);
