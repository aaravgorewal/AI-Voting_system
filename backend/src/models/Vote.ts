import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema(
  {
    voter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    election: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Election',
      required: true,
    },
    // Only the candidateId (subdocument _id) is stored, NOT the voter's choice directly
    // This way, the vote is anonymized — you can count votes per candidate
    // but cannot trace which voter chose which candidate from this schema alone.
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    // Cryptographic receipt hash returned to the voter for self-verification
    receiptHash: {
      type: String,
      required: true,
      unique: true,
    },
    votedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, // using votedAt explicitly
  }
);

// Compound unique index — enforces one vote per user per election at the DB level
voteSchema.index({ voter: 1, election: 1 }, { unique: true });

export default mongoose.model('Vote', voteSchema);
