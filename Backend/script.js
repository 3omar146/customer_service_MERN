// script.js
// Updated to match new ISP customer-service schema exactly
// NOTHING removed — only minimal edits applied.

import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const MONGODB_URI = "mongodb+srv://ActivityTrackerUser:ActivityTrackerPass@cluster0.2sjmnf6.mongodb.net/";
const DB_NAME = "customer-service";

async function main() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
    console.log("Connected to MongoDB via Mongoose.");

    // ------------------------
    // SCHEMAS (updated to match new schema)
    // ------------------------

    const supervisorSchema = new Schema({
      email: String,
      name: String,
      role: String, // ["Head Supervisor","Senior Supervisor","Supervisor"]
      password: String,
      updatedAt: Date
    }, { collection: "supervisors" });

    const agentSchema = new Schema({
      email: String,
      isActive: Boolean,
      name: String,
      role: String, // ["Agent","Senior Agent"]
      password: String,
      supervisorID: { type: Schema.Types.ObjectId, ref: "Supervisor" },
      updatedAt: Date
    }, { collection: "agents" });
    agentSchema.index( {supervisorID: 1} );

const clientSchema = new Schema({
  email: { 
    type: String, 
  },

  firstName: { 
    type: String,  
  },

  lastName: { 
    type: String, 
  },

  phone: { 
    type: String,
  },

  password: { 
    type: String,
  },

  updatedAt: { 
    type: Date 
  }
}, { collection: "clients" });


    clientSchema.index({ email: 1 }, { unique: true });
    agentSchema.index({ email: 1 }, { unique: true });
    supervisorSchema.index({ email: 1 }, { unique: true });

    const actionProtocolSchema = new Schema({
      agentID: { type: Schema.Types.ObjectId, ref: "Agent" },
      steps: String, // renamed from "action"
      type: String,
      timestamp: Date
    }, { collection: "action_protocols" });
    actionProtocolSchema.index( {type:1} );

    const caseSchema = new Schema({
      assignedAgentID: { type: Schema.Types.ObjectId, ref: "Agent" },
      clientID: { type: Schema.Types.ObjectId, ref: "Client" },
      case_description: String,
      case_status: String, // unsolved, pending, solved
      recommendedActionProtocol: { type: Schema.Types.ObjectId, ref: "ActionProtocol" },
      createdAt: Date,
      updatedAt: Date
      // logs REMOVED (now a separate collection)
    }, { collection: "cases" });
    caseSchema.index( {assignedAgentID: 1, case_status:1});

    const logSchema = new Schema({
      caseID: { type: Schema.Types.ObjectId, ref: "Case" },
      performedBy: { type: Schema.Types.ObjectId, ref: "Agent" },
      protocolID: { type: Schema.Types.ObjectId, ref: "ActionProtocol" },
      timestamp: Date
    }, { collection: "logs" });
    logSchema.index( {perfomedBy:1} );


    // MODELS
    const Supervisor = mongoose.model("Supervisor", supervisorSchema);
    const Agent = mongoose.model("Agent", agentSchema);
    const Client = mongoose.model("Client", clientSchema);
    const ActionProtocol = mongoose.model("ActionProtocol", actionProtocolSchema);
    const Case = mongoose.model("Case", caseSchema);
    const Log = mongoose.model("Log", logSchema);

    // ------------------------
    // DROP COLLECTIONS FOR CLEAN RUN
    // ------------------------
    const collections = await mongoose.connection.db.listCollections().toArray();
    const existing = collections.map(c => c.name);

    for (const name of ["supervisors", "agents", "clients", "action_protocols", "cases", "logs"]) {
      if (existing.includes(name)) {
        await mongoose.connection.db.dropCollection(name);
        console.log(`Dropped ${name}`);
      }
    }

    // ------------------------
    // DATA GENERATION
    // ------------------------

    const genId = () => new Types.ObjectId();

    // Supervisors (10)
    const supervisors = [
      { _id: genId(), email: "laila.hassan@company.com", name: "Laila Hassan", role: 'Head Supervisor', password: "passLaila1", updatedAt: new Date("2025-10-28T09:00:00Z") },
      { _id: genId(), email: "amr.kamal@company.com", name: "Amr Kamal", role: 'Senior Supervisor', password: "passAmr1", updatedAt: new Date("2025-11-01T10:30:00Z") },
      { _id: genId(), email: "dina.elsayed@company.com", name: "Dina Elsayed", role: 'Supervisor', password: "passDina1", updatedAt: new Date("2025-11-02T13:20:00Z") },
      { _id: genId(), email: "mohamed.gaber@company.com", name: "Mohamed Gaber", role: 'Head Supervisor', password: "passMoh1", updatedAt: new Date("2025-11-05T08:00:00Z") },
      { _id: genId(), email: "sara.fahmy@company.com", name: "Sara Fahmy", role: 'Senior Supervisor', password: "passSara1", updatedAt: new Date("2025-11-06T11:45:00Z") },
      { _id: genId(), email: "khaled.mahfouz@company.com", name: "Khaled Mahfouz", role: 'Head Supervisor', password: "passKhaled1", updatedAt: new Date("2025-11-07T14:15:00Z") },
      { _id: genId(), email: "yasmin.nabil@company.com", name: "Yasmin Nabil", role: 'Supervisor', password: "passYasmin1", updatedAt: new Date("2025-11-08T09:40:00Z") },
      { _id: genId(), email: "tamer.hassan@company.com", name: "Tamer Hassan", role: 'Senior Supervisor', password: "passTamer1", updatedAt: new Date("2025-11-09T16:00:00Z") },
      { _id: genId(), email: "mona.elkhateeb@company.com", name: "Mona El-Khateeb", role: 'Head Supervisor', password: "passMona1", updatedAt: new Date("2025-11-10T12:30:00Z") },
      { _id: genId(), email: "omar.eldeeb@company.com", name: "Omar El-Deeb", role: 'Senior Supervisor', password: "passOmar1", updatedAt: new Date("2025-11-11T07:20:00Z") }
    ];

    // Agents (10) — ONLY schema adjustments done
    const agents = [
      { _id: genId(), email: "ahmed.salem@company.com", isActive: true, name: "Ahmed Salem", role: "Agent", password: "agentA1", updatedAt: new Date("2025-11-20T09:00:00Z"), supervisorID: supervisors[0]._id },
      { _id: genId(), email: "nora.mostafa@company.com", isActive: true, name: "Nora Mostafa", role: "Senior Agent", password: "agentN1", updatedAt: new Date("2025-11-21T09:20:00Z"), supervisorID: supervisors[4]._id },
      { _id: genId(), email: "hassan.ismail@company.com", isActive: false, name: "Hassan Ismail", role: "Agent", password: "agentH1", updatedAt: new Date("2025-11-22T10:00:00Z"), supervisorID: supervisors[2]._id },
      { _id: genId(), email: "noha.samir@company.com", isActive: true, name: "Noha Samir", role: "Agent", password: "agentNo1", updatedAt: new Date("2025-11-23T11:00:00Z"), supervisorID: supervisors[1]._id },
      { _id: genId(), email: "ramy.abdel@company.com", isActive: true, name: "Ramy Abdel", role: "Agent", password: "agentR1", updatedAt: new Date("2025-11-24T12:00:00Z"), supervisorID: supervisors[3]._id },
      { _id: genId(), email: "fatma.hany@company.com", isActive: true, name: "Fatma Hany", role: "Agent", password: "agentF1", updatedAt: new Date("2025-11-25T13:00:00Z"), supervisorID: supervisors[5]._id },
      { _id: genId(), email: "hoda.mostafa@company.com", isActive: true, name: "Hoda Mostafa", role: "Agent", password: "agentHo1", updatedAt: new Date("2025-11-26T14:00:00Z"), supervisorID: supervisors[8]._id },
      { _id: genId(), email: "yasser.mohamed@company.com", isActive: false, name: "Yasser Mohamed", role: "Agent", password: "agentY1", updatedAt: new Date("2025-11-27T15:00:00Z"), supervisorID: supervisors[0]._id },
      { _id: genId(), email: "salma.nagy@company.com", isActive: true, name: "Salma Nagy", role: "Agent", password: "agentS1", updatedAt: new Date("2025-11-28T16:00:00Z"), supervisorID: supervisors[1]._id },
      { _id: genId(), email: "mostafa.a@company.com", isActive: true, name: "Mostafa Ahmed", role: "Agent", password: "agentM1", updatedAt: new Date("2025-11-29T17:00:00Z"), supervisorID: supervisors[7]._id }
    ];

    // Clients (unchanged)
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
      { _id: genId(), email: "client10@example.com", firstName: "Heba", lastName: "Nabil", phone: "+201010123456", password: "client10pw", updatedAt: new Date("2025-11-10T18:00:00Z") }
    ];

    // Action Protocols (steps field fixed)
    const protocols = [
      { _id: genId(), agentID: agents[0]._id, steps: "Initial contact with client", type: "call", timestamp: new Date("2025-11-20T09:05:00Z") },
      { _id: genId(), agentID: agents[1]._id, steps: "Issue escalated to supervisor", type: "email", timestamp: new Date("2025-11-21T10:15:00Z") },
      { _id: genId(), agentID: agents[2]._id, steps: "Security review conducted", type: "review", timestamp: new Date("2025-11-22T11:30:00Z") },
      { _id: genId(), agentID: agents[3]._id, steps: "Resolved account error", type: "update", timestamp: new Date("2025-11-23T12:45:00Z") },
      { _id: genId(), agentID: agents[4]._id, steps: "Follow-up call with client", type: "call", timestamp: new Date("2025-11-24T13:00:00Z") },
      { _id: genId(), agentID: agents[5]._id, steps: "Uploaded missing documents", type: "upload", timestamp: new Date("2025-11-25T14:20:00Z") },
      { _id: genId(), agentID: agents[6]._id, steps: "Completed onboarding meeting", type: "meeting", timestamp: new Date("2025-11-26T15:40:00Z") },
      { _id: genId(), agentID: agents[7]._id, steps: "Completed account review", type: "review", timestamp: new Date("2025-11-27T16:10:00Z") },
      { _id: genId(), agentID: agents[8]._id, steps: "Performed security audit", type: "audit", timestamp: new Date("2025-11-28T17:25:00Z") },
      { _id: genId(), agentID: agents[9]._id, steps: "Finalized account closure", type: "close", timestamp: new Date("2025-11-29T18:35:00Z") }
    ];

    // Cases — adapted: remove logs, add recommendedActionProtocol
    const cases = [
      {
        _id: genId(),
        assignedAgentID: agents[0]._id,
        clientID: clients[0]._id,
        case_description: "Payment failed but amount was debited.",
        case_status: "solved",
        recommendedActionProtocol: protocols[0]._id,
        createdAt: new Date("2025-11-20T08:30:00Z"),
        updatedAt: new Date("2025-11-20T09:10:00Z")
      },
      {
        _id: genId(),
        assignedAgentID: agents[1]._id,
        clientID: clients[1]._id,
        case_description: "Account verification issue.",
        case_status: "pending",
        recommendedActionProtocol: protocols[1]._id,
        createdAt: new Date("2025-11-21T09:00:00Z"),
        updatedAt: new Date("2025-11-21T10:20:00Z")
      },
      {
        _id: genId(),
        assignedAgentID: agents[2]._id,
        clientID: clients[2]._id,
        case_description: "Suspicious login activity detected.",
        case_status: "pending",
        recommendedActionProtocol: protocols[2]._id,
        createdAt: new Date("2025-11-22T10:00:00Z"),
        updatedAt: new Date("2025-11-22T11:45:00Z")
      },
      {
        _id: genId(),
        assignedAgentID: agents[3]._id,
        clientID: clients[3]._id,
        case_description: "Incorrect refund processing.",
        case_status: "solved",
        recommendedActionProtocol: protocols[3]._id,
        createdAt: new Date("2025-11-23T11:00:00Z"),
        updatedAt: new Date("2025-11-23T12:50:00Z")
      },
      {
        _id: genId(),
        assignedAgentID: null,
        clientID: clients[4]._id,
        case_description: "Incorrect billing amount shown.",
        case_status: "unsolved",
        recommendedActionProtocol: protocols[4]._id,
        createdAt: new Date("2025-11-24T12:00:00Z"),
        updatedAt: new Date("2025-11-24T13:05:00Z")
      },
      {
        _id: genId(),
        assignedAgentID: agents[5]._id,
        clientID: clients[5]._id,
        case_description: "Missing KYC documents.",
        case_status: "pending",
        recommendedActionProtocol: protocols[5]._id,
        createdAt: new Date("2025-11-25T13:30:00Z"),
        updatedAt: new Date("2025-11-25T14:25:00Z")
      },
      {
        _id: genId(),
        assignedAgentID: agents[6]._id,
        clientID: clients[6]._id,
        case_description: "Onboarding delay reported.",
        case_status: "pending",
        recommendedActionProtocol: protocols[6]._id,
        createdAt: new Date("2025-11-26T14:10:00Z"),
        updatedAt: new Date("2025-11-26T15:05:00Z")
      },
      {
        _id: genId(),
        assignedAgentID: agents[7]._id,
        clientID: clients[7]._id,
        case_description: "Client requested account activity review.",
        case_status: "solved",
        recommendedActionProtocol: protocols[7]._id,
        createdAt: new Date("2025-11-27T15:00:00Z"),
        updatedAt: new Date("2025-11-27T16:20:00Z")
      },
      {
        _id: genId(),
        assignedAgentID: agents[8]._id,
        clientID: clients[8]._id,
        case_description: "Password reset not functioning.",
        case_status: "solved",
        recommendedActionProtocol: protocols[8]._id,
        createdAt: new Date("2025-11-28T16:10:00Z"),
        updatedAt: new Date("2025-11-28T17:30:00Z")
      },
      {
        _id: genId(),
        assignedAgentID: agents[9]._id,
        clientID: clients[9]._id,
        case_description: "Final billing confirmation.",
        case_status: "solved",
        recommendedActionProtocol: protocols[9]._id,
        createdAt: new Date("2025-11-29T17:20:00Z"),
        updatedAt: new Date("2025-11-29T18:40:00Z")
      }
    ];

    // Logs (NEW collection!)
    const logs = [
      {
        _id: genId(),
        caseID: cases[0]._id,
        performedBy: agents[0]._id,
        protocolID: protocols[0]._id,
        timestamp: new Date("2025-11-20T09:05:00Z")
      },
      {
        _id: genId(),
        caseID: cases[3]._id,
        performedBy: agents[3]._id,
        protocolID: protocols[3]._id,
        timestamp: new Date("2025-11-23T12:45:00Z")
      },
      {
        _id: genId(),
        caseID: cases[7]._id,
        performedBy: agents[7]._id,
        protocolID: protocols[7]._id,
        timestamp: new Date("2025-11-27T16:10:00Z")
      },
      {
        _id: genId(),
        caseID: cases[8]._id,
        performedBy: agents[8]._id,
        protocolID: protocols[8]._id,
        timestamp: new Date("2025-11-28T17:25:00Z")
      },
      {
        _id: genId(),
        caseID: cases[9]._id,
        performedBy: agents[9]._id,
        protocolID: protocols[9]._id,
        timestamp: new Date("2025-11-29T18:35:00Z")
      }
    ];

    // ------------------------
    // INSERT DOCUMENTS
    // ------------------------
    await Supervisor.insertMany(supervisors);
    await Agent.insertMany(agents);
    await Client.insertMany(clients);
    await ActionProtocol.insertMany(protocols);
    await Case.insertMany(cases);
    await Log.insertMany(logs);

    console.log("All documents inserted successfully.");

    // ------------------------
    // CRUD EXAMPLES (minimal changes)
    // ------------------------

    const solvedCases = await Case.find({ case_status: "solved" });
    console.log(`Solved cases found: ${solvedCases.length}`);

    // UPDATE
