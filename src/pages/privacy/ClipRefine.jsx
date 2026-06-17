import { motion } from 'framer-motion';

const ClipRefine = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-[#120d1b] font-[Manrope,sans-serif]">

      {/* Top bar */}
      <div className="bg-white border-b border-[#d7cfe7]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <img
            src="/logo/cliprefine-logo.png"
            alt="ClipRefine"
            className="w-8 h-8 rounded-lg shadow-md"
          />
          <span className="font-black text-lg text-[#6B40C8]">ClipRefine</span>
        </div>
      </div>

      {/* Header */}
      <header className="max-w-4xl mx-auto px-6 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-5xl font-black mb-4 leading-tight">Privacy Policy</h1>
          <div className="flex gap-3 text-sm text-gray-500">
            <span>v1.0.0</span>
            <span>·</span>
            <span>Last updated: June 13, 2026</span>
          </div>
        </motion.div>
      </header>

      {/* Body */}
      <main className="max-w-4xl mx-auto px-6 pb-20">
        {/* Intro */}
        <Card>
          <p className="text-gray-700 leading-relaxed">
            ClipRefine is a Chrome extension that processes clipboard text locally in your browser.
            We are committed to protecting your privacy and being transparent about our data practices.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            <strong>FREE version</strong> operates 100% offline with zero external requests.{' '}
            <strong>PRO version</strong> uses Lemon Squeezy for payment processing and license validation —
            see the "Third-Party Services" section below for details.
          </p>
        </Card>

        {/* 1. Data Collection */}
        <Section number="1" title="Data Collection" icon="database">
          <SubSection title="What We DO NOT Collect">
            <ul className="space-y-2">
              <Bullet negative>
                <strong>Clipboard content</strong> — All text processing happens entirely within your browser. Your copied text is never sent to any external server.
              </Bullet>
              <Bullet negative>
                <strong>Browsing history</strong> — We do not track or store which websites you visit.
              </Bullet>
              <Bullet negative>
                <strong>Personal information</strong> — ClipRefine itself does not collect names, emails, or personal info. PRO purchases are processed by Lemon Squeezy who collects payment-related data on their own platform — see Third-Party Services.
              </Bullet>
              <Bullet negative>
                <strong>Usage analytics</strong> — We do not use any analytics or tracking services.
              </Bullet>
            </ul>
          </SubSection>

          <SubSection title="What We Store Locally">
            <p className="text-gray-700 mb-3">
              The following data is stored locally in your browser using Chrome's Storage Sync API:
            </p>
            <DataTable
              headers={['Data', 'Purpose', 'Storage Location']}
              rows={[
                ['User-created rules', 'To apply text transformations', 'Chrome Storage Sync'],
                ['Extension settings', 'To remember your preferences', 'Chrome Storage Sync'],
                ['License key (PRO only)', 'To unlock PRO features and revalidate license', 'Chrome Storage Sync'],
                ['Anonymous device ID (UUID)', 'Generated locally for license activation tracking', 'Chrome Storage Sync'],
                ['License instance ID', 'Returned by Lemon Squeezy after activation', 'Chrome Storage Sync'],
              ]}
            />
            <p className="text-gray-500 text-sm mt-3 italic">
              This data syncs across your Chrome browsers if you are signed into Chrome, but is never accessible to us or any third party.
            </p>
          </SubSection>
        </Section>

        {/* 2. Permissions */}
        <Section number="2" title="Permissions Explained" icon="lock">
          <p className="text-gray-700 mb-4">ClipRefine requires the following permissions:</p>
          <DataTable
            headers={['Permission', 'Why We Need It']}
            rows={[
              ['storage', 'To save your rules and settings'],
              ['activeTab', 'To detect the current website for domain-specific rules'],
              ['clipboardWrite', 'To write refined text back to your clipboard'],
              ['host_permissions (<all_urls>)', 'To run the content script on all websites where you copy text'],
              ['alarms', 'To schedule periodic license re-validation (every 24 hours, PRO only)'],
            ]}
            monoFirstColumn
          />
        </Section>

        {/* 3. Data Processing */}
        <Section number="3" title="Data Processing" icon="settings">
          <SubSection title="FREE Version">
            <ul className="space-y-2">
              <Bullet>All text processing occurs <strong>locally</strong> in your browser</Bullet>
              <Bullet><strong>Zero external network requests</strong></Bullet>
              <Bullet>Your clipboard content never leaves your device</Bullet>
            </ul>
          </SubSection>
          <SubSection title="PRO Version">
            <ul className="space-y-2">
              <Bullet>Clipboard text processing remains <strong>100% local</strong> — never sent anywhere</Bullet>
              <Bullet>License key + anonymous device ID sent to Lemon Squeezy on activation/deactivation</Bullet>
              <Bullet>Automatic license re-validation every 24 hours (detects refunds/cancellations)</Bullet>
            </ul>
          </SubSection>
        </Section>

        {/* 4. Third-Party Services */}
        <Section number="4" title="Third-Party Services" icon="groups">
          <p className="text-gray-700 mb-4">
            ClipRefine's <strong>FREE version</strong> does not connect to any third-party services.
          </p>
          <Callout>
            <p className="font-bold text-[#6B40C8] mb-3 text-lg">
              Lemon Squeezy (PRO version only)
            </p>
            <p className="text-gray-700 mb-3">
              We use Lemon Squeezy for payment processing and license management. They act as the Merchant of Record.
            </p>
            <ul className="space-y-2">
              <Bullet><strong>What's shared:</strong> Your email (at checkout), payment info (handled by them, never by us), license key, anonymous device identifier</Bullet>
              <Bullet><strong>When triggered:</strong> Only when you purchase PRO, activate/deactivate license, or during 24-hour re-validation</Bullet>
              <Bullet><strong>Tax handling:</strong> Lemon Squeezy automatically calculates and remits VAT/GST for your region</Bullet>
              <Bullet><strong>Compliance:</strong> GDPR and CCPA compliant</Bullet>
              <Bullet>
                <strong>Their Privacy Policy:</strong>{' '}
                <a href="https://www.lemonsqueezy.com/privacy" target="_blank" rel="noopener noreferrer"
                   className="text-[#6B40C8] underline hover:no-underline">
                  lemonsqueezy.com/privacy
                </a>
              </Bullet>
            </ul>
          </Callout>
        </Section>

        {/* 5. Data Security */}
        <Section number="5" title="Data Security" icon="security">
          <ul className="space-y-2">
            <Bullet>All data is stored using Chrome's secure Storage API</Bullet>
            <Bullet>No external database or server stores your information</Bullet>
            <Bullet>Your rules and settings are encrypted in transit when syncing across Chrome browsers</Bullet>
          </ul>
        </Section>

        {/* 6. Your Rights */}
        <Section number="6" title="Your Rights" icon="account_circle">
          <p className="text-gray-700 mb-4">You have full control over your data:</p>
          <div className="grid md:grid-cols-3 gap-4">
            <RightCard title="View" color="purple">
              Access your rules and settings through the extension options page
            </RightCard>
            <RightCard title="Deactivate License (PRO)" color="purple">
              Remove your PRO license from this device via "Deactivate License" in extension settings
            </RightCard>
            <RightCard title="Delete" color="red">
              Remove all data by uninstalling the extension or clearing extension data in Chrome settings
            </RightCard>
          </div>
        </Section>

        {/* 7. Refunds & Subscriptions */}
        <Section number="7" title="Refunds & Subscriptions" icon="payments">
          <ul className="space-y-2">
            <Bullet>ClipRefine PRO is a <strong>one-time lifetime purchase</strong> — no subscriptions, no recurring charges</Bullet>
            <Bullet>Refunds are processed by Lemon Squeezy. You can request a refund directly through the "View order" link in your purchase receipt email.</Bullet>
            <Bullet>Refunded licenses are automatically deactivated within 24 hours (next license re-validation cycle)</Bullet>
          </ul>
        </Section>

        {/* 8. Children's Privacy */}
        <Section number="8" title="Children's Privacy" icon="child_care">
          <p className="text-gray-700">
            ClipRefine does not knowingly collect any information from children under 13 years of age.
          </p>
        </Section>

        {/* 9. Changes to This Policy */}
        <Section number="9" title="Changes to This Policy" icon="edit">
          <p className="text-gray-700 mb-3">
            We may update this privacy policy when new features are added. Significant changes will be communicated through:
          </p>
          <ul className="space-y-2">
            <Bullet>Extension update notes</Bullet>
            <Bullet>In-app notification</Bullet>
          </ul>
        </Section>

        {/* 10. Summary */}
        <Section number="10" title="Summary" icon="check_circle">
          <SummaryTable
            rows={[
              ['Do we collect your clipboard data?', 'No — always local', 'good'],
              ['Do we track your browsing?', 'No', 'good'],
              ['Do we use analytics?', 'No', 'good'],
              ['Does FREE version send any data externally?', 'No — 100% offline', 'good'],
              ['Does PRO version send data externally?', 'Only license key + anonymous device ID, to Lemon Squeezy', 'neutral'],
              ['Who handles PRO payments?', 'Lemon Squeezy (Merchant of Record)', 'neutral'],
              ['Where is data stored?', 'Locally in Chrome Storage Sync', 'neutral'],
            ]}
          />
        </Section>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-[#d7cfe7] text-center text-sm text-gray-500"
        >
          <p>This privacy policy is effective as of June 13, 2026.</p>
          <p className="mt-2">
            Questions? Email{' '}
            <a href="mailto:sudongcu.work@gmail.com" className="text-[#6B40C8] underline hover:no-underline">
              sudongcu.work@gmail.com
            </a>
            {' · '}
            See{' '}
            <a href="/terms/cliprefine" className="text-[#6B40C8] underline hover:no-underline">
              Terms of Service
            </a>
          </p>
        </motion.div>
      </main>
    </div>
  );
};

