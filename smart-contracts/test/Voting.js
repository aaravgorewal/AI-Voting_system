const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting Contract", function () {
  let Voting;
  let voting;
  let owner;
  let addr1;
  let addr2;
  
  const ELECTION_ID = "election-2026";
  const CANDIDATE_1_ID = "cand-1";
  const CANDIDATE_2_ID = "cand-2";

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
    await voting.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await voting.owner()).to.equal(owner.address);
    });
  });

  describe("Election Management", function () {
    it("Should create a new election", async function () {
      await voting.createElection(ELECTION_ID, "Presidential Election 2026");
      const election = await voting.elections(ELECTION_ID);
      expect(election.id).to.equal(ELECTION_ID);
      expect(election.title).to.equal("Presidential Election 2026");
      expect(election.isActive).to.be.true;
    });

    it("Should add candidates to an election", async function () {
      await voting.createElection(ELECTION_ID, "Presidential Election 2026");
      await voting.addCandidate(ELECTION_ID, CANDIDATE_1_ID, "Alice");
      
      const count = await voting.getCandidateVoteCount(ELECTION_ID, CANDIDATE_1_ID);
      expect(count).to.equal(0);
    });
  });

  describe("Voting", function () {
    beforeEach(async function () {
      await voting.createElection(ELECTION_ID, "Presidential Election 2026");
      await voting.addCandidate(ELECTION_ID, CANDIDATE_1_ID, "Alice");
      await voting.addCandidate(ELECTION_ID, CANDIDATE_2_ID, "Bob");
    });

    it("Should allow a user to cast a vote", async function () {
      await voting.connect(addr1).castVote(ELECTION_ID, CANDIDATE_1_ID);
      
      expect(await voting.getCandidateVoteCount(ELECTION_ID, CANDIDATE_1_ID)).to.equal(1);
      expect(await voting.getTotalVotes(ELECTION_ID)).to.equal(1);
      expect(await voting.hasAddressVoted(ELECTION_ID, addr1.address)).to.be.true;
    });

    it("Should not allow a user to vote twice", async function () {
      await voting.connect(addr1).castVote(ELECTION_ID, CANDIDATE_1_ID);
      
      await expect(
        voting.connect(addr1).castVote(ELECTION_ID, CANDIDATE_2_ID)
      ).to.be.revertedWith("You have already voted in this election");
    });

    it("Should not allow voting if election is inactive", async function () {
      await voting.setElectionStatus(ELECTION_ID, false);
      
      await expect(
        voting.connect(addr1).castVote(ELECTION_ID, CANDIDATE_1_ID)
      ).to.be.revertedWith("Election is not active");
    });
  });
});
