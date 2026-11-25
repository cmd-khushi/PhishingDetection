// Core Heuristic and Deterministic Detection Engine

export const TARGETED_BRANDS = [
  { name: 'PayPal', domains: ['paypal.com'], keywords: ['paypal', 'paypa1'] },
  { name: 'Microsoft', domains: ['microsoft.com', 'office365.com', 'live.com', 'outlook.com', 'microsoftonline.com'], keywords: ['microsoft', 'office365', 'outlook', 'micros0ft', 'msft'] },
  { name: 'Google', domains: ['google.com', 'accounts.google.com'], keywords: ['google', 'gsuite'] },
  { name: 'Apple', domains: ['apple.com', 'icloud.com'], keywords: ['apple', 'icloud', 'app1e'] },
  { name: 'Amazon', domains: ['amazon.com', 'amazon.co.uk'], keywords: ['amazon', 'amaz0n'] },
  { name: 'Netflix', domains: ['netflix.com'], keywords: ['netflix', 'netf1ix'] },
  { name: 'Bank of America', domains: ['bankofamerica.com', 'bofa.com'], keywords: ['bank of america', 'bofa'] },
  { name: 'Chase Bank', domains: ['chase.com'], keywords: ['chase bank', 'chase.com', 'jpmorgan'] },
  { name: 'Wells Fargo', domains: ['wellsfargo.com'], keywords: ['wells fargo', 'wellsfargo'] },
  { name: 'FedEx', domains: ['fedex.com'], keywords: ['fedex', 'federal express'] },
  { name: 'DHL Express', domains: ['dhl.com'], keywords: ['dhl express', 'dhl'] },
  { name: 'UPS', domains: ['ups.com'], keywords: ['ups tracking', 'united parcel'] },
  { name: 'DocuSign', domains: ['docusign.com', 'docusign.net'], keywords: ['docusign', 'docus1gn'] },
  { name: 'Dropbox', domains: ['dropbox.com'], keywords: ['dropbox'] },
  { name: 'IRS / Tax Authority', domains: ['irs.gov', 'gov.uk'], keywords: ['internal revenue service', 'irs refund', 'tax refund', 'hmrc'] }
];

export const SUSPICIOUS_TLDS = [
  '.xyz', '.top', '.tk', '.ml', '.ga', '.cf', '.gq', '.buzz', '.icu', 
  '.work', '.click', '.loan', '.date', '.racing', '.win', '.bid', '.stream',
  '.party', '.trade', '.accountant', '.download', '.review', '.country', '.kim'
];

export const FREE_MAIL_PROVIDERS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 
  'protonmail.com', 'zoho.com', 'mail.com', 'yandex.com', 'gmx.com', 'icloud.com'
];

export const URL_SHORTENERS = [
  'bit.ly', 'tinyurl.com', 't.co', 'is.gd', 'ow.ly', 'buff.ly', 
  'cutt.ly', 'goo.gl', 'tiny.cc', 'rb.gy', 'shorte.st'
];

