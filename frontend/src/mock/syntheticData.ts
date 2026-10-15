import { GraphNodeData, GraphEdgeData, SuspiciousAlert, CaseFile, TimelineEvent } from '../types';

export const SYNTHETIC_NODES: GraphNodeData[] = [
  // Cluster Alpha: Mule Ring & Device Collusion (Operation Chakravyuh)
  {
    id: 'ACC_VICTIM_1',
    label: 'anand.verma@okaxis',
    type: 'account',
    riskScore: 12,
    status: 'flagged',
    subText: 'Axis Bank • **** 9102',
    upiId: 'anand.verma@okaxis',
    accountNo: 'AXIS910238120',
    bankName: 'Axis Bank',
    tags: ['Victim Account', 'Reported Incident'],
  },
  {
    id: 'ACC_PRIMARY_MULE',
    label: 'rohit.sharma@paytm',
    type: 'account',
    riskScore: 96,
    status: 'flagged',
    subText: 'Paytm Payments Bank • **** 4421',
    upiId: 'rohit.sharma@paytm',
    accountNo: 'PYTM44219088',
    bankName: 'Paytm Bank',
    tags: ['Aggregator Hub', 'Rapid Dispersion', 'High Velocity'],
  },
  {
    id: 'ACC_MULE_2',
    label: 'karan.singh@icici',
    type: 'account',
    riskScore: 92,
    status: 'flagged',
    subText: 'ICICI Bank • **** 1190',
    upiId: 'karan.singh@icici',
    accountNo: 'ICIC11903342',
    bankName: 'ICICI Bank',
    tags: ['Layer 2 Mule', 'Quick Hop'],
  },
  {
    id: 'ACC_MULE_3',
    label: 'deepak.gupta@kotak',
    type: 'account',
    riskScore: 89,
    status: 'flagged',
    subText: 'Kotak Bank • **** 6678',
    upiId: 'deepak.gupta@kotak',
    accountNo: 'KOTK66782291',
    bankName: 'Kotak Mahindra',
    tags: ['Layer 2 Mule', 'Structuring'],
  },
  {
    id: 'ACC_MULE_4',
    label: 'amit.patel@oksbi',
    type: 'account',
    riskScore: 94,
    status: 'flagged',
    subText: 'State Bank of India • **** 3320',
    upiId: 'amit.patel@oksbi',
    accountNo: 'SBIN33201109',
    bankName: 'SBI',
    tags: ['Layer 2 Mule', 'Shared Device'],
  },
  {
    id: 'DEV_FARM_1',
    label: 'DEV-IMEI-889021-X9',
    type: 'device',
    riskScore: 98,
    status: 'flagged',
    subText: 'OnePlus 11R • Android 14',
    deviceId: 'DEV-IMEI-889021-X9',
    deviceModel: 'OnePlus 11R (CPH2487)',
    tags: ['Device Farm', 'Multi-VPA Host', 'Rooted Environment'],
  },
  {
    id: 'MERCH_CASHOUT',
    label: 'Kishan Electronics & Gold QR',
    type: 'merchant',
    riskScore: 88,
    status: 'flagged',
    subText: 'Merchant QR • MID-99042',
    merchantCategory: 'Consumer Electronics / Bullion',
    tags: ['Cashout Funnel', 'High Inflow Velocity', 'Off-Hours Spike'],
  },
  {
    id: 'COMPLAINT_NCRP_8812',
    label: 'NCRP-2026-8812',
    type: 'complaint',
    riskScore: 100,
    status: 'active',
    subText: 'Cyber Fraud FIR #412/26',
    complaintRef: 'NCRP-2026-8812',
    disputeAmount: 480000,
    tags: ['Extortion / APK Scam', 'High Priority'],
  },

  // Legitimate Baseline Nodes (for false positive & contrast evaluation)
  {
    id: 'ACC_LEGIT_1',
    label: 'priya.nair@okhdfc',
    type: 'account',
    riskScore: 8,
    status: 'verified',
    subText: 'HDFC Bank • **** 5512',
    upiId: 'priya.nair@okhdfc',
    bankName: 'HDFC Bank',
    tags: ['Verified Salary Account', 'Regular Pattern'],
  },
  {
    id: 'MERCH_GROCERY',
    label: 'Reliance Fresh Store 44',
    type: 'merchant',
    riskScore: 4,
    status: 'verified',
    subText: 'FMCG Retail • MID-10022',
    merchantCategory: 'Supermarket / Grocery',
    tags: ['Legitimate Merchant'],
  },
  {
    id: 'DEV_USER_LEGIT',
    label: 'DEV-PIXEL-7A-LEGIT',
    type: 'device',
    riskScore: 5,
    status: 'verified',
    subText: 'Pixel 7a • Android 14',
    deviceId: 'DEV-PIXEL-7A-LEGIT',
    deviceModel: 'Google Pixel 7a',
    tags: ['Single User Device'],
  }
];

