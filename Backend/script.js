// script.js
// Updated to match new ISP customer-service schema exactly
// NOTHING removed — only minimal edits applied.

import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const MONGODB_URI = "mongodb+srv://ActivityTrackerUser:ActivityTrackerPass@cluster0.2sjmnf6.mongodb.net/";
const DB_NAME = "customer-service";

async function dropAllIndexesSafely(model, collectionName) {
  try {
    const indexes = await model.collection.indexes();

    if (indexes.length <= 1) {
      console.log(`No secondary indexes to drop for ${collectionName}`);
      return;
    }

    await model.collection.dropIndexes();
    console.log(`Dropped all indexes for ${collectionName}`);
  } catch (err) {
    console.error(`Failed to drop indexes for ${collectionName}:`, err.message);
  }
}


async function main() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
    console.log("Connected to MongoDB via Mongoose.");

    // ------------------------
    // SCHEMAS 
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
    type: String
  },

  firstName: { 
    type: String 
  },

  lastName: { 
    type: String 
  },

  phone: { 
    type: String
  },

  password: { 
    type: String
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
    actionProtocolSchema.index( {agentID:1} );


    const caseSchema = new Schema({
      assignedAgentID: { type: Schema.Types.ObjectId, ref: "Agent" },
      clientID: { type: Schema.Types.ObjectId, ref: "Client" },
      case_description: String,
      case_status: String, // unsolved, pending, solved
      recommendedActionProtocol: { type: Schema.Types.ObjectId, ref: "ActionProtocol" },
      createdAt: Date,
      updatedAt: Date
    }, { collection: "cases" });
    caseSchema.index( {assignedAgentID: 1});
    caseSchema.index({clientID:1});

    const logSchema = new Schema({
      caseID: { type: Schema.Types.ObjectId, ref: "Case" },
      performedBy: { type: Schema.Types.ObjectId, ref: "Agent" },
      protocolID: { type: Schema.Types.ObjectId, ref: "ActionProtocol" },
      timestamp: Date
    }, { collection: "logs" });
    logSchema.index( {perfomedBy:1});
    logSchema.index({caseID:1});
    logSchema.index({protocolID:1});


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
      { _id: genId(), email: "omar.eldeeb@company.com", name: "Omar El-Deeb", role: 'Senior Supervisor', password: "passOmar1", updatedAt: new Date("2025-11-11T07:20:00Z") },
      { _id: genId(), email: "ahmed.salem@company.com", name: "Ahmed Salem", role: "Supervisor", password: "passAhmed1", updatedAt: new Date("2025-11-12T09:10:00Z") },
    { _id: genId(), email: "nour.ali@company.com", name: "Nour Ali", role: "Senior Supervisor", password: "passNour1", updatedAt: new Date("2025-11-12T11:00:00Z") },
    { _id: genId(), email: "karim.fouad@company.com", name: "Karim Fouad", role: "Supervisor", password: "passKarim1", updatedAt: new Date("2025-11-13T08:45:00Z") },
    { _id: genId(), email: "hanaa.youssef@company.com", name: "Hanaa Youssef", role: "Head Supervisor", password: "passHanaa1", updatedAt: new Date("2025-11-13T14:20:00Z") },
    { _id: genId(), email: "mostafa.ibrahim@company.com", name: "Mostafa Ibrahim", role: "Senior Supervisor", password: "passMostafa1", updatedAt: new Date("2025-11-14T10:05:00Z") },
    { _id: genId(), email: "reem.sherif@company.com", name: "Reem Sherif", role: "Supervisor", password: "passReem1", updatedAt: new Date("2025-11-14T15:40:00Z") },
    { _id: genId(), email: "adel.mansour@company.com", name: "Adel Mansour", role: "Head Supervisor", password: "passAdel1", updatedAt: new Date("2025-11-15T09:30:00Z") },
    { _id: genId(), email: "farah.mostafa@company.com", name: "Farah Mostafa", role: "Supervisor", password: "passFarah1", updatedAt: new Date("2025-11-15T13:55:00Z") },
    { _id: genId(), email: "youssef.hamed@company.com", name: "Youssef Hamed", role: "Senior Supervisor", password: "passYoussef1", updatedAt: new Date("2025-11-16T08:25:00Z") },
    { _id: genId(), email: "salma.abdelrahman@company.com", name: "Salma Abdelrahman", role: "Supervisor", password: "passSalma1", updatedAt: new Date("2025-11-16T16:10:00Z") }
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
      { _id: genId(), email: "mostafa.a@company.com", isActive: true, name: "Mostafa Ahmed", role: "Agent", password: "agentM1", updatedAt: new Date("2025-11-29T17:00:00Z"), supervisorID: supervisors[7]._id },
       { _id: genId(), email: "ali.mahmoud@company.com", isActive: true, name: "Ali Mahmoud", role: "Agent", password: "agentAli1", updatedAt: new Date("2025-11-30T09:10:00Z"), supervisorID: supervisors[10]._id },
  { _id: genId(), email: "menna.ahmed@company.com", isActive: true, name: "Menna Ahmed", role: "Agent", password: "agentMenna1", updatedAt: new Date("2025-12-01T10:00:00Z"), supervisorID: supervisors[11]._id },
  { _id: genId(), email: "ibrahim.sayed@company.com", isActive: false, name: "Ibrahim Sayed", role: "Agent", password: "agentIbrahim1", updatedAt: new Date("2025-12-02T11:30:00Z"), supervisorID: supervisors[12]._id },
  { _id: genId(), email: "rana.hassan@company.com", isActive: true, name: "Rana Hassan", role: "Senior Agent", password: "agentRana1", updatedAt: new Date("2025-12-03T12:15:00Z"), supervisorID: supervisors[13]._id },
  { _id: genId(), email: "osama.farouk@company.com", isActive: true, name: "Osama Farouk", role: "Agent", password: "agentOsama1", updatedAt: new Date("2025-12-04T13:45:00Z"), supervisorID: supervisors[14]._id },
  { _id: genId(), email: "dalia.sherif@company.com", isActive: true, name: "Dalia Sherif", role: "Agent", password: "agentDalia1", updatedAt: new Date("2025-12-05T09:25:00Z"), supervisorID: supervisors[15]._id },
  { _id: genId(), email: "wael.atef@company.com", isActive: false, name: "Wael Atef", role: "Agent", password: "agentWael1", updatedAt: new Date("2025-12-06T10:50:00Z"), supervisorID: supervisors[16]._id },
  { _id: genId(), email: "marina.nabil@company.com", isActive: true, name: "Marina Nabil", role: "Agent", password: "agentMarina1", updatedAt: new Date("2025-12-07T14:05:00Z"), supervisorID: supervisors[17]._id },
  { _id: genId(), email: "ahmed.younes@company.com", isActive: true, name: "Ahmed Younes", role: "Agent", password: "agentYounes1", updatedAt: new Date("2025-12-08T15:40:00Z"), supervisorID: supervisors[18]._id },
  { _id: genId(), email: "shimaa.kamal@company.com", isActive: true, name: "Shimaa Kamal", role: "Agent", password: "agentShimaa1", updatedAt: new Date("2025-12-09T16:30:00Z"), supervisorID: supervisors[19]._id }
    ];

    // Clients (unchanged)
    const clients = [
 { _id: genId(), email: "ahmed.nasser@gmail.com", firstName: "Ahmed", lastName: "Nasser", phone: "+201011234567", password: "clientAhmed1", updatedAt: new Date("2025-11-11T09:00:00Z") },
  { _id: genId(), email: "sara.ahmed@yahoo.com", firstName: "Sara", lastName: "Ahmed", phone: "+201012345678", password: "clientSara1", updatedAt: new Date("2025-11-12T10:00:00Z") },
  { _id: genId(), email: "mohamed.elsayed@gmail.com", firstName: "Mohamed", lastName: "Elsayed", phone: "+201013456789", password: "clientMohamed1", updatedAt: new Date("2025-11-13T11:00:00Z") },
  { _id: genId(), email: "nour.hassan@hotmail.com", firstName: "Nour", lastName: "Hassan", phone: "+201014567890", password: "clientNour1", updatedAt: new Date("2025-11-14T12:00:00Z") },
  { _id: genId(), email: "karim.fouad@gmail.com", firstName: "Karim", lastName: "Fouad", phone: "+201015678901", password: "clientKarim1", updatedAt: new Date("2025-11-15T13:00:00Z") },
  { _id: genId(), email: "dina.sherif@yahoo.com", firstName: "Dina", lastName: "Sherif", phone: "+201016789012", password: "clientDina1", updatedAt: new Date("2025-11-16T14:00:00Z") },
  { _id: genId(), email: "mostafa.ali@gmail.com", firstName: "Mostafa", lastName: "Ali", phone: "+201017890123", password: "clientMostafa1", updatedAt: new Date("2025-11-17T15:00:00Z") },
  { _id: genId(), email: "hala.mahmoud@hotmail.com", firstName: "Hala", lastName: "Mahmoud", phone: "+201018901234", password: "clientHala1", updatedAt: new Date("2025-11-18T16:00:00Z") },
  { _id: genId(), email: "youssef.mansour@gmail.com", firstName: "Youssef", lastName: "Mansour", phone: "+201019012345", password: "clientYoussef1", updatedAt: new Date("2025-11-19T17:00:00Z") },
  { _id: genId(), email: "reem.kamal@yahoo.com", firstName: "Reem", lastName: "Kamal", phone: "+201020123456", password: "clientReem1", updatedAt: new Date("2025-11-20T18:00:00Z") },
  { _id: genId(), email: "omar.abdelrahman@gmail.com", firstName: "Omar", lastName: "Abdelrahman", phone: "+201021234567", password: "clientOmar1", updatedAt: new Date("2025-11-21T09:30:00Z") },
  { _id: genId(), email: "salma.atef@hotmail.com", firstName: "Salma", lastName: "Atef", phone: "+201022345678", password: "clientSalma1", updatedAt: new Date("2025-11-22T10:30:00Z") },
  { _id: genId(), email: "ibrahim.hassan@gmail.com", firstName: "Ibrahim", lastName: "Hassan", phone: "+201023456789", password: "clientIbrahim1", updatedAt: new Date("2025-11-23T11:30:00Z") },
  { _id: genId(), email: "farah.samy@yahoo.com", firstName: "Farah", lastName: "Samy", phone: "+201024567890", password: "clientFarah1", updatedAt: new Date("2025-11-24T12:30:00Z") },
  { _id: genId(), email: "adel.shawky@gmail.com", firstName: "Adel", lastName: "Shawky", phone: "+201025678901", password: "clientAdel1", updatedAt: new Date("2025-11-25T13:30:00Z") },
  { _id: genId(), email: "menna.fathy@hotmail.com", firstName: "Menna", lastName: "Fathy", phone: "+201026789012", password: "clientMenna1", updatedAt: new Date("2025-11-26T14:30:00Z") },
  { _id: genId(), email: "tarek.saad@gmail.com", firstName: "Tarek", lastName: "Saad", phone: "+201027890123", password: "clientTarek1", updatedAt: new Date("2025-11-27T15:30:00Z") },
  { _id: genId(), email: "nadia.ragab@yahoo.com", firstName: "Nadia", lastName: "Ragab", phone: "+201028901234", password: "clientNadia1", updatedAt: new Date("2025-11-28T16:30:00Z") },
  { _id: genId(), email: "hossam.younes@gmail.com", firstName: "Hossam", lastName: "Younes", phone: "+201029012345", password: "clientHossam1", updatedAt: new Date("2025-11-29T17:30:00Z") },
  { _id: genId(), email: "asmaa.said@hotmail.com", firstName: "Asmaa", lastName: "Said", phone: "+201030123456", password: "clientAsmaa1", updatedAt: new Date("2025-11-30T18:30:00Z") }
    ];

    // Action Protocols (steps field fixed)
    const protocols =[
  {
    _id: genId(),
    agentID: agents[0]._id,
    type: "Connection Issue",
    steps: "Verified client account and service area\nChecked ISP outage monitoring dashboard\nReset client port from core router\nConfirmed internet connectivity with client",
    timestamp: new Date("2025-12-02T09:00:00Z")
  },
  {
    _id: genId(),
    agentID: agents[1]._id,
    type: "Slow Internet Speed",
    steps: "Ran remote line quality test\nReviewed bandwidth usage statistics\nReapplied correct speed profile\nGuided client to reboot router and retest speed",
    timestamp: new Date("2025-12-02T09:30:00Z")
  },
  {
    _id: genId(),
    agentID: agents[2]._id,
    type: "Router Malfunction",
    steps: "Verified router model and firmware version\nPushed firmware update remotely\nReset router configuration from ISP system\nConfirmed stable connection",
    timestamp: new Date("2025-12-02T10:00:00Z")
  },
  {
    _id: genId(),
    agentID: agents[3]._id,
    type: "Authentication Failure",
    steps: "Checked PPPoE credentials in ISP system\nReset authentication session\nRegenerated client login credentials\nConfirmed successful reconnection",
    timestamp: new Date("2025-12-02T10:30:00Z")
  },
  {
    _id: genId(),
    agentID: agents[4]._id,
    type: "Billing Discrepancy",
    steps: "Reviewed invoices and payment history\nIdentified billing error\nApplied billing adjustment or refund\nNotified client of resolution",
    timestamp: new Date("2025-12-02T11:00:00Z")
  },
  {
    _id: genId(),
    agentID: agents[5]._id,
    type: "Service Suspension",
    steps: "Confirmed suspension reason in system\nValidated payment or required documents\nReactivated service from ISP control panel\nTested line availability",
    timestamp: new Date("2025-12-02T11:30:00Z")
  },
  {
    _id: genId(),
    agentID: agents[6]._id,
    type: "Packet Loss",
    steps: "Performed end-to-end packet loss diagnostics\nIdentified faulty network segment\nRerouted traffic through stable path\nMonitored connection stability",
    timestamp: new Date("2025-12-02T12:00:00Z")
  },
  {
    _id: genId(),
    agentID: agents[7]._id,
    type: "High Latency",
    steps: "Analyzed routing paths to major destinations\nOptimized routing tables\nCleared congested network routes\nConfirmed latency improvement",
    timestamp: new Date("2025-12-02T12:30:00Z")
  },
  {
    _id: genId(),
    agentID: agents[8]._id,
    type: "DNS Resolution Issue",
    steps: "Tested DNS resolution from ISP servers\nSwitched client to alternative ISP DNS\nFlushed DNS cache remotely\nVerified website accessibility",
    timestamp: new Date("2025-12-02T13:00:00Z")
  },
  {
    _id: genId(),
    agentID: agents[9]._id,
    type: "Blocked IP Address",
    steps: "Checked IP blacklist status\nReleased and renewed client IP address\nAssigned new public IP\nTested external connectivity",
    timestamp: new Date("2025-12-02T13:30:00Z")
  },
  {
    _id: genId(),
    agentID: agents[10]._id,
    type: "Service Upgrade Request",
    steps: "Confirmed requested service upgrade\nApplied new speed and quota profile\nRestarted client session\nVerified upgraded internet speed",
    timestamp: new Date("2025-12-02T14:00:00Z")
  },
  {
    _id: genId(),
    agentID: agents[11]._id,
    type: "Service Downgrade Request",
    steps: "Validated downgrade request\nAdjusted billing cycle accordingly\nApplied downgraded service profile\nInformed client of new plan details",
    timestamp: new Date("2025-12-02T14:30:00Z")
  },
  {
    _id: genId(),
    agentID: agents[12]._id,
    type: "Frequent Disconnections",
    steps: "Reviewed connection logs\nDetected line instability\nApplied stability profile\nMonitored reconnection frequency",
    timestamp: new Date("2025-12-02T15:00:00Z")
  },
  {
    _id: genId(),
    agentID: agents[13]._id,
    type: "Installation Delay",
    steps: "Checked installation schedule\nCoordinated with field technician\nRescheduled installation appointment\nConfirmed new date with client",
    timestamp: new Date("2025-12-02T15:30:00Z")
  },
  {
    _id: genId(),
    agentID: agents[14]._id,
    type: "Physical Line Fault",
    steps: "Ran physical line diagnostics\nDetected signal degradation\nOpened repair ticket for field team\nConfirmed line repair completion",
    timestamp: new Date("2025-12-02T16:00:00Z")
  },
  {
    _id: genId(),
    agentID: agents[15]._id,
    type: "Account Information Update",
    steps: "Verified client identity\nUpdated requested account information\nSynchronized changes across systems\nConfirmed update with client",
    timestamp: new Date("2025-12-02T16:30:00Z")
  },
  {
    _id: genId(),
    agentID: agents[16]._id,
    type: "Email Service Issue",
    steps: "Checked ISP mail server status\nReset client mailbox\nUpdated email configuration\nTested sending and receiving emails",
    timestamp: new Date("2025-12-02T17:00:00Z")
  },
  {
    _id: genId(),
    agentID: agents[17]._id,
    type: "VPN Access Problem",
    steps: "Reviewed VPN traffic policy\nWhitelisted required VPN ports\nAdjusted firewall rules\nConfirmed VPN connectivity",
    timestamp: new Date("2025-12-02T17:30:00Z")
  },
  {
    _id: genId(),
    agentID: agents[18]._id,
    type: "Service Termination Request",
    steps: "Confirmed service termination request\nDisabled client service access\nFinalized billing and account closure\nSent termination confirmation",
    timestamp: new Date("2025-12-02T18:00:00Z")
  },
  {
    _id: genId(),
    agentID: agents[19]._id,
    type: "Security Breach",
    steps: "Locked affected account\nReset all client credentials\nScanned for abnormal activity\nRestored service with enhanced security",
    timestamp: new Date("2025-12-02T18:30:00Z")
  }
]

    // Cases — adapted: remove logs, add recommendedActionProtocol
    const cases =[
  {
    _id: genId(),
    assignedAgentID: agents[0]._id,
    clientID: clients[0]._id,
    case_description: "Internet connection completely down since morning.",
    case_status: "solved",
    recommendedActionProtocol: protocols[0]._id,
    createdAt: new Date("2025-12-01T08:00:00Z"),
    updatedAt: new Date("2025-12-01T09:10:00Z")
  },
  {
    _id: genId(),
    assignedAgentID: agents[1]._id,
    clientID: clients[1]._id,
    case_description: "Internet speed is much slower than subscribed plan.",
    case_status: "pending",
    recommendedActionProtocol: protocols[1]._id,
    createdAt: new Date("2025-12-01T09:00:00Z"),
    updatedAt: new Date("2025-12-01T09:45:00Z")
  },
  {
    _id: genId(),
    assignedAgentID: null,
    clientID: clients[2]._id,
    case_description: "Client reports random disconnections throughout the day.",
    case_status: "unsolved",
    recommendedActionProtocol:null,
    createdAt: new Date("2025-12-01T10:00:00Z"),
    updatedAt: new Date("2025-12-01T10:00:00Z")
  },
  {
    _id: genId(),
    assignedAgentID: agents[3]._id,
    clientID: clients[3]._id,
    case_description: "Router not responding after power outage.",
    case_status: "solved",
    recommendedActionProtocol: protocols[2]._id,
    createdAt: new Date("2025-12-01T10:30:00Z"),
    updatedAt: new Date("2025-12-01T11:20:00Z")
  },
  {
    _id: genId(),
    assignedAgentID: agents[4]._id,
    clientID: clients[4]._id,
    case_description: "Unable to authenticate internet session.",
    case_status: "pending",
    createdAt: new Date("2025-12-01T11:00:00Z"),
    updatedAt: new Date("2025-12-01T11:30:00Z")
  },
  {
    _id: genId(),
    assignedAgentID: agents[5]._id,
    clientID: clients[5]._id,
    case_description: "Incorrect monthly bill amount displayed.",
    case_status: "solved",
    recommendedActionProtocol: protocols[4]._id,
    createdAt: new Date("2025-12-01T11:45:00Z"),
    updatedAt: new Date("2025-12-01T12:30:00Z")
  },
  {
    _id: genId(),
    assignedAgentID: null,
    clientID: clients[6]._id,
    case_description: "Service installation appointment not scheduled.",
    case_status: "unsolved",
    recommendedActionProtocol:null,
    createdAt: new Date("2025-12-01T12:00:00Z"),
    updatedAt: new Date("2025-12-01T12:00:00Z")
  },
  {
    _id: genId(),
    assignedAgentID: agents[7]._id,
    clientID: clients[7]._id,
    case_description: "High latency affecting online gaming.",
    case_status: "solved",
    recommendedActionProtocol: protocols[7]._id,
    createdAt: new Date("2025-12-01T12:30:00Z"),
    updatedAt: new Date("2025-12-01T13:20:00Z")
  },
  {
    _id: genId(),
    assignedAgentID: agents[8]._id,
    clientID: clients[8]._id,
    case_description: "Websites not opening due to DNS issues.",
    case_status: "solved",
    recommendedActionProtocol: protocols[8]._id,
    createdAt: new Date("2025-12-01T13:00:00Z"),
    updatedAt: new Date("2025-12-01T13:40:00Z")
  },
  {
    _id: genId(),
    assignedAgentID: agents[9]._id,
    clientID: clients[9]._id,
    case_description: "Client IP address appears blocked externally.",
    case_status: "pending",
    recommendedActionProtocol: protocols[9]._id,
    createdAt: new Date("2025-12-01T13:30:00Z"),
    updatedAt: new Date("2025-12-01T14:00:00Z")
  },
  {
    _id: genId(),
    assignedAgentID: null,
    clientID: clients[10]._id,
    case_description: "Request to upgrade internet package.",
    case_status: "unsolved",
    recommendedActionProtocol:null,
    createdAt: new Date("2025-12-01T14:00:00Z"),
    updatedAt: new Date("2025-12-01T14:00:00Z")
  },
  {
    _id: genId(),
    assignedAgentID: agents[11]._id,
    clientID: clients[11]._id,
    case_description: "Request to downgrade internet package.",
    case_status: "solved",
    recommendedActionProtocol: protocols[11]._id,
    createdAt: new Date("2025-12-01T14:30:00Z"),
    updatedAt: new Date("2025-12-01T15:10:00Z")
  },
  {
    _id: genId(),
    assignedAgentID: agents[12]._id,
    clientID: clients[12]._id,
    case_description: "Internet connection drops multiple times daily.",
    case_status: "pending",
    recommendedActionProtocol: protocols[12]._id,
    createdAt: new Date("2025-12-01T15:00:00Z"),
    updatedAt: new Date("2025-12-01T15:40:00Z")
  },
  {
    _id: genId(),
    assignedAgentID: agents[13]._id,
    clientID: clients[13]._id,
    case_description: "Delayed home internet installation.",
    case_status: "solved",
    recommendedActionProtocol: protocols[13]._id,
    createdAt: new Date("2025-12-01T15:30:00Z"),
    updatedAt: new Date("2025-12-01T16:20:00Z")
  },
  {
    _id: genId(),
    assignedAgentID: null,
    clientID: clients[14]._id,
    case_description: "Physical line suspected to be damaged.",
    case_status: "unsolved",
    recommendedActionProtocol:null,
    createdAt: new Date("2025-12-01T16:00:00Z"),
    updatedAt: new Date("2025-12-01T16:00:00Z")
  },
  {
    _id: genId(),
    assignedAgentID: agents[15]._id,
    clientID: clients[15]._id,
    case_description: "Client requested update of personal account details.",
    case_status: "solved",
    recommendedActionProtocol: protocols[15]._id,
    createdAt: new Date("2025-12-01T16:30:00Z"),
    updatedAt: new Date("2025-12-01T17:00:00Z")
  },
  {
    _id: genId(),
    assignedAgentID: agents[16]._id,
    clientID: clients[16]._id,
    case_description: "ISP email service not sending messages.",
    case_status: "pending",
    recommendedActionProtocol: protocols[16]._id,
    createdAt: new Date("2025-12-01T17:00:00Z"),
    updatedAt: new Date("2025-12-01T17:30:00Z")
  },
  {
    _id: genId(),
    assignedAgentID: agents[17]._id,
    clientID: clients[17]._id,
    case_description: "VPN connection blocked on ISP network.",
    case_status: "solved",
    recommendedActionProtocol: protocols[17]._id,
    createdAt: new Date("2025-12-01T17:30:00Z"),
    updatedAt: new Date("2025-12-01T18:10:00Z")
  },
  {
    _id: genId(),
    assignedAgentID: null,
    clientID: clients[18]._id,
    case_description: "Request to terminate internet service.",
    case_status: "unsolved",
    recommendedActionProtocol:null,
    createdAt: new Date("2025-12-01T18:00:00Z"),
    updatedAt: new Date("2025-12-01T18:00:00Z")
  },
  {
    _id: genId(),
    assignedAgentID: agents[19]._id,
    clientID: clients[19]._id,
    case_description: "Client reports possible account security breach.",
    case_status: "solved",
    recommendedActionProtocol: protocols[19]._id,
    createdAt: new Date("2025-12-01T18:30:00Z"),
    updatedAt: new Date("2025-12-01T19:10:00Z")
  }
];