export const PHISHING_KEYWORDS = [
  { pattern: /\b(immediate(ly)? action required|urgent(ly)?|act now|within (24|12|48|2) hours|account will be (suspended|closed|terminated|locked|deleted)|final notice|last warning|time[- ]sensitive)\b/gi, category: 'urgency', weight: 15, label: 'Manufactured Urgency' },
  { pattern: /\b(security alert|unauthorized (access|transaction|login|activity)|suspicious activity detected|compromised)\b/gi, category: 'security_alarm', weight: 12, label: 'Security Alarm Trigger' },
  { pattern: /\b(verify your (account|identity|password|credentials|ssn|social security)|confirm your (identity|password|details|billing|card)|update your (payment|billing|profile))\b/gi, category: 'credential_harvesting', weight: 20, label: 'Credential Harvesting Lure' },
  { pattern: /\b(wire transfer|gift card|apple gift|itunes card|steam card|crypto(currency)?|bitcoin|btc|wallet address|western union|moneygram)\b/gi, category: 'financial_fraud', weight: 22, label: 'Irreversible Financial Lure' },
  { pattern: /\b(overdue (payment|invoice|statement)|unpaid balance|past due|remittance advice|outstanding balance|remit payment)\b/gi, category: 'financial_pressure', weight: 18, label: 'Unsolicited Financial Claim' },
  { pattern: /\b(lottery|won|winner|prize|inheritance|compensation fund|unclaimed funds|\$\d{2,}(,\d{3})*(\.\d{2})?(\s*million|\s*usd)?)\b/gi, category: 'greed_lure', weight: 18, label: 'Unrealistic Financial Incentive' },
  { pattern: /\b(ceo|chief executive|cfo|director|board of directors|human resources department|payroll department|it helpdesk|system administrator|network operations|tax refund)\b/gi, category: 'authority', weight: 10, label: 'Executive / Authority Citation' },
  { pattern: /\b(confidential|keep this private|do not call me|i am in a meeting|cannot take calls|discrete)\b/gi, category: 'secrecy', weight: 15, label: 'Mandated Secrecy Protocol' },
  { pattern: /^(dear (customer|user|client|member|account holder|sir[\/\\]madam|valued customer)|attention: member)/gmi, category: 'generic_salutation', weight: 8, label: 'Impersonal Generic Salutation' },
  { pattern: /\b(enrollment window closes|benefits review|complete the survey|designated beneficiaries|open enrollment)\b/gi, category: 'hr_benefits_lure', weight: 14, label: 'Internal HR Survey Request' },
  { pattern: /\b(click (here|below|this link)|open the attached (invoice|statement|receipt|file|document)|download attachment)\b/gi, category: 'lure_cta', weight: 10, label: 'Coercive Action Call' },
  { pattern: /\b(\.(exe|scr|vbs|bat|iso|dmg|zip|tar\.gz|cmd|hta|ps1))\b/gi, category: 'dangerous_attachment', weight: 25, label: 'Dangerous Executable / Script' }
];

export function levenshteinDistance(s1, s2) {
  s1 = (s1 || '').toLowerCase();
  s2 = (s2 || '').toLowerCase();
  const m = s1.length;
  const n = s2.length;
  const d = [];

  for (let i = 0; i <= m; i++) d[i] = [i];
  for (let j = 0; j <= n; j++) d[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + cost
      );
    }
  }
  return d[m][n];
}