// ────────────────────────────────────────────────
// Reusable components
// ────────────────────────────────────────────────

const Card = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className="bg-white rounded-2xl border border-[#d7cfe7] p-6 mb-6 shadow-sm"
  >
    {children}
  </motion.div>
);

const Section = ({ number, title, icon, children }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className="mb-8"
  >
    <div className="flex items-center gap-3 mb-5">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#6B40C8]/10">
        <span className="material-symbols-outlined text-[22px] text-[#6B40C8]">{icon}</span>
      </div>
      <div className="flex items-baseline gap-3">
        <span className="text-sm font-bold text-gray-400">#{number}</span>
        <h2 className="text-2xl font-black">{title}</h2>
      </div>
    </div>
    <div className="bg-white rounded-2xl border border-[#d7cfe7] p-6 shadow-sm">
      {children}
    </div>
  </motion.section>
);

const SubSection = ({ title, children }) => (
  <div className="mb-5 last:mb-0">
    <h3 className="font-bold text-[#6B40C8] mb-3">{title}</h3>
    {children}
  </div>
);

const Bullet = ({ children, negative = false }) => (
  <li className="flex items-start gap-2 text-gray-700">
    <span className={`material-symbols-outlined text-[18px] mt-0.5 flex-shrink-0 ${
      negative ? 'text-red-500' : 'text-[#6B40C8]'
    }`}>
      {negative ? 'block' : 'check_circle'}
    </span>
    <span>{children}</span>
  </li>
);