// Logs
const logs = [
  {
    _id: genId(),
    caseID: cases[0]._id,
    performedBy: agents[0]._id,
    protocolID: protocols[0]._id,
    timestamp: new Date("2025-12-01T09:10:00Z")
  },
  {
    _id: genId(),
    caseID: cases[3]._id,
    performedBy: agents[3]._id,
    protocolID: protocols[2]._id,
    timestamp: new Date("2025-12-01T11:20:00Z")
  },
  {
    _id: genId(),
    caseID: cases[5]._id,
    performedBy: agents[5]._id,
    protocolID: protocols[4]._id,
    timestamp: new Date("2025-12-01T12:30:00Z")
  },
  {
    _id: genId(),
    caseID: cases[7]._id,
    performedBy: agents[7]._id,
    protocolID: protocols[7]._id,
    timestamp: new Date("2025-12-01T13:20:00Z")
  },
  {
    _id: genId(),
    caseID: cases[8]._id,
    performedBy: agents[8]._id,
    protocolID: protocols[8]._id,
    timestamp: new Date("2025-12-01T13:40:00Z")
  },
  {
    _id: genId(),
    caseID: cases[11]._id,
    performedBy: agents[11]._id,
    protocolID: protocols[11]._id,
    timestamp: new Date("2025-12-01T15:10:00Z")
  },
  {
    _id: genId(),
    caseID: cases[13]._id,
    performedBy: agents[13]._id,
    protocolID: protocols[13]._id,
    timestamp: new Date("2025-12-01T16:20:00Z")
  },
  {
    _id: genId(),
    caseID: cases[15]._id,
    performedBy: agents[15]._id,
    protocolID: protocols[15]._id,
    timestamp: new Date("2025-12-01T17:00:00Z")
  },
  {
    _id: genId(),
    caseID: cases[17]._id,
    performedBy: agents[17]._id,
    protocolID: protocols[17]._id,
    timestamp: new Date("2025-12-01T18:10:00Z")
  },
  {
    _id: genId(),
    caseID: cases[19]._id,
    performedBy: agents[19]._id,
    protocolID: protocols[19]._id,
    timestamp: new Date("2025-12-01T19:10:00Z")
  }
];


    //insertt
    await Supervisor.insertMany(supervisors);
    await Agent.insertMany(agents);
    await Client.insertMany(clients);
    await ActionProtocol.insertMany(protocols);
    await Case.insertMany(cases);
    await Log.insertMany(logs);

    console.log("All documents inserted successfully.");

    //delete all existing indexes
