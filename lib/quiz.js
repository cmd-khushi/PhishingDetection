// Interactive Awareness & Social Engineering Defense Assessment

export const AWARENESS_QUIZ = [
  {
    id: 1,
    question: "You receive an email from 'IT Helpdesk <support@micros0ft-portal-auth.com>' stating your SSO password expires in 2 hours. What is the most definitive technical indicator of fraud?",
    options: [
      { text: "The email arrived during standard business hours.", correct: false, explanation: "Normal working hours occur in both authentic and malicious emails." },
      { text: "The domain uses typosquatting ('micros0ft' with digit '0' instead of letter 'o').", correct: true, explanation: "Correct. Typosquatting exploits visual similarity to bypass glance inspection and impersonate trusted domains." },
      { text: "The message contains official Microsoft logo images.", correct: false, explanation: "Logos are easily cloned from public sources and do not validate sending infrastructure." },
      { text: "The message asks you to save your work before logging out.", correct: false, explanation: "Standard courteous filler text designed to make the communication seem routine." }
    ]
  },
  {
    id: 2,
    question: "What characterizes 'Display Name Impersonation' in email headers?",
    options: [
      { text: "When an attacker injects custom CSS font sizes into the email subject.", correct: false, explanation: "Font styling does not spoof envelope or header identities." },
      { text: "When the visible friendly name reads 'PayPal Support', but the actual sending mailbox is on an arbitrary public domain (e.g. @gmail.com or @xyz).", correct: true, explanation: "Correct. Many email clients emphasize the friendly display name over the sending address, which attackers exploit." },
      { text: "When an email has an encrypted PDF attachment.", correct: false, explanation: "Encrypted attachments are payload obfuscation techniques, not identity spoofing." },
      { text: "When the subject line contains all uppercase text.", correct: false, explanation: "Uppercase text is spam styling, not display name spoofing." }
    ]
  },
  {
    id: 3,
    question: "You hover your mouse over an email link labeled 'https://www.bankofamerica.com/login', but the preview tooltip points to 'http://194.26.29.112/auth'. What does this indicate?",
    options: [
      { text: "The bank is routing traffic through a local Content Delivery Network node.", correct: false, explanation: "Financial institutions never point customers to unauthenticated raw numeric IP addresses." },
      { text: "Anchor text domain deception leading to an unencrypted credential harvesting landing page.", correct: true, explanation: "Correct. The visible text was forged to mimic an authentic bank URL while secretly directing your browser to an attacker-controlled server." },
      { text: "Your browser's DNS cache is resolving an internal private subnet.", correct: false, explanation: "DNS caching does not modify the underlying destination of HTML hyperlinks." },
      { text: "A routine security health check conducted by your email client.", correct: false, explanation: "Email clients do not alter anchor targets to external numeric IPs." }
    ]
  },
  {
    id: 4,
    question: "Why do phishing campaigns heavily rely on artificial deadlines (e.g. 'Account suspended within 24 hours')?",
    options: [
      { text: "Because email security gateways automatically drop emails older than 24 hours.", correct: false, explanation: "Mail transport agents do not automatically drop emails after 24 hours." },
      { text: "To induce cognitive panic and force recipients to bypass critical verification procedures.", correct: true, explanation: "Correct. Manufactured urgency triggers an emotional fight-or-flight response, reducing deliberate analytical scrutiny." },
      { text: "It is an ICANN regulatory requirement for account closures.", correct: false, explanation: "ICANN does not mandate 24-hour threat notices to consumers." },
      { text: "To optimize server CPU utilization on the sender's infrastructure.", correct: false, explanation: "Email urgency does not affect server compute cycles." }
    ]
  },
  {
    id: 5,
    question: "An email from your CEO from a personal address asks you to urgently purchase $3,000 in gift cards for an investor meeting and strictly forbids calling because 'I am in a private meeting'. What is the correct protocol?",
    options: [
      { text: "Buy the gift cards immediately using personal funds to prove loyalty.", correct: false, explanation: "Classic Business Email Compromise victim behavior. Corporate reimbursement is rarely approved for gift card scams." },
      { text: "Reply to the email asking for confirmation of the card denomination.", correct: false, explanation: "Replying routes back directly to the attacker." },
      { text: "Stop and verify independently through a secondary verified channel (in person, or via official office telephone).", correct: true, explanation: "Correct. Executive gift card requests with mandated secrecy are almost exclusively BEC attacks. Always verify out-of-band." },
      { text: "Forward the email to the entire company distribution list.", correct: false, explanation: "Spreading the message causes organizational confusion." }
    ]
  }
];

export default AWARENESS_QUIZ;