export function parseSender(senderStr) {
  senderStr = (senderStr || '').trim();
  let displayName = '';
  let email = senderStr;

  const match = senderStr.match(/^(.*?)\s*<([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})>$/);
  if (match) {
    displayName = match[1].replace(/^["']|["']$/g, '').trim();
    email = match[2].trim();
  } else {
    const emailMatch = senderStr.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (emailMatch) {
      email = emailMatch[1];
      displayName = senderStr.replace(emailMatch[0], '').replace(/[<>]/g, '').trim();
    }
  }

  const parts = email.split('@');
  const localPart = parts[0] || '';
  const domain = (parts[1] || '').toLowerCase();

  return { raw: senderStr, displayName, email: email.toLowerCase(), localPart, domain };
}

export function extractUrls(text) {
  if (!text) return [];
  const urls = [];
  const seen = new Set();

  // HTML links
  const htmlRegex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
  let match;
  while ((match = htmlRegex.exec(text)) !== null) {
    const href = match[1].trim();
    const anchorText = match[2].replace(/<[^>]+>/g, '').trim();
    if (!seen.has(href)) {
      seen.add(href);
      urls.push({ url: href, anchorText: anchorText || href, isHtml: true });
    }
  }

  // Markdown links
  const mdRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/gi;
  while ((match = mdRegex.exec(text)) !== null) {
    const anchorText = match[1].trim();
    const href = match[2].trim();
    if (!seen.has(href)) {
      seen.add(href);
      urls.push({ url: href, anchorText, isHtml: false });
    }
  }

  // Bare URLs
  const bareRegex = /\b(https?:\/\/[^\s<>"'{}|\\^`]+)/gi;
  while ((match = bareRegex.exec(text)) !== null) {
    const href = match[1].trim().replace(/[.,;!?)]+$/, '');
    if (!seen.has(href)) {
      seen.add(href);
      urls.push({ url: href, anchorText: href, isHtml: false });
    }
  }

  return urls;
}

export function analyzeUrl(urlObj) {
  const { url, anchorText } = urlObj;
  const issues = [];
  let riskScore = 0;
  let parsedDomain = '';
  let protocol = '';

  try {
    const parsed = new URL(url);
    parsedDomain = parsed.hostname.toLowerCase();
    protocol = parsed.protocol;
  } catch (e) {
    issues.push({
      type: 'malformed_url',
      severity: 'high',
      title: 'Malformed URL Syntax',
      description: `The URL '${url}' does not conform to RFC standard URI specifications.`
    });
    return { url, anchorText, domain: 'unknown', riskScore: 40, issues };
  }

  if (protocol === 'http:') {
    issues.push({
      type: 'insecure_http',
      severity: 'medium',
      title: 'Insecure Plaintext Protocol (HTTP)',
      description: 'Destination uses unencrypted HTTP rather than modern HTTPS.'
    });
    riskScore += 15;
  }

  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (ipRegex.test(parsedDomain)) {
    issues.push({
      type: 'ip_hostname',
      severity: 'critical',
      title: 'Raw IP Hostname Destination',
      description: `Direct numeric host (${parsedDomain}) bypasses standard domain name registration checks.`
    });
    riskScore += 40;
  }

  if (URL_SHORTENERS.includes(parsedDomain)) {
    issues.push({
      type: 'url_shortener',
      severity: 'high',
      title: 'Obfuscated Link Redirection',
      description: `Link shortener (${parsedDomain}) deliberately conceals true endpoint destination.`
    });
    riskScore += 25;
  }

  const hasSuspiciousTld = SUSPICIOUS_TLDS.some(tld => parsedDomain.endsWith(tld));
  if (hasSuspiciousTld) {
    issues.push({
      type: 'suspicious_tld',
      severity: 'high',
      title: 'High-Risk Top-Level Domain (TLD)',
      description: `Domain TLD frequently observed in disposable or high-volume phishing infrastructure.`
    });
    riskScore += 30;
  }

  const domainSegments = parsedDomain.split('.');
  if (domainSegments.length > 4) {
    issues.push({
      type: 'excessive_subdomains',
      severity: 'medium',
      title: 'Excessive Subdomain Depth',
      description: `Subdomain structure (${parsedDomain}) designed to obfuscate root domain.`
    });
    riskScore += 18;
  }

  if (anchorText && anchorText !== url) {
    const anchorUrlMatch = anchorText.match(/https?:\/\/([^\s\/]+)/i);
    if (anchorUrlMatch) {
      const anchorDomain = anchorUrlMatch[1].toLowerCase().replace(/^www\./, '');
      const actualDomain = parsedDomain.replace(/^www\./, '');
      if (anchorDomain !== actualDomain && !actualDomain.endsWith('.' + anchorDomain)) {
        issues.push({
          type: 'anchor_mismatch',
          severity: 'critical',
          title: 'Anchor Text Domain Mismatch',
          description: `Visible label points to '${anchorDomain}', but actual target connects to '${actualDomain}'.`
        });
        riskScore += 45;
      }
    }
  }

  for (const brand of TARGETED_BRANDS) {
    const hasBrandWord = brand.keywords.some(kw => parsedDomain.includes(kw));
    const isLegit = brand.domains.some(ld => parsedDomain === ld || parsedDomain.endsWith('.' + ld));
    if (hasBrandWord && !isLegit) {
      issues.push({
        type: 'brand_domain_spoofing',
        severity: 'critical',
        title: `Impersonated Brand in FQDN (${brand.name})`,
        description: `Host contains '${brand.name}' but is not authenticated by ${brand.name} infrastructure.`
      });
      riskScore += 50;
      break;
    }
  }

  return {
    url,
    anchorText,
    domain: parsedDomain,
    riskScore: Math.min(riskScore, 100),
    issues
  };
}

export function analyzeEmail({ sender, subject, body }) {
  const parsedSender = parseSender(sender);
  const urls = extractUrls(body);
  const analyzedUrls = urls.map(analyzeUrl);

  const indicators = {
    critical: [],
    warnings: [],
    safeSignals: []
  };

  let totalScore = 0;
  const detectedKeywords = [];

  // SENDER VERIFICATION
  if (!parsedSender.email) {
    indicators.critical.push({
      category: 'Sender',
      title: 'Invalid or Missing Sender Address',
      detail: 'No valid sender email address was detected in the payload.',
      weight: 30
    });
    totalScore += 30;
  } else {
    const senderDomain = parsedSender.domain;
    const senderName = parsedSender.displayName.toLowerCase();

    // Display Name vs Domain Impersonation
    for (const brand of TARGETED_BRANDS) {
      const nameMatchesBrand = brand.keywords.some(kw => senderName.includes(kw));
      const domainMatchesBrand = brand.domains.some(ld => senderDomain === ld || senderDomain.endsWith('.' + ld));

      if (nameMatchesBrand && !domainMatchesBrand) {
        indicators.critical.push({
          category: 'Sender',
          title: `Display Name Impersonation (${brand.name})`,
          detail: `Sender claims identity "${parsedSender.displayName}" in display headers, but origin domain is "${senderDomain}" (not authenticated by ${brand.name}).`,
          weight: 40
        });
        totalScore += 40;
        break;
      }
    }

    // Free Webmail with Corporate/Executive Claim
    const isFreeMail = FREE_MAIL_PROVIDERS.includes(senderDomain);
    const claimsAuthority = /bank|support|security|billing|admin|payroll|irs|apple|paypal|microsoft|chase|ceo|cfo|chief executive|director|president|board of directors/i.test(parsedSender.displayName) ||
                            /support|security|billing|admin|service|helpdesk|ceo|cfo|president/i.test(parsedSender.localPart);

    if (isFreeMail && claimsAuthority) {
      indicators.critical.push({
        category: 'Sender',
        title: 'Executive / Authority Claim via Free Public Webmail',
        detail: `Sender claims corporate/executive role ("${parsedSender.displayName || parsedSender.localPart}") but transmits via free consumer webmail (@${senderDomain}).`,
        weight: 45
      });
      totalScore += 45;
    } else if (isFreeMail && (subject.toLowerCase().includes('invoice') || subject.toLowerCase().includes('wire') || subject.toLowerCase().includes('w-2') || subject.toLowerCase().includes('gift card'))) {
      indicators.critical.push({
        category: 'Sender',
        title: 'Financial Transaction Topic from Free Webmail',
        detail: `Financial settlement or wire requests originated from public provider @${senderDomain}.`,
        weight: 35
      });
      totalScore += 35;
    }

    // Generic cloud provider claiming internal HR/Benefits
    const claimsInternalOrg = /hr|human resources|benefits|payroll|it helpdesk|employee/i.test(parsedSender.displayName) ||
                              /hr-|benefits-|payroll-|it-/i.test(parsedSender.localPart);
    const isGenericCloudDomain = /(-cloud|-survey|-portal|-forms|-app)\.(net|org|io|info|com)$/i.test(senderDomain);
    if (claimsInternalOrg && isGenericCloudDomain) {
      indicators.warnings.push({
        category: 'Sender',
        title: 'Internal Corporate Role via Third-Party Cloud Domain',
        detail: `Sender claims internal corporate role ("${parsedSender.displayName}") from external domain @${senderDomain}. Requires out-of-band HR confirmation.`,
        weight: 25
      });
      totalScore += 25;
    }

    // Suspicious TLD
    const senderHasSuspiciousTld = SUSPICIOUS_TLDS.some(tld => senderDomain.endsWith(tld));
    if (senderHasSuspiciousTld) {
      indicators.critical.push({
        category: 'Sender',
        title: 'Abuse-Prone TLD on Sending Domain',
        detail: `Sending domain (${senderDomain}) utilizes a high-abuse TLD frequently seen in disposable attack vectors.`,
        weight: 25
      });
      totalScore += 25;
    }

    // Typosquatting / Homoglyph check
    for (const brand of TARGETED_BRANDS) {
      for (const legitDomain of brand.domains) {
        const rootLegit = legitDomain.split('.')[0];
        const rootSender = senderDomain.split('.')[0];
        if (rootSender !== rootLegit && rootSender.length >= 4) {
          const dist = levenshteinDistance(rootSender, rootLegit);
          if (dist === 1 || (dist === 2 && rootLegit.length >= 6)) {
            indicators.critical.push({
              category: 'Sender',
              title: `Typosquatting Lookalike Domain (${senderDomain})`,
              detail: `Domain "${senderDomain}" is an intentional lookalike of legitimate "${legitDomain}" (edit distance: ${dist}).`,
              weight: 45
            });
            totalScore += 45;
            break;
          }
        }
      }
    }

    // Entropy check
    if (/^[a-z0-9]{12,}$/i.test(parsedSender.localPart) || /\d{6,}/.test(parsedSender.localPart)) {
      indicators.warnings.push({
        category: 'Sender',
        title: 'Automated High-Entropy Username',
        detail: `Sender account "${parsedSender.localPart}" exhibits machine-generated entropy characteristics.`,
        weight: 12
      });
      totalScore += 12;
    }

    // Authentic brand match
    const authenticBrand = TARGETED_BRANDS.find(brand => 
      brand.domains.some(ld => senderDomain === ld || senderDomain.endsWith('.' + ld))
    );
    if (authenticBrand) {
      indicators.safeSignals.push({
        category: 'Sender',
        title: `Authenticated Organization (${authenticBrand.name})`,
        detail: `Sender domain @${senderDomain} verified as authentic primary domain for ${authenticBrand.name}.`
      });
    }
  }

  // PSYCHOLOGICAL & CONTENT HEURISTICS
  const fullText = `${subject}\n${body}`;
  for (const item of PHISHING_KEYWORDS) {
    const matches = fullText.match(item.pattern);
    if (matches && matches.length > 0) {
      const uniqueMatches = Array.from(new Set(matches.map(m => m.trim())));
      detectedKeywords.push({
        category: item.category,
        label: item.label,
        weight: item.weight,
        matches: uniqueMatches
      });

      if (item.weight >= 18) {
        indicators.critical.push({
          category: 'Payload Vector',
          title: item.label,
          detail: `Detected vector: "${uniqueMatches.slice(0, 3).join('", "')}". Coercive attempt to bypass critical evaluation.`,
          weight: item.weight
        });
      } else {
        indicators.warnings.push({
          category: 'Payload Vector',
          title: item.label,
          detail: `Trigger phrase detected: "${uniqueMatches.slice(0, 3).join('", "')}".`,
          weight: item.weight
        });
      }
      totalScore += item.weight;
    }
  }

  if (/(urgent|critical|action required|suspended|fraud alert|security breach|wire transfer|overdue payment)/i.test(subject)) {
    indicators.warnings.push({
      category: 'Subject Line',
      title: 'Alarmist / Coercive Subject Phrasing',
      detail: `Subject "${subject}" utilizes artificial emergency signaling.`,
      weight: 10
    });
    totalScore += 10;
  }

  // URL EVALUATION
  if (analyzedUrls.length > 0) {
    let maxUrlRisk = 0;
    for (const u of analyzedUrls) {
      if (u.riskScore > maxUrlRisk) maxUrlRisk = u.riskScore;
      for (const issue of u.issues) {
        if (issue.severity === 'critical') {
          indicators.critical.push({
            category: 'Hyperlink Check',
            title: issue.title,
            detail: `${issue.description} Target: ${u.url}`,
            weight: 35
          });
          totalScore += 35;
        } else {
          indicators.warnings.push({
            category: 'Hyperlink Check',
            title: issue.title,
            detail: `${issue.description} Target: ${u.url}`,
            weight: 15
          });
          totalScore += 15;
        }
      }
    }

    if (maxUrlRisk === 0) {
      indicators.safeSignals.push({
        category: 'Hyperlink Check',
        title: 'Clean HTTPS Destination Protocols',
        detail: `Found ${analyzedUrls.length} link(s), all using validated HTTPS and verified corporate hostnames.`
      });
    }
  }

  // INTENT & TONE SYNTHESIS
  let primaryIntent = 'Routine Notification';
  let toneAnalysis = 'Neutral & Informative';

  if (detectedKeywords.some(k => k.category === 'credential_harvesting')) {
    primaryIntent = 'Credential Harvesting';
  } else if (detectedKeywords.some(k => k.category === 'financial_fraud')) {
    primaryIntent = 'Business Email Compromise (BEC)';
  } else if (detectedKeywords.some(k => k.category === 'financial_pressure')) {
    primaryIntent = 'Unsolicited Invoice / Account Inquiry';
  } else if (detectedKeywords.some(k => k.category === 'greed_lure')) {
    primaryIntent = 'Advance Fee Fraud';
  } else if (detectedKeywords.some(k => k.category === 'security_alarm')) {
    primaryIntent = 'Account Security Lure';
  } else if (detectedKeywords.some(k => k.category === 'dangerous_attachment')) {
    primaryIntent = 'Malicious Payload Delivery';
  } else if (indicators.safeSignals.length > 0 && totalScore < 25) {
    primaryIntent = 'Verified Service Notification';
  }

  if (indicators.critical.length >= 2 || totalScore >= 60) {
    toneAnalysis = 'High Pressure & Coercive';
  } else if (indicators.warnings.length >= 2 || totalScore >= 35) {
    toneAnalysis = 'Urgent & Manipulative';
  } else {
    toneAnalysis = 'Calm & Transactional';
  }

  const normalizedScore = Math.min(Math.max(totalScore, 0), 100);

  // CLASSIFICATION
  let classification = 'Likely Legitimate';
  let classificationColor = 'emerald';
  let riskLevel = 'LOW';

  if (normalizedScore >= 65 || indicators.critical.length >= 2) {
    classification = 'Likely Phishing';
    classificationColor = 'rose';
    riskLevel = 'CRITICAL';
  } else if (normalizedScore >= 35 || indicators.critical.length === 1 || indicators.warnings.length >= 2) {
    classification = 'Suspicious';
    classificationColor = 'amber';
    riskLevel = 'MODERATE';
  } else {
    classification = 'Likely Legitimate';
    classificationColor = 'emerald';
    riskLevel = 'LOW';
  }

  // OPERATIONAL ACTION STEPS
  const safeNextSteps = [];
  if (classification === 'Likely Phishing') {
    safeNextSteps.push({
      action: 'Containment: Do Not Click Links or Download Attachments',
      description: 'Isolate message. Links are crafted to harvest single sign-on or banking credentials.',
      severity: 'critical'
    });
    safeNextSteps.push({
      action: 'Communication: Do Not Reply or Call Embedded Numbers',
      description: 'Do not interact with the sender. Attackers monitor responses to confirm active targets.',
      severity: 'critical'
    });
    safeNextSteps.push({
      action: 'Verification: Conduct Out-of-Band Validation',
      description: 'Navigate independently to official service portals (e.g. direct browser typing or verified intranet).',
      severity: 'info'
    });
    safeNextSteps.push({
      action: 'Reporting: Forward Full MIME Headers to Security Desk',
      description: 'Report to your corporate security operations center (SOC) or phishing@abuse mailboxes.',
      severity: 'info'
    });
  } else if (classification === 'Suspicious') {
    safeNextSteps.push({
      action: 'Inspect Sender Domain Against Past Authentic Records',
      description: 'Verify if previous genuine correspondence arrived from this specific root domain.',
      severity: 'warning'
    });
    safeNextSteps.push({
      action: 'Verify Request via Secondary Out-of-Band Channel',
      description: 'Contact sender via verified company Slack/Teams or phone directory before taking action.',
      severity: 'info'
    });
    safeNextSteps.push({
      action: 'Examine Raw Link Targets Without Clicking',
      description: 'Review destination hostnames in URL inspector before any interaction.',
      severity: 'info'
    });
  } else {
    safeNextSteps.push({
      action: 'Standard Email Hygiene',
      description: 'Indicators reflect legitimate enterprise communication. Exercise routine diligence with unexpected requests.',
      severity: 'safe'
    });
    safeNextSteps.push({
      action: 'Confirm Out-of-Band if Financial Details Change',
      description: 'Even verified accounts can occasionally suffer account takeover. Confirm wire/account modifications verbally.',
      severity: 'info'
    });
  }

  return {
    classification,
    classificationColor,
    riskLevel,
    score: normalizedScore,
    sender: parsedSender,
    urls: analyzedUrls,
    indicators,
    detectedKeywords,
    primaryIntent,
    toneAnalysis,
    safeNextSteps
  };
}