export const SYNTHETIC_EDGES: GraphEdgeData[] = [
  // Fraud Ring flow
  {
    id: 'E_TXN_01',
    source: 'ACC_VICTIM_1',
    target: 'ACC_PRIMARY_MULE',
    amount: 480000,
    timestamp: '2026-10-15 14:02:11',
    utr: 'UTR20261015998012',
    channel: 'UPI_P2P',
    isSuspicious: true,
    ruleTriggered: 'RULE_ANOMALOUS_HIGH_VALUE_FIRST_TXN',
  },
  {
    id: 'E_TXN_02',
    source: 'ACC_PRIMARY_MULE',
    target: 'ACC_MULE_2',
    amount: 120000,
    timestamp: '2026-10-15 14:04:19',
    utr: 'UTR20261015998045',
    channel: 'UPI_P2P',
    isSuspicious: true,
    ruleTriggered: 'RULE_RAPID_DISPERSION_HOP1',
  },
  {
    id: 'E_TXN_03',
    source: 'ACC_PRIMARY_MULE',
    target: 'ACC_MULE_3',
    amount: 115000,
    timestamp: '2026-10-15 14:05:02',
    utr: 'UTR20261015998059',
    channel: 'UPI_P2P',
    isSuspicious: true,
    ruleTriggered: 'RULE_RAPID_DISPERSION_HOP1',
  },
  {
    id: 'E_TXN_04',
    source: 'ACC_PRIMARY_MULE',
    target: 'ACC_MULE_4',
    amount: 125000,
    timestamp: '2026-10-15 14:05:44',
    utr: 'UTR20261015998071',
    channel: 'UPI_P2P',
    isSuspicious: true,
    ruleTriggered: 'RULE_RAPID_DISPERSION_HOP1',
  },
  // Convergence to Cashout
  {
    id: 'E_TXN_05',
    source: 'ACC_MULE_2',
    target: 'MERCH_CASHOUT',
    amount: 118500,
    timestamp: '2026-10-15 14:08:12',
    utr: 'UTR20261015998110',
    channel: 'UPI_P2M',
    isSuspicious: true,
    ruleTriggered: 'RULE_CASHOUT_CONVERGENCE',
  },
  {
    id: 'E_TXN_06',
    source: 'ACC_MULE_3',
    target: 'MERCH_CASHOUT',
    amount: 114000,
    timestamp: '2026-10-15 14:09:05',
    utr: 'UTR20261015998124',
    channel: 'UPI_P2M',
    isSuspicious: true,
    ruleTriggered: 'RULE_CASHOUT_CONVERGENCE',
  },
  {
    id: 'E_TXN_07',
    source: 'ACC_MULE_4',
    target: 'MERCH_CASHOUT',
    amount: 123000,
    timestamp: '2026-10-15 14:09:55',
    utr: 'UTR20261015998139',
    channel: 'UPI_P2M',
    isSuspicious: true,
    ruleTriggered: 'RULE_CASHOUT_CONVERGENCE',
  },

  // Device Bindings (Shared device collusion!)
  {
    id: 'E_DEV_01',
    source: 'DEV_FARM_1',
    target: 'ACC_PRIMARY_MULE',
    amount: 0,
    timestamp: '2026-10-14 09:12:00',
    utr: 'BIND_889021_01',
    channel: 'DEVICE_BIND',
    isSuspicious: true,
    ruleTriggered: 'RULE_SHARED_DEVICE_CLUSTER',
  },
  {
    id: 'E_DEV_02',
    source: 'DEV_FARM_1',
    target: 'ACC_MULE_2',
    amount: 0,
    timestamp: '2026-10-14 09:40:15',
    utr: 'BIND_889021_02',
    channel: 'DEVICE_BIND',
    isSuspicious: true,
    ruleTriggered: 'RULE_SHARED_DEVICE_CLUSTER',
  },
  {
    id: 'E_DEV_03',
    source: 'DEV_FARM_1',
    target: 'ACC_MULE_3',
    amount: 0,
    timestamp: '2026-10-14 10:02:40',
    utr: 'BIND_889021_03',
    channel: 'DEVICE_BIND',
    isSuspicious: true,
    ruleTriggered: 'RULE_SHARED_DEVICE_CLUSTER',
  },
  {
    id: 'E_DEV_04',
    source: 'DEV_FARM_1',
    target: 'ACC_MULE_4',
    amount: 0,
    timestamp: '2026-10-14 10:15:22',
    utr: 'BIND_889021_04',
    channel: 'DEVICE_BIND',
    isSuspicious: true,
    ruleTriggered: 'RULE_SHARED_DEVICE_CLUSTER',
  },

  // Complaint link to Victim
  {
    id: 'E_CMP_01',
    source: 'COMPLAINT_NCRP_8812',
    target: 'ACC_VICTIM_1',
    amount: 480000,
    timestamp: '2026-10-15 14:45:00',
    utr: 'COMPLAINT_REF_8812',
    channel: 'COMPLAINT_LINK',
    isSuspicious: true,
    ruleTriggered: 'RULE_FORMAL_DISPUTE_FILED',
  },

  // Legitimate transfers
  {
    id: 'E_LEGIT_01',
    source: 'ACC_LEGIT_1',
    target: 'MERCH_GROCERY',
    amount: 1420,
    timestamp: '2026-10-15 11:30:10',
    utr: 'UTR20261015110488',
    channel: 'UPI_P2M',
    isSuspicious: false,
  },
  {
    id: 'E_DEV_LEGIT',
    source: 'DEV_USER_LEGIT',
    target: 'ACC_LEGIT_1',
    amount: 0,
    timestamp: '2026-08-10 12:00:00',
    utr: 'BIND_LEGIT_01',
    channel: 'DEVICE_BIND',
    isSuspicious: false,
  }
];