const Callout = ({ children }) => (
  <div className="mt-4 rounded-xl border p-5 bg-[#6B40C8]/5 border-[#6B40C8]/20">
    {children}
  </div>
);

const RightCard = ({ title, color, children }) => {
  const colorClasses = {
    purple: 'border-[#d7cfe7] text-[#6B40C8]',
    red: 'border-red-200 text-red-600',
  };
  return (
    <div className={`bg-gray-50 rounded-xl border p-4 ${colorClasses[color]}`}>
      <h4 className="font-bold mb-2">{title}</h4>
      <p className="text-gray-700 text-sm">{children}</p>
    </div>
  );
};

const DataTable = ({ headers, rows, monoFirstColumn = false }) => (
  <div className="overflow-x-auto rounded-xl border border-[#d7cfe7]">
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="bg-gray-50">
          {headers.map((h, i) => (
            <th
              key={i}
              className="text-left px-4 py-3 font-semibold text-[#120d1b] border-b border-[#d7cfe7]"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
            {row.map((cell, ci) => (
              <td
                key={ci}
                className={`px-4 py-3 text-gray-700 ${
                  ci === 0 && monoFirstColumn ? 'font-mono text-xs' : ''
                }`}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const SummaryTable = ({ rows }) => (
  <div className="overflow-x-auto rounded-xl border border-[#d7cfe7]">
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="bg-gray-50">
          <th className="text-left px-4 py-3 font-semibold text-[#120d1b] border-b border-[#d7cfe7]">
            Question
          </th>
          <th className="text-left px-4 py-3 font-semibold text-[#120d1b] border-b border-[#d7cfe7]">
            Answer
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([q, a, tone], ri) => {
          const toneClass = tone === 'good'
            ? 'font-bold text-green-600'
            : 'font-bold text-[#6B40C8]';
          return (
            <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
              <td className="px-4 py-3 text-gray-700">{q}</td>
              <td className={`px-4 py-3 ${toneClass}`}>{a}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default ClipRefine;
