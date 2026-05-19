// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Voting {
    struct Candidate {
        string id;
        string name;
        uint256 voteCount;
    }

    struct Election {
        string id;
        string title;
        bool isActive;
        mapping(string => Candidate) candidates;
        string[] candidateIds;
        mapping(address => bool) hasVoted;
        uint256 totalVotes;
    }

    address public owner;
    
    // Mapping from election ID (string) to Election struct
    mapping(string => Election) public elections;

    // Events
    event ElectionCreated(string electionId, string title);
    event CandidateAdded(string electionId, string candidateId, string name);
    event VoteCasted(string electionId, address voter, string candidateId);
    event ElectionStatusChanged(string electionId, bool isActive);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier electionExists(string memory _electionId) {
        require(bytes(elections[_electionId].id).length != 0, "Election does not exist");
        _;
    }

    modifier electionActive(string memory _electionId) {
        require(elections[_electionId].isActive, "Election is not active");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createElection(string memory _electionId, string memory _title) public onlyOwner {
        require(bytes(elections[_electionId].id).length == 0, "Election already exists");
        
        Election storage newElection = elections[_electionId];
        newElection.id = _electionId;
        newElection.title = _title;
        newElection.isActive = true;
        
        emit ElectionCreated(_electionId, _title);
    }

    function addCandidate(string memory _electionId, string memory _candidateId, string memory _name) 
        public 
        onlyOwner 
        electionExists(_electionId) 
    {
        Election storage election = elections[_electionId];
        require(bytes(election.candidates[_candidateId].id).length == 0, "Candidate already exists");

        election.candidates[_candidateId] = Candidate({
            id: _candidateId,
            name: _name,
            voteCount: 0
        });
        election.candidateIds.push(_candidateId);

        emit CandidateAdded(_electionId, _candidateId, _name);
    }

    function castVote(string memory _electionId, string memory _candidateId) 
        public 
        electionExists(_electionId) 
        electionActive(_electionId) 
    {
        Election storage election = elections[_electionId];
        
        require(!election.hasVoted[msg.sender], "You have already voted in this election");
        require(bytes(election.candidates[_candidateId].id).length != 0, "Candidate does not exist");

        // Record vote
        election.hasVoted[msg.sender] = true;
        election.candidates[_candidateId].voteCount += 1;
        election.totalVotes += 1;

        emit VoteCasted(_electionId, msg.sender, _candidateId);
    }

    function getCandidateVoteCount(string memory _electionId, string memory _candidateId) 
        public 
        view 
        electionExists(_electionId) 
        returns (uint256) 
    {
        return elections[_electionId].candidates[_candidateId].voteCount;
    }

    function getTotalVotes(string memory _electionId) 
        public 
        view 
        electionExists(_electionId) 
        returns (uint256) 
    {
        return elections[_electionId].totalVotes;
    }

    function hasAddressVoted(string memory _electionId, address _voter) 
        public 
        view 
        electionExists(_electionId) 
        returns (bool) 
    {
        return elections[_electionId].hasVoted[_voter];
    }

    function setElectionStatus(string memory _electionId, bool _isActive) 
        public 
        onlyOwner 
        electionExists(_electionId) 
    {
        elections[_electionId].isActive = _isActive;
        emit ElectionStatusChanged(_electionId, _isActive);
    }
}