await dropAllIndexesSafely(Supervisor, "supervisors");
await dropAllIndexesSafely(Agent, "agents");
await dropAllIndexesSafely(Client, "clients");
await dropAllIndexesSafely(ActionProtocol, "action_protocols");
await dropAllIndexesSafely(Case, "cases");
await dropAllIndexesSafely(Log, "logs");


    //ensure indexes
await Supervisor.syncIndexes();
await Agent.syncIndexes();
await Client.syncIndexes();
await ActionProtocol.syncIndexes();
await Case.syncIndexes();
await Log.syncIndexes();


    // CRUD
    const solvedCases = await Case.find({ case_status: "solved" });
    console.log(`Solved cases found: ${solvedCases.length}`);

    const headSupervisors = await Supervisor.find({ role: "Head Supervisor" });
    console.log(`Head supervisors: ${headSupervisors}`);

    // UPDATE
let result = await Agent.updateOne(
  { email: "ahmed.salem@company.com" },
  { $set: { password: "ahmedpass2" } }
);

if (result.matchedCount === 0) {
  console.log("No agent found with that email");
} else if (result.modifiedCount === 0) {
  console.log("Password was the same, no change");
} else {
  console.log("Password updated successfully-New password:");
}

result = await Client.updateOne(
  { email: "sara.ahmed@yahoo.com" },
  { $set: { firstName: "Sarsoor" } }
);