export const SYNTHETIC_ALERTS: SuspiciousAlert[] = [
  {
    id: 'ALT_2026_094',
    title: 'High-Velocity Structured Mule Ring & Shared Device Farm',
    clusterId: 'CLUSTER_ALPHA_CHAKRAVYUH',
    severity: 'CRITICAL',
    riskScore: 96,
    patternType: 'MULE_RING',
    totalVolume: 480000,
    involvedEntitiesCount: 7,
    detectedAt: '2026-10-15 14:12:00 IST',
    summary: '₹4,80,000 received from victim account within 2 mins and immediately structured into 3 parallel mule hops, converging at an electronics merchant QR. All 4 beneficiary VPAs share 1 rooted physical device.',
    evidence: [
      {
        ruleId: 'R-101',
        ruleName: 'Rapid Dispersion Velocity (< 5 Mins)',
        description: '97.5% of incoming funds dispersed across 3 external accounts within 213 seconds.',
        metrics: { 'Inflow (₹)': 480000, 'Dispersed (₹)': 360000, 'Hop Latency': '3m 33s' }
      },
      {
        ruleId: 'R-204',
        ruleName: 'Shared Device Hardware Identifier Abuse',
        description: 'Device DEV-IMEI-889021-X9 bound to 4 different user names across 3 distinct banking apps.',
        metrics: { 'Associated VPAs': 4, 'Root Flags Detected': 1, 'Distinct KYC Names': 4 }
      },
      {
        ruleId: 'R-309',
        ruleName: 'Cashout Funnel Convergence',
        description: 'All 3 secondary mule nodes settled funds at Merchant QR (MID-99042) within 150 seconds of each other.',
        metrics: { 'Funneled Volume (₹)': 355500, 'Merchant Category': 'Bullion / Electronics' }
      }
    ],
    suggestedAction: 'Immediate temporary lien freeze on 4 mule VPAs and blacklist hardware identifier DEV-IMEI-889021-X9.'
  },
  {
    id: 'ALT_2026_088',
    title: 'Circular Layering Syndicate (Potential Smurfing)',
    clusterId: 'CLUSTER_BETA_CYCLING',
    severity: 'HIGH',
    riskScore: 88,
    patternType: 'CIRCULAR_ROUTING',
    totalVolume: 240000,
    involvedEntitiesCount: 5,
    detectedAt: '2026-10-15 13:45:00 IST',
    summary: 'Closed-loop cyclic transactions detected across 4 bank accounts returning 92% of original principal to the originator minus 8% transaction commision.',
    evidence: [
      {
        ruleId: 'R-401',
        ruleName: 'Graph Cycle Detection (NetworkX DiGraph)',
        description: 'Directed cycle identified: ACC_A -> ACC_B -> ACC_C -> ACC_D -> ACC_A.',
        metrics: { 'Cycle Length': 4, 'Leakage Rate': '8.2%', 'Net Cycle Time': '18m 10s' }
      }
    ],
    suggestedAction: 'Escalate to Anti-Money Laundering (AML) supervisory queue for UTR-level KYC verification.'
  },
  {
    id: 'ALT_2026_067',
    title: 'Off-Hours High Velocity Merchant Inflow',
    clusterId: 'CLUSTER_GAMMA_MERCH',
    severity: 'MEDIUM',
    riskScore: 67,
    patternType: 'RAPID_DISPERSION',
    totalVolume: 125000,
    involvedEntitiesCount: 3,
    detectedAt: '2026-10-15 03:22:15 IST',
    summary: 'Unusual spike of 15 micro-transactions (₹8,000 - ₹9,900) processed between 02:30 AM and 03:30 AM on a small grocery QR.',
    evidence: [
      {
        ruleId: 'R-502',
        ruleName: 'Temporal Anomaly & Structuring Threshold',
        description: 'All transactions clustered immediately below the ₹10,000 SMS verification trigger threshold.',
        metrics: { 'Avg Txn (₹)': 8333, 'Hours Window': '02:00 - 04:00' }
      }
    ],
    suggestedAction: 'Request merchant settlement hold pending terminal verification.'
  }
];

