// script.js
// Single-file Mongoose seed + schema + CRUD + aggregations
// Usage: set MONGODB_URI env or replace the placeholder then run `node script.js`

import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const MONGODB_URI = "mongodb+srv://ActivityTrackerUser:ActivityTrackerPass@cluster0.2sjmnf6.mongodb.net/";
const DB_NAME = "customer-service";

async function main() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
    console.log("Connected to MongoDB via Mongoose.");

    // ------------------------
    // Schemas & Models
    // ------------------------

    const supervisorSchema = new Schema({
      department: { type: String },
      email: { type: String },
      name: { type: String },
      role: { type: String},
      password: { type: String },
      updatedAt: { type: Date }
    }, { collection: "supervisors" });

    const agentSchema = new Schema({
      department: { type: String },
      email: { type: String },
      isActive: { type: Boolean},
      name: { type: String },
      role: { type: String },
      password: { type: String},
      supervisorID: { type: Schema.Types.ObjectId, ref: "Supervisor" },
      updatedAt: { type: Date }
    }, { collection: "agents" });

    const clientSchema = new Schema({
      email: { type: String},
      firstName: { type: String },
      lastName: { type: String },
      phone: { type: String },
      password: { type: String},
      updatedAt: { type: Date }
    }, { collection: "clients" });

    // unique index on client email
    clientSchema.index({ email: 1 }, { unique: true });

    const actionProtocolSchema = new Schema({
      agentID: { type: Schema.Types.ObjectId, ref: "Agent" },
      action: { type: String },
      type: { type: String },
      timestamp: { type: Date }
    }, { collection: "action_protocols" });

    actionProtocolSchema.index({ agentID: 1, timestamp: -1 });

    const logSubSchema = new Schema({
      performedBy: { type: Schema.Types.ObjectId, ref: "Supervisor" },
      protocolID: { type: Schema.Types.ObjectId, ref: "ActionProtocol" },
      timestamp: { type: Date }
    }, { _id: false });

    const caseSchema = new Schema({
      assignedAgentID: { type: Schema.Types.ObjectId, ref: "Agent" },
      clientID: { type: Schema.Types.ObjectId, ref: "Client" },
      case_description: { type: String },
      case_status: { type: String},
      createdAt: { type: Date },
      updatedAt: { type: Date },
      logs: { type: logSubSchema, default: null }
    }, { collection: "cases" });