const result = await Agent.updateOne(
  { email: "ahmed.salem@company.com" },
  { $set: { password: "ahmedpass2" } }
);

if (result.matchedCount === 0) {
  console.log("No agent found with that email");
} else if (result.modifiedCount === 0) {
  console.log("Password was the same, no change");
} else {
  console.log("Password updated successfully");
}

    // DELETE inactive agent
    const deleted = await Agent.deleteOne({ isActive: false });
    console.log(`Deleted ${deleted.deletedCount} inactive agent.`);

    // ------------------------
    // AGGREGATION
    // ------------------------

    const solvedPerAgent = await Log.aggregate([
      { $lookup: { from: "agents", localField: "performedBy", foreignField: "_id", as: "agent" } },
      { $unwind: "$agent" },
      { $group: { _id: "$agent._id", agentName: { $first: "$agent.name" }, solvedCases: { $sum: 1 } } },
      { $sort: { solvedCases: -1 } }
    ]);

    console.log("Solved cases per agent:", solvedPerAgent); //number of solved cases for each agent

    const activeAgentsByDept = await Agent.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);
    //count agents per department

    console.log("Active agents by role:", activeAgentsByDept);

   
    const casesPerClient = await Case.aggregate([  {
    $group: {
      _id: "$clientID",
      totalCases: { $sum: 1 },
      lastUpdated: { $max: "$updatedAt" }
    }
  },
  {
    $lookup: {
      from: "clients",
      localField: "_id",
      foreignField: "_id",
      as: "client"
    }
  },

  { $unwind: "$client" },
  {
    $project: {
      _id: 0,
      clientID: "$client._id",
      fullName: { $concat: ["$client.firstName", " ", "$client.lastName"] },
      email: "$client.email",
      phone: "$client.phone",
      totalCases: 1,
      lastUpdated: 1
    }
  },

  { $sort: { totalCases: -1, lastUpdated: -1 } }
]);