export const SYNTHETIC_TIMELINE: TimelineEvent[] = [
  {
    id: 'TL-1',
    timestamp: '14:02:11',
    sender: 'anand.verma@okaxis',
    senderName: 'Anand Verma (Victim)',
    receiver: 'rohit.sharma@paytm',
    receiverName: 'Rohit Sharma (Aggregator Mule)',
    amount: 480000,
    utr: 'UTR20261015998012',
    isFlagged: true,
    anomalyReason: 'Initial Victim Drain / High-Value First Interaction'
  },
  {
    id: 'TL-2',
    timestamp: '14:04:19',
    sender: 'rohit.sharma@paytm',
    senderName: 'Rohit Sharma',
    receiver: 'karan.singh@icici',
    receiverName: 'Karan Singh (Mule 1)',
    amount: 120000,
    utr: 'UTR20261015998045',
    timeDeltaSeconds: 128,
    isFlagged: true,
    anomalyReason: 'Rapid Structuring Hop (Delta: 2m 8s)'
  },
  {
    id: 'TL-3',
    timestamp: '14:05:02',
    sender: 'rohit.sharma@paytm',
    senderName: 'Rohit Sharma',
    receiver: 'deepak.gupta@kotak',
    receiverName: 'Deepak Gupta (Mule 2)',
    amount: 115000,
    utr: 'UTR20261015998059',
    timeDeltaSeconds: 43,
    isFlagged: true,
    anomalyReason: 'Parallel Dispersion Split (Delta: 43s)'
  },
  {
    id: 'TL-4',
    timestamp: '14:05:44',
    sender: 'rohit.sharma@paytm',
    senderName: 'Rohit Sharma',
    receiver: 'amit.patel@oksbi',
    receiverName: 'Amit Patel (Mule 3)',
    amount: 125000,
    utr: 'UTR20261015998071',
    timeDeltaSeconds: 42,
    isFlagged: true,
    anomalyReason: 'Parallel Dispersion Split (Delta: 42s)'
  },
  {
    id: 'TL-5',
    timestamp: '14:08:12',
    sender: 'karan.singh@icici',
    senderName: 'Karan Singh',
    receiver: 'MERCH_CASHOUT',
    receiverName: 'Kishan Electronics & Gold QR',
    amount: 118500,
    utr: 'UTR20261015998110',
    timeDeltaSeconds: 148,
    isFlagged: true,
    anomalyReason: 'Cashout Convergence at Merchant QR'
  },
  {
    id: 'TL-6',
    timestamp: '14:09:05',
    sender: 'deepak.gupta@kotak',
    senderName: 'Deepak Gupta',
    receiver: 'MERCH_CASHOUT',
    receiverName: 'Kishan Electronics & Gold QR',
    amount: 114000,
    utr: 'UTR20261015998124',
    timeDeltaSeconds: 53,
    isFlagged: true,
    anomalyReason: 'Cashout Convergence at Merchant QR'
  },
  {
    id: 'TL-7',
    timestamp: '14:09:55',
    sender: 'amit.patel@oksbi',
    senderName: 'Amit Patel',
    receiver: 'MERCH_CASHOUT',
    receiverName: 'Kishan Electronics & Gold QR',
    amount: 123000,
    utr: 'UTR20261015998139',
    timeDeltaSeconds: 50,
    isFlagged: true,
    anomalyReason: 'Cashout Convergence at Merchant QR'
  }
];

