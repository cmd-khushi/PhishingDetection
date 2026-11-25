// Out-of-Band Verification Standard Operating Procedures (SOPs)

export const VERIFICATION_PLAYBOOKS = [
  {
    category: 'Banking & Financial Portals',
    riskContext: 'Urgent notification stating credit/debit card, wire, or account is suspended or compromised.',
    unsafeAction: 'Clicking embedded "Verify Account" links or dialing contact numbers listed inside the email message.',
    verifiedProtocol: 'Open official banking app or independently type authentic URL (e.g. chase.com) into a separate browser window. Check internal secure inbox. Alternatively, call the customer support number printed on the physical payment card.',
    keyPrinciple: 'Financial institutions never demand password entry, PINs, or full 16-digit card numbers via external email redirect links.'
  },
  {
    category: 'Enterprise SSO & Password Resets',
    riskContext: 'Alert indicating Microsoft 365, Google Workspace, or Okta credentials expire immediately.',
    unsafeAction: 'Entering existing username and current password on an external redirected authentication form.',
    verifiedProtocol: "Navigate directly to your company's internal SSO dashboard bookmark or verify with internal IT Helpdesk via corporate chat (Slack / Teams) before action.",
    keyPrinciple: 'Authentic IT administrators do not ask employees to submit current passwords to avoid service interruption.'
  },
  {
    category: 'Executive Impersonation (CEO / BEC)',
    riskContext: 'Urgent email from executive requesting confidential wire transfer, payroll records, or gift cards with instructions not to call.',
    unsafeAction: 'Bypassing standard dual-authorization payment procedures to fulfill an urgent request from "leadership".',
    verifiedProtocol: 'Contact executive in person, phone their official office extension, or verify via corporate Slack/Teams. Require secondary sign-off from finance.',
    keyPrinciple: 'Executives will not terminate staff for observing dual-control financial authorization policies.'
  },
  {
    category: 'Couriers & Customs Duty (FedEx / DHL / USPS)',
    riskContext: 'Notice that international delivery is held pending payment of a small clearance or duty fee.',
    unsafeAction: 'Clicking shortened links (bit.ly, tinyurl) and entering credit card data on third-party domains.',
    verifiedProtocol: 'Copy the tracking number only. Navigate directly to fedex.com, ups.com, or dhl.com, and paste tracking code into the official tracker.',
    keyPrinciple: 'Carriers do not require gift cards or credit card numbers on unfamiliar web domains to complete routine parcel deliveries.'
  },
  {
    category: 'Vendor Invoices & Bank Account Changes',
    riskContext: 'Email from a known supplier stating their banking details have changed and updated routing numbers must be used for payment.',
    unsafeAction: 'Updating payment routing details in the ERP system based solely on an email request or email attachment invoice.',
    verifiedProtocol: 'Call the vendor controller or account manager using the phone number stored in your vendor master file (never the number on the new email or invoice). Require dual-finance confirmation.',
    keyPrinciple: 'Never modify financial beneficiary details without direct verbal out-of-band confirmation via a pre-established contact method.'
  },
  {
    category: 'Tax Authorities & Government Compliance',
    riskContext: 'Demands for overdue tax penalties or notification of unclaimed tax refunds with immediate legal threat.',
    unsafeAction: 'Filling in Social Security Numbers, banking login details, or paying penalties with prepaid cards or cryptocurrency.',
    verifiedProtocol: 'Navigate directly to official government portals (irs.gov, gov.uk) or contact official regional helplines listed in government directories.',
    keyPrinciple: 'Government revenue services communicate initial audit notices and refund options via physical postal mail, never via urgent email links.'
  }
];

export default VERIFICATION_PLAYBOOKS;
