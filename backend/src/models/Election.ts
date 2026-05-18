import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  party:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  image:       { type: String, default: '' },
  voteCount:   { type: Number, default: 0 },
});

const electionSchema = new mongoose.Schema(
  {
    title:       { type: String, required: [true, 'Election title is required'], trim: true, maxlength: 100 },
    description: { type: String, required: [true, 'Description is required'], maxlength: 1000 },
    status: {
      type: String,
      enum: ['draft', 'active', 'ended'],
      default: 'draft',
    },
    startDate: { type: Date, required: [true, 'Start date is required'] },
    endDate:   { type: Date, required: [true, 'End date is required'] },
    candidates: [candidateSchema],
    createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    totalVotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Ensure end date is always after start date
electionSchema.pre('save', function (next) {
  if (this.endDate <= this.startDate) {
    throw new Error('End date must be after start date');
  }
  next();
});

export default mongoose.model('Election', electionSchema);