// Index to speed queries by agent and status
    caseSchema.index({ assignedAgentID: 1, case_status: 1 });

    // Custom validator: logs must be present when case_status === 'solved' and must be null otherwise
    caseSchema.pre("validate", function () {
  if (this.case_status === "solved") {
    if (!this.logs) {
      throw new Error("logs must be present when case_status is 'solved'");
    }
  } else {
    this.logs = null;
  }
});


    // Models
    const Supervisor = mongoose.model("Supervisor", supervisorSchema);
    const Agent = mongoose.model("Agent", agentSchema);
    const Client = mongoose.model("Client", clientSchema);
    const ActionProtocol = mongoose.model("ActionProtocol", actionProtocolSchema);
    const Case = mongoose.model("Case", caseSchema);

    // ------------------------
    // Clean start for repeatable runs
    // ------------------------
    // Drop existing collections if they exist (safe for development)
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collNames = collections.map(c => c.name);
    for (const name of ["supervisors","agents","clients","action_protocols","cases"]) {
      if (collNames.includes(name)) {
        await mongoose.connection.db.dropCollection(name);
        console.log(`Dropped existing collection ${name}`);
      }
    }

    // ------------------------
    // Create documents (10 each) with explicit ObjectIds for consistent referencing
    // ------------------------

    const genId = () => new Types.ObjectId();

    // Supervisors (10)
    const supervisors = [
      { _id: genId(), department: "Customer Success", email: "laila.hassan@company.com", name: "Laila Hassan", role: 'Head Supervisor', password: "passLaila1", updatedAt: new Date("2025-10-28T09:00:00Z") },
      { _id: genId(), department: "Security", email: "amr.kamal@company.com", name: "Amr Kamal", role: 'Senior Supervisor', password: "passAmr1", updatedAt: new Date("2025-11-01T10:30:00Z") },
      { _id: genId(), department: "Fraud", email: "dina.elsayed@company.com", name: "Dina Elsayed", role: 'Supervisor', password: "passDina1", updatedAt: new Date("2025-11-02T13:20:00Z") },
      { _id: genId(), department: "Operations", email: "mohamed.gaber@company.com", name: "Mohamed Gaber", role: 'Head Supervisor', password: "passMoh1", updatedAt: new Date("2025-11-05T08:00:00Z") },
      { _id: genId(), department: "Customer Success", email: "sara.fahmy@company.com", name: "Sara Fahmy", role: 'Senior Supervisor', password: "passSara1", updatedAt: new Date("2025-11-06T11:45:00Z") },
      { _id: genId(), department: "Compliance", email: "khaled.mahfouz@company.com", name: "Khaled Mahfouz", role: 'Head Supervisor', password: "passKhaled1", updatedAt: new Date("2025-11-07T14:15:00Z") },
      { _id: genId(), department: "Security", email: "yasmin.nabil@company.com", name: "Yasmin Nabil", role: 'Supervisor', password: "passYasmin1", updatedAt: new Date("2025-11-08T09:40:00Z") },
      { _id: genId(), department: "Operations", email: "tamer.hassan@company.com", name: "Tamer Hassan", role: 'Senior Supervisor', password: "passTamer1", updatedAt: new Date("2025-11-09T16:00:00Z") },
      { _id: genId(), department: "Client Onboarding", email: "mona.elkhateeb@company.com", name: "Mona El-Khateeb", role: 'Head Supervisor', password: "passMona1", updatedAt: new Date("2025-11-10T12:30:00Z") },
      { _id: genId(), department: "Compliance", email: "omar.eldeeb@company.com", name: "Omar El-Deeb", role: 'Senior Supervisor', password: "passOmar1", updatedAt: new Date("2025-11-11T07:20:00Z") },
    ];

    // Agents (10)
    const agents = [
  {
    _id: genId(),
    department: "Customer Success",
    email: "ahmed.salem@company.com",
    isActive: true,
    name: "Ahmed Salem",
    role: "Agent",
    password: "agentA1",
    updatedAt: new Date("2025-11-20T09:00:00Z"),
    supervisorID: supervisors[0]._id // Laila Hassan (Customer Success)
  },
  {
    _id: genId(),
    department: "Customer Success",
    email: "nora.mostafa@company.com",
    isActive: true,
    name: "Nora Mostafa",
    role: "Senior Agent",
    password: "agentN1",
    updatedAt: new Date("2025-11-21T09:20:00Z"),
    supervisorID: supervisors[4]._id // Sara Fahmy (Customer Success)
  },
  {
    _id: genId(),
    department: "Fraud",
    email: "hassan.ismail@company.com",
    isActive: false,
    name: "Hassan Ismail",
    role: "Agent",
    password: "agentH1",
    updatedAt: new Date("2025-11-22T10:00:00Z"),
    supervisorID: supervisors[2]._id // Dina Elsayed (Fraud)
  },
  {
    _id: genId(),
    department: "Security",
    email: "noha.samir@company.com",
    isActive: true,
    name: "Noha Samir",
    role: "Agent",
    password: "agentNo1",
    updatedAt: new Date("2025-11-23T11:00:00Z"),
    supervisorID: supervisors[1]._id // Amr Kamal (Security)
  },
  {
    _id: genId(),
    department: "Operations",
    email: "ramy.abdel@company.com",
    isActive: true,
    name: "Ramy Abdel",
    role: "Agent",
    password: "agentR1",
    updatedAt: new Date("2025-11-24T12:00:00Z"),
    supervisorID: supervisors[3]._id // Mohamed Gaber (Operations)
  },
  {
    _id: genId(),
    department: "Compliance",
    email: "fatma.hany@company.com",
    isActive: true,
    name: "Fatma Hany",
    role: "Agent",
    password: "agentF1",
    updatedAt: new Date("2025-11-25T13:00:00Z"),
    supervisorID: supervisors[5]._id // Khaled Mahfouz (Compliance)
  },
  {
    _id: genId(),
    department: "Client Onboarding",
    email: "hoda.mostafa@company.com",
    isActive: true,
    name: "Hoda Mostafa",
    role: "Agent",
    password: "agentHo1",
    updatedAt: new Date("2025-11-26T14:00:00Z"),
    supervisorID: supervisors[8]._id // Mona El-Khateeb (Onboarding)
  },
  {
    _id: genId(),
    department: "Customer Success",
    email: "yasser.mohamed@company.com",
    isActive: false,
    name: "Yasser Mohamed",
    role: "Agent",
    password: "agentY1",
    updatedAt: new Date("2025-11-27T15:00:00Z"),
    supervisorID: supervisors[0]._id // Laila Hassan (Customer Success)
  },
  {
    _id: genId(),
    department: "Security",
    email: "salma.nagy@company.com",
    isActive: true,
    name: "Salma Nagy",
    role: "Agent",
    password: "agentS1",
    updatedAt: new Date("2025-11-28T16:00:00Z"),
    supervisorID: supervisors[1]._id // Amr Kamal (Security)
  },
  {
    _id: genId(),
    department: "Operations",
    email: "mostafa.a@company.com",
    isActive: true,
    name: "Mostafa Ahmed",
    role: "Agent",
    password: "agentM1",
    updatedAt: new Date("2025-11-29T17:00:00Z"),
    supervisorID: supervisors[7]._id // Tamer Hassan (Operations)
  }
];


    // Clients (10)
    const clients = [
      { _id: genId(), email: "client1@example.com", firstName: "Omar", lastName: "Ali", phone: "+201001234567", password: "client1pw", updatedAt: new Date("2025-11-01T09:00:00Z") },
      { _id: genId(), email: "client2@example.com", firstName: "Mariam", lastName: "Hassan", phone: "+201002345678", password: "client2pw", updatedAt: new Date("2025-11-02T10:00:00Z") },
      { _id: genId(), email: "client3@example.com", firstName: "Khaled", lastName: "Ibrahim", phone: "+201003456789", password: "client3pw", updatedAt: new Date("2025-11-03T11:00:00Z") },
      { _id: genId(), email: "client4@example.com", firstName: "Dalia", lastName: "Nour", phone: "+201004567890", password: "client4pw", updatedAt: new Date("2025-11-04T12:00:00Z") },
      { _id: genId(), email: "client5@example.com", firstName: "Hatem", lastName: "Fekry", phone: "+201005678901", password: "client5pw", updatedAt: new Date("2025-11-05T13:00:00Z") },
      { _id: genId(), email: "client6@example.com", firstName: "Rania", lastName: "Saeed", phone: "+201006789012", password: "client6pw", updatedAt: new Date("2025-11-06T14:00:00Z") },
      { _id: genId(), email: "client7@example.com", firstName: "Tamer", lastName: "Gamal", phone: "+201007890123", password: "client7pw", updatedAt: new Date("2025-11-07T15:00:00Z") },
      { _id: genId(), email: "client8@example.com", firstName: "Lina", lastName: "Youssef", phone: "+201008901234", password: "client8pw", updatedAt: new Date("2025-11-08T16:00:00Z") },
      { _id: genId(), email: "client9@example.com", firstName: "Walid", lastName: "Hafez", phone: "+201009012345", password: "client9pw", updatedAt: new Date("2025-11-09T17:00:00Z") },
      { _id: genId(), email: "client10@example.com", firstName: "Heba", lastName: "Nabil", phone: "+201010123456", password: "client10pw", updatedAt: new Date("2025-11-10T18:00:00Z") },
    ];

    // Action Protocols (10) - each linked to an agent
    const protocols = [
      { _id: genId(), agentID: agents[0]._id, action: "Initial Contact", type: "Call", timestamp: new Date("2025-11-20T09:05:00Z") },
      { _id: genId(), agentID: agents[1]._id, action: "Escalation", type: "Email", timestamp: new Date("2025-11-21T10:15:00Z") },
      { _id: genId(), agentID: agents[2]._id, action: "Investigation", type: "Review", timestamp: new Date("2025-11-22T11:30:00Z") },
      { _id: genId(), agentID: agents[3]._id, action: "Resolution", type: "Update", timestamp: new Date("2025-11-23T12:45:00Z") },
      { _id: genId(), agentID: agents[4]._id, action: "Follow-up", type: "Call", timestamp: new Date("2025-11-24T13:00:00Z") },
      { _id: genId(), agentID: agents[5]._id, action: "Document Upload", type: "Upload", timestamp: new Date("2025-11-25T14:20:00Z") },
      { _id: genId(), agentID: agents[6]._id, action: "Onboarding", type: "Meeting", timestamp: new Date("2025-11-26T15:40:00Z") },
      { _id: genId(), agentID: agents[7]._id, action: "Account Review", type: "Review", timestamp: new Date("2025-11-27T16:10:00Z") },
      { _id: genId(), agentID: agents[8]._id, action: "Security Check", type: "Audit", timestamp: new Date("2025-11-28T17:25:00Z") },
      { _id: genId(), agentID: agents[9]._id, action: "Final Close", type: "Close", timestamp: new Date("2025-11-29T18:35:00Z") },
    ];

    // Cases (10) - only solved cases include logs
    const cases = [
      {
        _id: genId(),
        assignedAgentID: agents[0]._id,
        clientID: clients[0]._id,
        case_description: "Payment failed but amount debited.",
        case_status: "solved",
        createdAt: new Date("2025-11-20T08:30:00Z"),
        updatedAt: new Date("2025-11-20T09:10:00Z"),
        logs: { performedBy: supervisors[0]._id, protocolID: protocols[0]._id, timestamp: new Date("2025-11-20T09:05:00Z") }
      },
      {
        _id: genId(),
        assignedAgentID: agents[1]._id,
        clientID: clients[1]._id,
        case_description: "Account verification issue.",
        case_status: "pending",
        createdAt: new Date("2025-11-21T09:00:00Z"),
        updatedAt: new Date("2025-11-21T10:20:00Z"),
        logs: null
      },
      {
        _id: genId(),
        assignedAgentID: agents[2]._id,
        clientID: clients[2]._id,
        case_description: "Suspicious login activity.",
        case_status: "pending",
        createdAt: new Date("2025-11-22T10:00:00Z"),
        updatedAt: new Date("2025-11-22T11:45:00Z"),
        logs: null
      },
      {
        _id: genId(),
        assignedAgentID: agents[3]._id,
        clientID: clients[3]._id,
        case_description: "Refund request processed incorrectly.",
        case_status: "solved",
        createdAt: new Date("2025-11-23T11:00:00Z"),
        updatedAt: new Date("2025-11-23T12:50:00Z"),
        logs: { performedBy: supervisors[3]._id, protocolID: protocols[3]._id, timestamp: new Date("2025-11-23T12:45:00Z") }
      },
      {
        _id: genId(),
        assignedAgentID: null,
        clientID: clients[4]._id,
        case_description: "Incorrect billing amount.",
        case_status: "unsolved",
        createdAt: new Date("2025-11-24T12:00:00Z"),
        updatedAt: new Date("2025-11-24T13:05:00Z"),
        logs: null
      },
      {
        _id: genId(),
        assignedAgentID: agents[5]._id,
        clientID: clients[5]._id,
        case_description: "KYC documents missing.",
        case_status: "pending",
        createdAt: new Date("2025-11-25T13:30:00Z"),
        updatedAt: new Date("2025-11-25T14:25:00Z"),
        logs: null
      },
      {
        _id: genId(),
        assignedAgentID: agents[6]._id,
        clientID: clients[6]._id,
        case_description: "New account onboarding delay.",
        case_status: "pending",
        createdAt: new Date("2025-11-26T14:10:00Z"),
        updatedAt: new Date("2025-11-26T15:05:00Z"),
        logs: null
      },
      {
        _id: genId(),
        assignedAgentID: agents[7]._id,
        clientID: clients[7]._id,
        case_description: "Account activity review requested.",
        case_status: "solved",
        createdAt: new Date("2025-11-27T15:00:00Z"),
        updatedAt: new Date("2025-11-27T16:20:00Z"),
        logs: { performedBy: supervisors[7]._id, protocolID: protocols[7]._id, timestamp: new Date("2025-11-27T16:10:00Z") }
      },
      {
        _id: genId(),
        assignedAgentID: agents[8]._id,
        clientID: clients[8]._id,
        case_description: "Password reset not functioning.",
        case_status: "solved",
        createdAt: new Date("2025-11-28T16:10:00Z"),
        updatedAt: new Date("2025-11-28T17:30:00Z"),
        logs: { performedBy: supervisors[8]._id, protocolID: protocols[8]._id, timestamp: new Date("2025-11-28T17:25:00Z") }
      },
      {
        _id: genId(),
        assignedAgentID: agents[9]._id,
        clientID: clients[9]._id,
        case_description: "Final billing confirmation and close.",
        case_status: "solved",
        createdAt: new Date("2025-11-29T17:20:00Z"),
        updatedAt: new Date("2025-11-29T18:40:00Z"),
        logs: { performedBy: supervisors[9]._id, protocolID: protocols[9]._id, timestamp: new Date("2025-11-29T18:35:00Z") }
      },
    ];

    // ------------------------
    // Insert documents (Insert operations)
    // ------------------------
    await Supervisor.insertMany(supervisors);
    console.log("Inserted supervisors.");

    await Agent.insertMany(agents);
    console.log("Inserted agents.");

    await Client.insertMany(clients);
    console.log("Inserted clients.");

    await ActionProtocol.insertMany(protocols);
    console.log("Inserted action_protocols.");

    await Case.insertMany(cases);
    console.log("Inserted cases.");

    // ------------------------
    // CRUD Examples
    // ------------------------

    // READ: find all solved cases with agent & client populated
    const solvedCases = await Case.find({ case_status: "solved" })
      .populate("assignedAgentID", "name email department")
      .populate("clientID", "firstName lastName email phone")
      .populate("logs.performedBy", "name email")
      .populate("logs.protocolID", "action type timestamp")
      .lean()
      .exec();
    console.log(`Found ${solvedCases.length} solved cases (sample):`);
    solvedCases.slice(0, 3).forEach((c, i) => {
      console.log(i + 1, { id: c._id.toString(), status: c.case_status, agent: c.assignedAgentID.name, client: `${c.clientID.firstName} ${c.clientID.lastName}` });
    });

    // UPDATE: mark an unsolved case as solved and attach logs
    const unsolvedCase = await Case.findOne({ case_status: "unsolved" });
    if (unsolvedCase) {
      unsolvedCase.case_status = "solved";
      unsolvedCase.updatedAt = new Date();
      // create a new protocol record to reference
      const newProtocol = await ActionProtocol.create({
        agentID: unsolvedCase.assignedAgentID,
        action: "Manual Resolution",
        type: "Update",
        timestamp: new Date()
      });
      // choose a supervisor to perform the log
      const performingSupervisor = await Supervisor.findOne().lean();
      unsolvedCase.logs = {
        performedBy: performingSupervisor._id,
        protocolID: newProtocol._id,
        timestamp: new Date()
      };
      await unsolvedCase.save();
      console.log(`Updated case ${unsolvedCase._id} to 'solved' with logs.`);
    } else {
      console.log("No unsolved case found to update.");
    }

    // DELETE: remove one inactive agent (example)
    const deleted = await Agent.deleteOne({ isActive: false });
    console.log(`Deleted ${deleted.deletedCount} inactive agent(s).`);

    // ------------------------
    // Aggregation Pipelines (4 meaningful reports)
    // ------------------------

    // 1) Solved cases count per agent (workload/resolution rate)
    const solvedPerAgent = await Case.aggregate([
      { $match: { case_status: "solved" } },
      { $group: { _id: "$assignedAgentID", solvedCases: { $sum: 1 } } },
      { $lookup: { from: "agents", localField: "_id", foreignField: "_id", as: "agent" } },
      { $unwind: "$agent" },
      { $project: { _id: 0, agentId: "$agent._id", agentName: "$agent.name", agentEmail: "$agent.email", solvedCases: 1 } },
      { $sort: { solvedCases: -1 } }
    ]);
    console.log("Solved cases per agent (report):", solvedPerAgent);

    // 2) Active agents by department (headcount)
    const activeAgentsByDept = await Agent.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$department", activeCount: { $sum: 1 } } },
      { $project: { _id: 0, department: "$_id", activeCount: 1 } },
      { $sort: { activeCount: -1 } }
    ]);
    console.log("Active agents by department:", activeAgentsByDept);

    // 3) Recent action protocols per agent (up to 3)
    const recentProtocolsPerAgent = await ActionProtocol.aggregate([
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$agentID",
          recentProtocols: { $push: { action: "$action", type: "$type", timestamp: "$timestamp" } }
        }
      },
      { $project: { recentProtocols: { $slice: ["$recentProtocols", 3] } } },
      { $lookup: { from: "agents", localField: "_id", foreignField: "_id", as: "agent" } },
      { $unwind: "$agent" },
      { $project: { _id: 0, agentId: "$agent._id", agentName: "$agent.name", recentProtocols: 1 } }
    ]);
    console.log("Recent protocols per agent (top 3):", recentProtocolsPerAgent);

    // 4) Clients with number of cases and last case update (client activity)
    const clientActivity = await Case.aggregate([
      { $group: { _id: "$clientID", casesCount: { $sum: 1 }, lastUpdated: { $max: "$updatedAt" } } },
      { $lookup: { from: "clients", localField: "_id", foreignField: "_id", as: "client" } },
      { $unwind: "$client" },
      { $project: { _id: 0, clientId: "$client._id", clientEmail: "$client.email", clientName: { $concat: ["$client.firstName", " ", "$client.lastName"] }, casesCount: 1, lastUpdated: 1 } },
      { $sort: { casesCount: -1, lastUpdated: -1 } }
    ]);
    console.log("Client activity report:", clientActivity);

    // ------------------------
    // Final verification read: ensure no pending/unsolved case has logs
    // ------------------------
    const badDocs = await Case.find({ case_status: { $in: ["unsolved", "pending"] }, logs: { $ne: null } }).lean();
    if (badDocs.length === 0) {
      console.log("Validation check passed: non-solved cases do NOT have logs.");
    } else {
      console.warn("Validation check failed: some non-solved cases have logs:", badDocs);
    }

    console.log("All done. Closing connection.");
  } catch (err) {
    console.error("Error in script:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
    process.exit(0);
  }
}

main();