console.log("Cases per customer:", casesPerClient); //finding number of cases per client


    const topIssues = await Case.aggregate([
  {
    $lookup: {
      from: "action_protocols",
      localField: "recommendedActionProtocol",
      foreignField: "_id",
      as: "protocol"
    }
  },
  { $unwind: "$protocol" },

  {
    $group: {
      _id: "$protocol.type",
      count: { $sum: 1 }
    }
  },

  { $sort: { count: -1 } },

  {
    $project: {
      _id: 0,
      issueType: "$_id",
      occurrences: "$count"
    }
  }
]);

console.log("Top issue types:", topIssues); //find issue types with most action protocols

//////validation//////
await mongoose.connection.db.command({
  collMod: "clients",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "firstName", "lastName", "phone", "password"],
      properties: {
        email: {
          bsonType: "string",
          pattern: "^\\S+@\\S+\\.\\S+$"
        },
        firstName: { bsonType: "string" },
        lastName: { bsonType: "string" },
        phone: {
          bsonType: "string",
          pattern: "^(\\+20)?\\d{11}$"
        },
        password: { bsonType: "string", minLength: 6 },
        updatedAt: { bsonType: ["date", "null"] }
      }
    }
  },
  validationLevel: "moderate"
});


    console.log("All done. Closing.");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}




main();
