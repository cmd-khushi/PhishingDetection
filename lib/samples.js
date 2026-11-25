// Pre-loaded realistic test payloads for quick triage

export const SAMPLE_EMAILS = [
  {
    id: 'paypal-phish',
    title: 'PayPal: Account Suspension',
    type: 'Likely Phishing',
    category: 'Credential Harvesting',
    sender: 'PayPal Security Operations <service-update@paypa1-security-desk.xyz>',
    subject: 'URGENT: Your PayPal Account Has Been Suspended Within 24 Hours',
    body: `Dear Customer,

We detected unauthorized access to your account from an unrecognized IP address in Moscow, Russia on November 24. For your protection, your access has been temporarily limited.

Immediate action required: You must confirm your identity and verify your billing credentials within 24 hours, or your account will be permanently closed and any remaining balance forfeited.

Please click the secure link below to restore your access:
https://www.paypal.com/signin?session=verify-account-identity-now

<a href="http://194.26.29.112/webscr/login.php?cmd=_login-run">Click here to verify your account immediately</a>

Failure to act promptly will result in a permanent ban.

Sincerely,
PayPal Security & Fraud Operations Team`
  },
  {
    id: 'ceo-giftcard-bec',
    title: 'Executive BEC: Wire / Gift Cards',
    type: 'Likely Phishing',
    category: 'Business Email Compromise',
    sender: 'Jonathan Reynolds (CEO) <jonathan.reynolds.ceo992@gmail.com>',
    subject: 'Quick task - Are you at your desk right now?',
    body: `Hi,

Are you at your desk right now? I need you to handle an urgent confidential assignment for our executive board meeting this afternoon.

I am currently tied up in meetings with prospective investors and cannot take phone calls. Please keep this strictly confidential and do not mention it to anyone in the office yet.

We need to purchase 10 Apple Gift Cards ($500 each) for the client presentation. Can you purchase these immediately and email me clear photos of the codes on the back? I will ensure accounting reimburses your expense report first thing tomorrow morning.

Confirm as soon as you see this.

Best regards,
Jonathan Reynolds
Chief Executive Officer`
  },
  {
    id: 'm365-password-expiry',
    title: 'Microsoft 365: Password Expiration',
    type: 'Likely Phishing',
    category: 'Enterprise SSO Spoofing',
    sender: 'Microsoft Office365 Helpdesk <no-reply@micros0ft-portal-auth.com>',
    subject: 'Action Required: Your Microsoft 365 Password Expires Today',
    body: `Attention: Member,

Your enterprise Microsoft Office 365 password will expire in 2 hours. To retain your current password and prevent email disruption, update your credentials through the corporate self-service portal.

Keep Your Existing Password:
[Keep Same Password & Sync Credentials](http://login.microsoftonline.com.account-sync-auth.top/adfs/ls)

If no action is taken, your access to Outlook, Teams, and OneDrive will be terminated immediately.

IT Systems Administrator
Global IT Helpdesk`
  },
  {
    id: 'dhl-shipping-scam',
    title: 'DHL Express: Unclaimed Parcel Duty',
    type: 'Likely Phishing',
    category: 'Smishing / Delivery Lure',
    sender: 'DHL Express Delivery <tracking-updates@dhl-parcel-notification.info>',
    subject: 'Package Tracking #94827103: Delivery Pending Clearance Fee',
    body: `Dear Valued Customer,

Your inbound international parcel (Tracking #DHL-94827103) is currently held at our local distribution hub due to an unpaid customs duty fee of $2.49.

To release your shipment for doorstep delivery tomorrow morning, pay the balance using our mobile dispatch terminal:

Track & Pay Clearance Fee:
http://bit.ly/dhl-express-duty-clearance

Packages held for more than 48 hours without payment will be returned to the overseas sender.

Thank you for choosing DHL Express.
Customer Support Desk`
  },
  {
    id: 'vendor-inquiry-suspicious',
    title: 'Vendor Inquiry: Unsolicited Statement',
    type: 'Suspicious',
    category: 'Accounts Payable Triage',
    sender: 'Apex Solutions Billing <accounts-receivable@apex-billing-hub.com>',
    subject: 'Overdue Statement of Accounts - Statement #9842',
    body: `Dear Accounts Payable,

Attached is our updated monthly statement for services rendered through November 2026.

Please verify the outstanding balance of $3,450.00 against your purchase orders and confirm the anticipated payment remittance date:

View Encrypted Statement Portal:
https://apex-billing-hub.com/invoices/statement-9842

If you believe this statement was sent in error or have questions regarding invoice line items, please contact our receivables department.

Kind regards,
Accounts Receivable Operations
Apex Solutions Global`
  },
  {
    id: 'hr-benefit-update',
    title: 'HR Department: Open Enrollment',
    type: 'Suspicious',
    category: 'Third-Party Survey Lure',
    sender: 'Corporate HR Portal <hr-benefits-notification@employee-survey-cloud.net>',
    subject: 'Notice: 2027 Open Enrollment Benefits Confirmation',
    body: `Hello Team,

This is a reminder that the annual healthcare and retirement benefits enrollment window closes this Friday.

Please take a few moments to review your selected healthcare plan and confirm your designated beneficiaries.

You can complete the survey and review options here:
https://employee-survey-cloud.net/forms/benefits-review-2027

If you have questions, please reach out to your local human resources representative.

Regards,
Benefits Coordination Team`
  },
  {
    id: 'google-security-alert',
    title: 'Google: New Sign-in Alert',
    type: 'Likely Legitimate',
    category: 'Authentic Security Alert',
    sender: 'Google <no-reply@accounts.google.com>',
    subject: 'Security alert: New sign-in on Windows device',
    body: `Hi Alex,

Your Google Account was just signed in to from a new Windows device.

Device: Chrome on Windows
Location: New Delhi, India
Time: Nov 24, 2026, 9:15 PM (IST)

If this was you, you don't need to do anything.

If you didn't sign in, please check your account activity and secure your account:
https://myaccount.google.com/notifications

You can also see security activity at:
https://myaccount.google.com/device-activity

Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA`
  },
  {
    id: 'amazon-order-confirm',
    title: 'Amazon: Order Confirmation',
    type: 'Likely Legitimate',
    category: 'Authentic Transaction',
    sender: 'Amazon.com <auto-confirm@amazon.com>',
    subject: 'Your Amazon.com order #112-9482019-3829104',
    body: `Hello Alex,

Thank you for your order! We'll send a confirmation once your item ships.

Order Details:
Order #112-9482019-3829104
Placed on Monday, November 24, 2026

Items Ordered:
1x Anker USB-C Fast Charger Cable (6ft) - $14.99
Shipping Speed: Two-Day Delivery (Prime)

View or manage your order anytime at:
https://www.amazon.com/your-orders

Need assistance? Visit Customer Service at:
https://www.amazon.com/help

Thank you for shopping with us!
Amazon.com`
  }
];

export default SAMPLE_EMAILS;
