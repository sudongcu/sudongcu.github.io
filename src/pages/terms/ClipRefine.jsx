import { motion } from 'framer-motion';

const ClipRefineTerms = () => {
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
          <h1 className="text-5xl font-black mb-4 leading-tight">Terms of Service</h1>
          <div className="flex gap-3 text-sm text-gray-500">
            <span>v1.0.0</span>
            <span>·</span>
            <span>Last updated: June 21, 2026</span>
          </div>
        </motion.div>
      </header>

      {/* Intro */}
      <main className="max-w-4xl mx-auto px-6 pb-20">
        <Card>
          <p className="text-gray-700 leading-relaxed">
            These terms govern your use of ClipRefine, a Chrome extension that automatically refines clipboard text.
            By installing or using ClipRefine, you agree to these terms. If you don't agree, please don't use the extension.
          </p>
        </Card>

        {/* 1. License Grant */}
        <Section number="1" title="License Grant" icon="card_membership">
          <SubSection title="FREE Version">
            <ul className="space-y-2">
              <Bullet>Granted to you at no cost</Bullet>
              <Bullet>Up to 5 custom rules, 3 target domains per rule</Bullet>
              <Bullet>Global rules toggle in the popup</Bullet>
              <Bullet>Available for personal and commercial use</Bullet>
            </ul>
          </SubSection>

          <SubSection title="PRO Version">
            <ul className="space-y-2">
              <Bullet>One-time purchase, $9.99 USD</Bullet>
              <Bullet>Lifetime license — no recurring fees</Bullet>
              <Bullet>Up to 50 custom rules, 12 target domains per rule</Bullet>
              <Bullet>Import / Export rules, individual rule toggles</Bullet>
              <Bullet>Activate on up to <strong>5 devices</strong> per license key</Bullet>
              <Bullet>Includes all future PRO updates within the same major version line</Bullet>
            </ul>
          </SubSection>

          <Callout>
            The license is granted to <strong>you personally</strong>. License keys may not be sold, transferred,
            or shared with third parties.
          </Callout>
        </Section>

        {/* 2. Payment & Refunds */}
        <Section number="2" title="Payment & Refunds" icon="payments">
          <p className="text-gray-700 mb-4">
            All PRO payments are processed by <strong>Lemon Squeezy</strong>, who acts as the Merchant of Record.
            They handle tax (VAT/GST), invoicing, and chargebacks for all regions including the EU.
          </p>

          <SubSection title="Refund Policy">
            <ul className="space-y-2">
              <Bullet>
                <strong>14-day refund window</strong> from purchase date — no questions asked
              </Bullet>
              <Bullet>Request a refund directly through the "View order" link in your purchase receipt email</Bullet>
              <Bullet>
                Once refunded, your license is automatically deactivated within 24 hours
                (next license re-validation cycle)
              </Bullet>
              <Bullet>
                After the 14-day window, refunds are at our discretion and typically not granted unless
                the extension is materially broken
              </Bullet>
            </ul>
          </SubSection>

          <Callout type="link">
            See Lemon Squeezy's full Terms:{' '}
            <a href="https://www.lemonsqueezy.com/terms" target="_blank" rel="noopener noreferrer"
               className="text-[#6B40C8] underline hover:no-underline">
              lemonsqueezy.com/terms
            </a>
          </Callout>
        </Section>

        {/* 3. Acceptable Use */}
        <Section number="3" title="Acceptable Use" icon="rule">
          <p className="text-gray-700 mb-4">You agree <strong>not</strong> to:</p>
          <ul className="space-y-2">
            <Bullet negative>Resell, sublicense, or redistribute the extension or license keys</Bullet>
            <Bullet negative>Reverse engineer, modify, or bypass the license validation system</Bullet>
            <Bullet negative>Use the extension to process illegal content or violate applicable laws</Bullet>
            <Bullet negative>Use the extension in a way that disrupts or attacks other systems</Bullet>
            <Bullet negative>Attempt to gain unauthorized access to our infrastructure or Lemon Squeezy's systems</Bullet>
          </ul>
          <Callout>
            Violation may result in license termination without refund.
          </Callout>
        </Section>

        {/* 4. Updates and Changes */}
        <Section number="4" title="Updates & Service Changes" icon="update">
          <ul className="space-y-2">
            <Bullet>We may push extension updates via the Chrome Web Store at any time</Bullet>
            <Bullet>PRO features added during your license period (within the same major version line) are included at no extra cost</Bullet>
            <Bullet>We reserve the right to remove or modify features for technical or legal reasons</Bullet>
            <Bullet>
              If we ever discontinue ClipRefine entirely, existing PRO users keep access to the last
              published version (offline-capable forever, since core processing is local)
            </Bullet>
          </ul>
        </Section>

        {/* 5. Disclaimer */}
        <Section number="5" title="Disclaimer of Warranties" icon="warning">
          <p className="text-gray-700 leading-relaxed">
            ClipRefine is provided <strong>"as is"</strong> without warranties of any kind, express or implied,
            including but not limited to merchantability, fitness for a particular purpose, or
            non-infringement.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            While we test thoroughly, we cannot guarantee that the extension will be error-free,
            uninterrupted, or compatible with every website or future Chrome version.
          </p>
        </Section>

        {/* 6. Limitation of Liability */}
        <Section number="6" title="Limitation of Liability" icon="gavel">
          <p className="text-gray-700 leading-relaxed mb-3">
            To the maximum extent permitted by law:
          </p>
          <ul className="space-y-2">
            <Bullet>
              We are not liable for any indirect, incidental, or consequential damages
              (e.g., data loss, lost profits, business interruption)
            </Bullet>
            <Bullet>
              Our total liability is capped at the amount you paid for the PRO license
              (or $0 for FREE users)
            </Bullet>
            <Bullet>
              You are responsible for backing up your rules. ClipRefine uses Chrome Storage Sync,
              but cross-device sync depends on your Chrome account
            </Bullet>
          </ul>
        </Section>

        {/* 7. Termination */}
        <Section number="7" title="Termination" icon="logout">
          <SubSection title="By You">
            <p className="text-gray-700">
              Uninstall the extension at any time. For PRO, click "Deactivate License" before uninstalling
              to free up a device slot for future use.
            </p>
            <p className="text-gray-700 mt-3">
              Your rules and settings stored in Chrome Sync will be deleted when you uninstall the extension.
            </p>
          </SubSection>

          <SubSection title="By Us">
            <p className="text-gray-700">
              We may suspend or terminate access for violation of these terms (especially Section 3).
              In rare cases, we may disable a license key found to be fraudulent or to exceed the
              5-device activation limit per license key.
            </p>
          </SubSection>
        </Section>

        {/* 8. Changes to Terms */}
        <Section number="8" title="Changes to These Terms" icon="edit">
          <p className="text-gray-700 leading-relaxed">
            We may update these terms when adding new features or for legal compliance. Material changes will be
            announced via extension update notes. Continued use of the extension after changes constitutes
            acceptance.
          </p>
        </Section>

        {/* 9. Governing Law */}
        <Section number="9" title="Governing Law" icon="account_balance">
          <p className="text-gray-700 leading-relaxed">
            These terms are governed by the laws of the <strong>Republic of Korea</strong>.
            Consumer protection laws in your country may also apply and override these terms where required.
          </p>
        </Section>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-[#d7cfe7] text-center text-sm text-gray-500"
        >
          <p>
            These terms are effective as of June 21, 2026.
          </p>
          <p className="mt-2">
            Questions? Email{' '}
            <a href="mailto:sudongcu.work@gmail.com" className="text-[#6B40C8] underline hover:no-underline">
              sudongcu.work@gmail.com
            </a>
            {' · '}
            See{' '}
            <a href="/privacy/cliprefine" className="text-[#6B40C8] underline hover:no-underline">
              Privacy Policy
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

const Callout = ({ children, type = 'info' }) => {
  const styles = {
    info: 'bg-[#6B40C8]/5 border-[#6B40C8]/20',
    link: 'bg-gray-50 border-gray-200',
  };
  return (
    <div className={`mt-4 rounded-xl border p-4 text-sm text-gray-700 ${styles[type]}`}>
      {children}
    </div>
  );
};

export default ClipRefineTerms;
