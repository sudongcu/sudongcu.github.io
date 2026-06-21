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
            <span>Last updated: June 21, 2026</span>
          </div>
        </motion.div>
      </header>

      {/* Body */}
      <main className="max-w-4xl mx-auto px-6 pb-20">
        {/* Intro */}
        <Card>
          <p className="text-gray-700 leading-relaxed">
            ClipRefine is a Chrome extension that refines clipboard text locally in your browser. This policy
            describes exactly what data the extension reads, stores, and transmits, based on the published source code.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            <strong>Summary:</strong> The FREE version makes zero network requests. The PRO version contacts
            Lemon Squeezy only at the moments described below.
          </p>
        </Card>

        {/* 1. Data Stored Locally */}
        <Section number="1" title="Data Stored Locally" icon="database">
          <p className="text-gray-700 mb-4">
            All data is stored via <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">chrome.storage.sync</code> —
            accessible only to the extension on your Chrome profile, never sent to any server we operate.
          </p>
          <DataTable
            headers={['Key', 'Contents', 'Purpose']}
            rows={[
              ['settings', 'isGlobalActive, showToast, showConsoleLog', 'Your preferences'],
              ['rules', 'Array of rule objects: name, description, findPattern, replacePattern, isRegex, isActive, targetDomains', 'Text transformation rules you create'],
              ['deviceId', 'UUID generated locally via crypto.randomUUID() on first use', 'Stable per-Chrome-profile identifier used to derive your license instance name'],
              ['license (PRO only)', 'licenseKey, instanceId, instanceName, activatedAt, expiresAt, lastValidatedAt, customerId returned by Lemon Squeezy', 'License state'],
            ]}
            monoFirstColumn
          />
          <p className="text-gray-500 text-sm mt-3 italic">
            If you are signed into Chrome with Sync enabled, this data syncs across your Chrome browsers via
            Google's infrastructure. We never receive a copy.
          </p>
        </Section>

        {/* 2. What We Never Collect or Store */}
        <Section number="2" title="What We Never Collect or Store" icon="visibility_off">
          <ul className="space-y-2">
            <Bullet negative>
              <strong>Clipboard contents</strong> — All text processing happens inside the copy event handler in
              content.js. Rules are applied locally via <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">String.prototype.replaceAll</code> or
              <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]"> RegExp</code>, and the result is
              written directly back to the clipboard. No clipboard text is sent over the network.
            </Bullet>
            <Bullet negative>
              <strong>Browsing history</strong> — The extension reads <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">window.location.hostname</code> only
              to match against your rules' <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">targetDomains</code>.
              The hostname is never stored or transmitted.
            </Bullet>
            <Bullet negative>
              <strong>Personal information</strong> — The extension itself does not collect names, emails, or
              profile data. PRO checkout is handled separately by Lemon Squeezy (see #4).
            </Bullet>
            <Bullet negative>
              <strong>Analytics or telemetry</strong> — No analytics SDK, no event reporting, no error reporting
              service is loaded.
            </Bullet>
          </ul>
        </Section>

        {/* 3. Network Activity */}
        <Section number="3" title="Network Activity" icon="cloud">
          <SubSection title="FREE version">
            <p className="text-gray-700">
              <strong>Zero outbound requests.</strong> The extension does not call <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">fetch</code>,
              <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]"> XMLHttpRequest</code>, or load any
              external resource. You can verify this in the source.
            </p>
          </SubSection>

          <SubSection title="PRO version">
            <p className="text-gray-700 mb-4">
              The extension contacts <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">https://api.lemonsqueezy.com/v1</code> in
              exactly three situations:
            </p>
            <DataTable
              headers={['Endpoint', 'When', 'Request payload']}
              rows={[
                ['POST /v1/licenses/activate', 'When you click "Activate License"', 'license_key, instance_name'],
                ['POST /v1/licenses/validate', 'Scheduled re-validation', 'license_key, instance_id'],
                ['POST /v1/licenses/deactivate', 'When you click "Deactivate License"', 'license_key, instance_id'],
              ]}
              monoFirstColumn
            />
            <p className="text-gray-700 mt-4">Where:</p>
            <ul className="space-y-2 mt-2">
              <Bullet>
                <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">instance_name</code> ={' '}
                <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">ClipRefine-{'{'}first 8 characters of your locally-generated UUID{'}'}</code>
              </Bullet>
              <Bullet>
                <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">instance_id</code> = UUID issued by Lemon Squeezy after activation
              </Bullet>
            </ul>
          </SubSection>

          <Callout>
            <p className="text-gray-700 mb-2">
              <strong>Re-validation schedule:</strong> First check 5 minutes after Chrome starts, then approximately
              every 24 hours, via <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">chrome.alarms</code>.
              Re-validation runs only while you hold an active PRO license.
            </p>
            <p className="text-gray-700">
              <strong>Network resilience:</strong> If Lemon Squeezy is unreachable (network error, timeout, 5xx),
              the extension keeps your existing PRO state. A license is downgraded only when Lemon Squeezy explicitly
              responds that it is no longer valid (e.g., refunded or disabled).
            </p>
          </Callout>
        </Section>

        {/* 4. Third-Party Service */}
        <Section number="4" title="Third-Party Service: Lemon Squeezy (PRO only)" icon="groups">
          <p className="text-gray-700 mb-4">
            We use Lemon Squeezy as our Merchant of Record for payment processing and license issuance.
          </p>
          <ul className="space-y-2">
            <Bullet>
              <strong>What we send to Lemon Squeezy from the extension:</strong> license key, instance name,
              instance ID — as listed in #3. No clipboard data, no rules, no browsing data.
            </Bullet>
            <Bullet>
              <strong>What Lemon Squeezy returns and we store locally:</strong>{' '}
              <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">instance.id</code>,{' '}
              <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">license_key.status</code>,{' '}
              <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">license_key.expires_at</code>,{' '}
              <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">meta.customer_id</code>.
            </Bullet>
            <Bullet>
              <strong>What Lemon Squeezy collects directly from you at checkout (independent of the extension):</strong>{' '}
              your email address, billing details, payment method. This is handled on{' '}
              <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">*.lemonsqueezy.com</code>, not in the extension.
            </Bullet>
            <Bullet>Tax and refunds are handled by Lemon Squeezy.</Bullet>
            <Bullet>
              Their privacy policy:{' '}
              <a href="https://www.lemonsqueezy.com/privacy" target="_blank" rel="noopener noreferrer"
                 className="text-[#6B40C8] underline hover:no-underline">
                lemonsqueezy.com/privacy
              </a>
            </Bullet>
          </ul>
        </Section>

        {/* 5. Permissions */}
        <Section number="5" title="Permissions" icon="lock">
          <p className="text-gray-700 mb-4">
            Permissions declared in <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">manifest.json</code> and why each is needed:
          </p>
          <DataTable
            headers={['Permission', 'Reason']}
            rows={[
              ['storage', 'Read/write rules, settings, and license state in chrome.storage.sync'],
              ['activeTab', "Detect the current page's hostname for domain-scoped rules"],
              ['clipboardWrite', 'Replace your copied text with the refined result'],
              ['alarms', 'Schedule the 24-hour PRO license re-validation'],
              ['host_permissions: <all_urls>', 'Run the content script on any page where you press Copy'],
            ]}
            monoFirstColumn
          />
        </Section>

        {/* 6. Data Retention */}
        <Section number="6" title="Data Retention" icon="schedule">
          <ul className="space-y-2">
            <Bullet>
              Locally stored data persists until you uninstall the extension, click "Clear extension data" in{' '}
              <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">chrome://extensions</code>, or explicitly
              deactivate your license (which clears <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">license</code> and{' '}
              <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">instanceId</code>).
            </Bullet>
            <Bullet>
              License records on Lemon Squeezy's side persist according to their own retention policy.
            </Bullet>
          </ul>
        </Section>

        {/* 7. Your Rights */}
        <Section number="7" title="Your Rights" icon="account_circle">
          <ul className="space-y-2">
            <Bullet>View / edit / delete all your rules and settings on the extension's options page.</Bullet>
            <Bullet>
              Deactivate your PRO license via "Deactivate License", which calls{' '}
              <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">POST /v1/licenses/deactivate</code> and
              clears the local <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">license</code> object.
              This frees up one of your 5 device slots.
            </Bullet>
            <Bullet>Uninstall the extension to remove all local data.</Bullet>
          </ul>
          <Callout>
            <p className="text-gray-700">
              <strong>EU/UK users:</strong> Personal data we hold is limited to what is listed in #1. Because that
              data lives on your device, you can exercise GDPR/UK GDPR rights (access, deletion, portability)
              directly via Chrome. For data held by Lemon Squeezy, contact them through their privacy page.
            </p>
          </Callout>
        </Section>

        {/* 8. Children's Privacy */}
        <Section number="8" title="Children's Privacy" icon="child_care">
          <p className="text-gray-700">
            ClipRefine does not knowingly collect data from children under 13.
          </p>
        </Section>

        {/* 9. Changes to This Policy */}
        <Section number="9" title="Changes to This Policy" icon="edit">
          <p className="text-gray-700">
            Material changes will be noted in extension update release notes. The version and "Last updated" date
            at the top of this document reflect the current revision.
          </p>
        </Section>

        {/* 10. Contact */}
        <Section number="10" title="Contact" icon="mail">
          <p className="text-gray-700">
            Questions about this policy:{' '}
            <a href="mailto:sudongcu.work@gmail.com" className="text-[#6B40C8] underline hover:no-underline">
              sudongcu.work@gmail.com
            </a>
          </p>
          <p className="text-gray-700 mt-2">
            See also:{' '}
            <a href="/terms/cliprefine" className="text-[#6B40C8] underline hover:no-underline">
              Terms of Service
            </a>
          </p>
        </Section>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-[#d7cfe7] text-center text-sm text-gray-500"
        >
          <p>This privacy policy is effective as of June 21, 2026.</p>
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

export default ClipRefine;
