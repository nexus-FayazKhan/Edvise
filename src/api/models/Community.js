import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 500
  },
  icon: {
    type: String,
    default: '📚',
    enum: ['📚', '💻', '🎨', '🎮', '🎵', '🔬', '🌟']
  },
  owner: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Validate Clerk user ID format
        return typeof v === 'string' && v.startsWith('user_');
      },
      message: props => `${props.value} is not a valid Clerk user ID!`
    }
  },
  members: [{
    user: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          // Validate Clerk user ID format
          return typeof v === 'string' && v.startsWith('user_');
        },
        message: props => `${props.value} is not a valid Clerk user ID!`
      }
    },
    role: {
      type: String,
      enum: ['admin', 'moderator', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  channels: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['text', 'voice'],
      default: 'text'
    },
    messages: [{
      sender: {
        type: String,
        required: true
      },
      content: {
        type: String,
        required: true,
        trim: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      attachments: [{
        type: {
          type: String,
          enum: ['image', 'file', 'video']
        },
        url: String
      }]
    }]
  }],
  settings: {
    isPrivate: {
      type: Boolean,
      default: false
    },
    allowInvites: {
      type: Boolean,
      default: true
    },
    defaultRole: {
      type: String,
      enum: ['member', 'moderator'],
      default: 'member'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  methods: {
    isMember(userId) {
      return this.members.some(member => member.user === userId);
    },
    isAdmin(userId) {
      return this.members.some(member => member.user === userId && member.role === 'admin');
    },
    getUserRole(userId) {
      const member = this.members.find(member => member.user === userId);
      return member ? member.role : null;
    }
  }
});

// Add indexes for better query performance
communitySchema.index({ name: 'text', description: 'text' });

communitySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Community = mongoose.model('Community', communitySchema);

export default Community;