export const SYNTHETIC_CASES: CaseFile[] = [
  {
    id: 'CASE-2026-0041',
    title: 'Operation Chakravyuh: Structured UPI Mule Ring',
    analyst: 'Bharath (Lead Backend & Forensics)',
    status: 'IN_REVIEW',
    priority: 'CRITICAL',
    createdAt: '2026-10-15 14:15 IST',
    flaggedVolume: 480000,
    primaryClusterId: 'CLUSTER_ALPHA_CHAKRAVYUH',
    notes: [
      {
        id: 'N-1',
        author: 'Investigator Priya',
        timestamp: '14:20 IST',
        text: 'NCRP complaint confirmed. Victim was lured into fake courier package customs scam. Funds drained via UPI.'
      },
      {
        id: 'N-2',
        author: 'Bharath',
        timestamp: '14:32 IST',
        text: 'Device DEV-IMEI-889021-X9 has logged 4 mule identities in the last 48 hours. Recommend lien freeze on Axis/Paytm/Kotak endpoints.'
      }
    ]
  },
  {
    id: 'CASE-2026-0038',
    title: 'Off-Peak Merchant Funneling Assessment',
    analyst: 'Devika (Financial Crimes Desk)',
    status: 'OPEN',
    priority: 'MEDIUM',
    createdAt: '2026-10-15 04:00 IST',
    flaggedVolume: 125000,
    primaryClusterId: 'CLUSTER_GAMMA_MERCH',
    notes: [
      {
        id: 'N-1',
        author: 'Devika',
        timestamp: '04:15 IST',
        text: 'Merchant KYC flagged pending physical premise verification.'
      }
    ]
  }
];
