// Legal content for MusterDeck's public legal pages.
//
// IMPORTANT: This is AI-drafted starter content modeled on common compliance
// patterns (GDPR/ePrivacy, CCPA/CPRA, PIPEDA). It is NOT legal advice and has
// not been reviewed by a lawyer. Every document below is marked `isDraft: true`
// so the UI shows a "pending legal review" banner. Do not treat as binding
// until a qualified human has reviewed it.
//
// Centralised contact + governing law (set 2026-06-09). Pages remain isDraft
// until a lawyer reviews them (planned closer to when monetization begins).
const PRIVACY_CONTACT = 'MusterDeck (Christoph Mayer) at cm@f-shift.com';
const GOVERNING_LAW = 'British Columbia, Canada';

export type LegalBlock = { type: 'paragraph'; text: string } | { type: 'list'; items: string[] };

export type LegalSection = {
  heading: string;
  blocks: LegalBlock[];
};

export type LegalDocumentId = 'privacy' | 'terms' | 'legal';

export type LegalDocument = {
  id: LegalDocumentId;
  eyebrow: string;
  title: string;
  lastUpdated: string;
  isDraft: boolean;
  intro: string;
  sections: LegalSection[];
};

const privacyPolicy: LegalDocument = {
  id: 'privacy',
  eyebrow: 'Legal',
  title: 'Privacy Policy',
  lastUpdated: '2026-06-09',
  isDraft: true,
  intro:
    'This policy explains what information MusterDeck collects, why we collect it, and the choices and rights you have. MusterDeck is an independent, fan-made tool, and we aim to collect as little personal data as possible.',
  sections: [
    {
      heading: 'Who we are',
      blocks: [
        {
          type: 'paragraph',
          text: 'MusterDeck is an independent fan-made operations tool for Star Citizen players and organizations. For the purposes of data-protection law, MusterDeck — operated by Christoph Mayer — is the controller of the personal data described here, and can be reached at cm@f-shift.com. We are not affiliated with Cloud Imperium Games or Roberts Space Industries.',
        },
      ],
    },
    {
      heading: 'Information we collect',
      blocks: [
        {
          type: 'paragraph',
          text: 'We collect only what we need to run your account and the operations features you use:',
        },
        {
          type: 'list',
          items: [
            'Account information: your email address and a securely hashed password, handled by our authentication provider (Supabase). We never store your password in readable form.',
            'Profile information: your display name (callsign), optional primary organization, and optional RSI handle.',
            'Operational data you create: the listings, rosters, assignments, settlement records, and similar content you enter while using the app.',
            'Linked-account identifiers: if you sign in with or connect Discord or Google, the account identifier and the basic profile details those services share with us (such as your email address and display name).',
            'Support and moderation records: messages you send us for support, and records of reports, moderation actions, or enforcement decisions relating to your account.',
            'Support and payment metadata (not enabled yet): if we later offer Patreon or paid features, your membership status or tier and basic subscription metadata. Full payment details are handled by the payment provider, not stored by us — see "How we share information."',
            'Essential local storage: small pieces of data stored in your browser to keep you signed in and remember basic app state. This is required for the app to function.',
          ],
        },
        {
          type: 'paragraph',
          text: 'We do not currently use any third-party analytics, advertising, or marketing trackers. If that ever changes, we will ask for your consent first through the cookie-preferences controls before any non-essential tracking runs.',
        },
      ],
    },
    {
      heading: 'How we use your information',
      blocks: [
        { type: 'paragraph', text: 'We use your information to:' },
        {
          type: 'list',
          items: [
            'Create and secure your account and keep you signed in.',
            'Provide the operations features (Rally Point, Fleet Command, S.P.O.I.L.S., Proving Ground) you choose to use.',
            'Maintain the integrity of the platform, including preventing abuse and enforcing our Terms of Service.',
            'Communicate with you about your account or important service changes.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Where the EU/UK GDPR applies, our lawful bases are: performance of our agreement with you (to provide the service), our legitimate interests (to keep the platform secure and working), and your consent (for anything optional, such as future analytics, which you can withdraw at any time).',
        },
      ],
    },
    {
      heading: 'Cookies and local storage',
      blocks: [
        {
          type: 'paragraph',
          text: 'MusterDeck uses only strictly-necessary browser storage today: your authentication session and basic functional state. Under EU/UK rules, strictly-necessary storage does not require consent because the service cannot work without it.',
        },
        {
          type: 'paragraph',
          text: 'We do not set advertising cookies and do not share data with ad networks. If we later add optional cookies or analytics, you will be able to accept or reject them through the cookie-preferences controls, and reject is the default.',
        },
      ],
    },
    {
      heading: 'Automated processing and bots',
      blocks: [
        {
          type: 'paragraph',
          text: 'MusterDeck operates some automation as part of running the platform — for example, syncing public Star Citizen ship-catalog data, automated anti-abuse and moderation checks, and integration with our Discord community and engineering tooling. This automation acts to operate and protect the service; it does not sell or trade your personal data.',
        },
        {
          type: 'paragraph',
          text: 'We do not authorize third-party bots, scrapers, or AI crawlers to harvest account data or member content from the platform. Restrictions on automated access are set out in our Terms of Service.',
        },
      ],
    },
    {
      heading: 'How we share information',
      blocks: [
        {
          type: 'paragraph',
          text: 'We do not sell your personal information, and we do not share it for cross-context behavioral advertising. We share data only with service providers ("sub-processors") that help us run MusterDeck, and only as needed:',
        },
        {
          type: 'list',
          items: [
            'Supabase — authentication and database hosting for your account and app data.',
            'GitHub Pages — hosting and delivery of the website.',
            'Discord — if you choose to link a Discord identity or interact with our community integrations.',
            'Google — if you choose to sign in with Google, for authenticating your account.',
            'Patreon or a payment processor (not enabled yet) — if we later offer support or paid features, the relevant provider processes membership and payment details under its own terms and privacy policy. MusterDeck does not receive or store your full card number.',
          ],
        },
        {
          type: 'paragraph',
          text: 'We may also disclose information where required by law, or to protect the rights, safety, and security of our users and the platform.',
        },
      ],
    },
    {
      heading: 'Data retention',
      blocks: [
        {
          type: 'paragraph',
          text: 'We keep your account and profile information for as long as your account is active. If you delete your account, we delete or anonymize your personal data within a reasonable period, except where we must keep certain records to comply with legal obligations or resolve disputes.',
        },
      ],
    },
    {
      heading: 'Your rights',
      blocks: [
        {
          type: 'paragraph',
          text: 'Depending on where you live, you have rights over your personal data. We honor these rights for all users wherever practical.',
        },
        {
          type: 'list',
          items: [
            'EU/UK (GDPR): access, correction, deletion, restriction, portability, objection, and the right to withdraw consent. You may also lodge a complaint with your local data-protection authority.',
            'California (CCPA/CPRA): where these laws apply, the right to know what we collect, to delete it, to correct it, and to opt out of the sale or sharing of personal information. We do not sell or share personal information, and we honor these rights for California users regardless of whether MusterDeck currently meets the law’s business-size thresholds.',
            'Canada (PIPEDA): the right to access your information and to challenge its accuracy, and our accountability for how it is handled.',
          ],
        },
        {
          type: 'paragraph',
          text: `To exercise any of these rights, contact ${PRIVACY_CONTACT}. We will respond within the time limits required by applicable law.`,
        },
      ],
    },
    {
      heading: 'International data transfers',
      blocks: [
        {
          type: 'paragraph',
          text: 'MusterDeck is used worldwide, and our service providers may process data in countries other than yours, including the United States. Where required, we rely on appropriate safeguards (such as standard contractual clauses) for international transfers.',
        },
      ],
    },
    {
      heading: "Children's privacy",
      blocks: [
        {
          type: 'paragraph',
          text: 'MusterDeck is not directed to children, and we do not knowingly collect personal data from anyone under the age required to consent in their country (for example, 16 in much of the EU and 13 in the United States). If you believe a child has provided us data, contact us and we will remove it.',
        },
      ],
    },
    {
      heading: 'Security',
      blocks: [
        {
          type: 'paragraph',
          text: 'We use reputable providers and reasonable technical measures to protect your data, including hashed passwords and access controls. No system is perfectly secure, but we work to keep your information safe.',
        },
      ],
    },
    {
      heading: 'Changes to this policy',
      blocks: [
        {
          type: 'paragraph',
          text: 'We may update this policy as the platform evolves or as our legal posture changes. We will update the "last updated" date above and, for significant changes, provide a more prominent notice.',
        },
      ],
    },
    {
      heading: 'Contact',
      blocks: [
        {
          type: 'paragraph',
          text: `For any privacy question or request, reach ${PRIVACY_CONTACT}.`,
        },
      ],
    },
  ],
};

const termsOfService: LegalDocument = {
  id: 'terms',
  eyebrow: 'Legal',
  title: 'Terms of Service',
  lastUpdated: '2026-06-09',
  isDraft: true,
  intro:
    'These terms govern your use of MusterDeck. By creating an account or using the app, you agree to them. MusterDeck is a fan-made tool currently provided free of charge and as-is; if we add paid features in future, separate paid-service terms will apply at checkout.',
  sections: [
    {
      heading: 'Acceptance of these terms',
      blocks: [
        {
          type: 'paragraph',
          text: 'By accessing or using MusterDeck, you agree to these Terms of Service and to our Privacy Policy. If you do not agree, please do not use the platform.',
        },
      ],
    },
    {
      heading: 'Eligibility and accounts',
      blocks: [
        {
          type: 'paragraph',
          text: 'You must be old enough to form a binding agreement and to consent to data processing in your country. You are responsible for the accuracy of your account information and for keeping your login credentials secure. You are responsible for activity that happens under your account.',
        },
      ],
    },
    {
      heading: 'Acceptable use',
      blocks: [
        { type: 'paragraph', text: 'You agree not to:' },
        {
          type: 'list',
          items: [
            'Break the law or infringe the rights of others while using MusterDeck.',
            'Harass, abuse, impersonate, or harm other members.',
            'Disrupt, overload, or attempt to compromise the platform or its security.',
            'Misrepresent MusterDeck as officially affiliated with, or endorsed by, Cloud Imperium Games or Roberts Space Industries.',
          ],
        },
      ],
    },
    {
      heading: 'Your content and operational records',
      blocks: [
        {
          type: 'paragraph',
          text: 'You keep ownership of the content you create on MusterDeck. You grant us the limited permission needed to store and display that content so the platform can function for you and the crews you coordinate with.',
        },
        {
          type: 'paragraph',
          text: 'Operational records — including S.P.O.I.L.S. values and settlement entries — are organizer-managed records entered by users. They are not guarantees, financial instruments, or promises of payout, and MusterDeck does not verify or enforce them.',
        },
      ],
    },
    {
      heading: 'Support, donations, and paid features',
      blocks: [
        {
          type: 'paragraph',
          text: 'MusterDeck may offer optional ways to support the project, including Patreon or similar third-party platforms. Unless we clearly state otherwise, support payments are voluntary and are not charitable, tax-deductible donations — MusterDeck is not a registered charity. Any benefits offered to supporters may change over time.',
        },
        {
          type: 'paragraph',
          text: 'Patreon or the relevant payment provider processes your payment details under its own terms and privacy policy; MusterDeck never receives or stores your full card number. If we later offer paid subscriptions or supporter-only tools, the checkout page will describe the price, billing period, renewal and cancellation terms, included features, and refund policy before you pay, and those purchases will be governed by separate paid-service terms.',
        },
        {
          type: 'paragraph',
          text: 'No paid feature implies any affiliation with, or endorsement by, Cloud Imperium Games or Roberts Space Industries.',
        },
      ],
    },
    {
      heading: 'Automated access',
      blocks: [
        {
          type: 'paragraph',
          text: 'You may not access MusterDeck using bots, scrapers, or other automated means to harvest data or member content without our prior written permission. We may use technical measures to detect and block abusive automated access.',
        },
      ],
    },
    {
      heading: 'Fan project and intellectual property',
      blocks: [
        {
          type: 'paragraph',
          text: 'MusterDeck is an independent fan project. Star Citizen, Roberts Space Industries, and related names, marks, and assets are the property of their respective owners and are used here under fan-content terms, not as a claim of ownership or endorsement. See our Disclaimer for details.',
        },
      ],
    },
    {
      heading: 'Disclaimers',
      blocks: [
        {
          type: 'paragraph',
          text: 'MusterDeck is provided "as is" and "as available," without warranties of any kind, whether express or implied. We do not warrant that the service will be uninterrupted, error-free, or that any operational records within it are accurate.',
        },
      ],
    },
    {
      heading: 'Limitation of liability',
      blocks: [
        {
          type: 'paragraph',
          text: 'To the fullest extent permitted by law, MusterDeck and its team are not liable for indirect, incidental, or consequential damages, or for any loss arising from your use of the platform or reliance on records within it. Some jurisdictions do not allow certain limitations, so parts of this section may not apply to you.',
        },
      ],
    },
    {
      heading: 'Mandatory consumer rights',
      blocks: [
        {
          type: 'paragraph',
          text: 'Nothing in these terms limits rights that cannot legally be waived, including mandatory consumer, privacy, or digital-service rights that apply where you live. Where local law gives you stronger protections than these terms, those protections apply.',
        },
      ],
    },
    {
      heading: 'Termination',
      blocks: [
        {
          type: 'paragraph',
          text: 'You may stop using MusterDeck and delete your account at any time. We may suspend or terminate access that violates these terms or that harms the platform or its members.',
        },
      ],
    },
    {
      heading: 'Governing law',
      blocks: [
        {
          type: 'paragraph',
          text: `These terms are governed by the laws of ${GOVERNING_LAW}, without regard to conflict-of-laws rules. The chosen governing law does not remove mandatory consumer-protection rights that apply in the country where you live.`,
        },
      ],
    },
    {
      heading: 'Changes to these terms',
      blocks: [
        {
          type: 'paragraph',
          text: 'We may update these terms as the platform evolves. We will update the "last updated" date above, and significant changes will be communicated more prominently. Continued use after changes means you accept the updated terms. Material changes to paid features will not reduce access you have already paid for without notice or any legally required remedy.',
        },
      ],
    },
    {
      heading: 'Contact',
      blocks: [
        {
          type: 'paragraph',
          text: `Questions about these terms can be directed to ${PRIVACY_CONTACT}.`,
        },
      ],
    },
  ],
};

const disclaimer: LegalDocument = {
  id: 'legal',
  eyebrow: 'Legal',
  title: 'Disclaimer',
  lastUpdated: '2026-06-09',
  isDraft: true,
  intro:
    'MusterDeck is an independent, fan-made tool. This page states our relationship — or lack of one — to the rights holders behind Star Citizen.',
  sections: [
    {
      heading: 'Unofficial Star Citizen fan site',
      blocks: [
        {
          type: 'paragraph',
          text: 'MusterDeck is an unofficial Star Citizen fan site, not affiliated with the Cloud Imperium group of companies. All Star Citizen-related content not authored by MusterDeck or its users is the property of its respective owners. Official Star Citizen information is available at https://robertsspaceindustries.com.',
        },
      ],
    },
    {
      heading: 'Independent fan project',
      blocks: [
        {
          type: 'paragraph',
          text: 'MusterDeck is an independent fan-made tool for Star Citizen players and organizations. It is not affiliated with, endorsed by, sponsored by, or officially connected to Cloud Imperium Games, Roberts Space Industries, or their affiliates.',
        },
      ],
    },
    {
      heading: 'Trademarks and content ownership',
      blocks: [
        {
          type: 'paragraph',
          text: 'Star Citizen and related names, marks, logos, and assets belong to their respective owners. They are referenced here only to support fan use, and their use does not imply any endorsement or partnership.',
        },
      ],
    },
    {
      heading: 'No guarantees',
      blocks: [
        {
          type: 'paragraph',
          text: 'Information and operational records within MusterDeck are provided by organizers and members for coordination purposes. They are not guarantees, official orders, or promises of payout, and should not be relied on as such.',
        },
      ],
    },
  ],
};

export const legalDocuments: Record<LegalDocumentId, LegalDocument> = {
  privacy: privacyPolicy,
  terms: termsOfService,
  legal: disclaimer,
};