if (result.matchedCount === 0) {
  console.log("No clients found with that email");
} else if (result.modifiedCount === 0) {
  console.log("Name was the same, no change");
} else {
  console.log("Name updated successfully-New password:");
}
result = await Client.findOne({email:"sara.ahmed@yahoo.com"})
if(!result){
  console.log("Client not found");
}
else{
  console.log("Updated client: ",result);
}

    // DELETE an inactive agent
    let deleted = await Agent.deleteOne({ isActive: false });
    console.log(`Deleted ${deleted.deletedCount} inactive agent.`);

    //delete a case
    deleted = await Case.deleteOne({_id:cases[18]._id});
    const deletedCase = Case.findById({_id:cases[18]._id});
    if(!deletedCase){
      console.log("Case deleted successfully");
    }


    // AGGREGATION
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
    ]);//count agents per role

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

const agentId = agents[0]._id; // sample agent from inserted data

const activeCasesForAgent = await Case.aggregate([
  {
    $match: {
      assignedAgentID: agentId,
      case_status: { $ne: "solved" }
    }
  },
  {
    $lookup: {
      from: "action_protocols",
      localField: "recommendedActionProtocol",
      foreignField: "_id",
      as: "protocol"
    }
  },
  {
    $unwind: {
      path: "$protocol",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $addFields: {
      recommendedActionProtocolType: "$protocol.type"
    }
  },
  {
    $project: {
      protocol: 0
    }
  },
  {
    $sort: { createdAt: -1 }
  }
]);

console.log("Active cases for agent:", activeCasesForAgent); //list active cases for a specific agent along with recommended action protocol type


const solvedCasesByAgent = await Case.aggregate([
  {
    $match: {
      assignedAgentID: agents[1]._id,
      case_status: "solved"
    }
  },
  {
    $lookup: {
      from: "agents",
      localField: "assignedAgentID",
      foreignField: "_id",
      as: "agentInfo"
    }
  },
  { $unwind: "$agentInfo" },
  {
    $project: {
      case_description: 1,
      case_status: 1,
      createdAt: 1,
      updatedAt: 1,
      agentName: "$agentInfo.name",
      agentEmail: "$agentInfo.email"
    }
  },
  {
    $sort: { createdAt: -1 }
  }
]);

console.log("Solved cases by agent:", solvedCasesByAgent);


const unassignedCases = await Case.aggregate([
  {
    $match: {
      assignedAgentID: null,
      case_status: "unsolved"
    }
  },
  {
    $sort: { createdAt: -1 }
  },
  {
    $project: {
      assignedAgentID: 0
    }
  }
]);

console.log("Unassigned unsolved cases:", unassignedCases);


const supervisorAgentIds = agents
  .filter(a => a.supervisorID.equals(supervisors[0]._id))
  .map(a => a._id);

const caseStatusCounts = await Case.aggregate([
  {
    $match: {
      $or: [
        { assignedAgentID: null },
        { assignedAgentID: { $in: supervisorAgentIds } }
      ]
    }
  },
  {
    $group: {
      _id: "$case_status",
      count: { $sum: 1 }
    }
  }
]);

console.log("Case counts for supervisor:", caseStatusCounts);


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
          pattern: "^(\\+2)?\\d{11}$"
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
