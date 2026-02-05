import { motion } from 'framer-motion';
import { Shield, Lock, Database, Eye, Users, Mail, FileText } from 'lucide-react';

const ClipRefine = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
              <p className="text-gray-400 text-sm">ClipRefine Chrome Extension</p>
            </div>
          </div>
          <div className="mt-4 flex gap-4 text-sm text-gray-400">
            <span>Last Updated: February 2025</span>
            <span>•</span>
            <span>Version: Beta (0.9.x)</span>
          </div>
        </div>
      </motion.header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Overview */}
        <Section icon={FileText} title="Overview">
          <p className="text-gray-300 leading-relaxed">
            ClipRefine is a Chrome extension that processes clipboard text locally in your browser. 
            We are committed to protecting your privacy and being transparent about our data practices.
          </p>
        </Section>

        {/* Data Collection */}
        <Section icon={Database} title="Data Collection">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-red-400 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                What We DO NOT Collect
              </h3>
              <ul className="space-y-3">
                <InfoItem 
                  title="Clipboard Content" 
                  description="All text processing happens entirely within your browser. Your copied text is never sent to any external server."
                />
                <InfoItem 
                  title="Browsing History" 
                  description="We do not track or store which websites you visit."
                />
                <InfoItem 
                  title="Personal Information" 
                  description="We do not collect names, emails, or any personally identifiable information."
                />
                <InfoItem 
                  title="Usage Analytics" 
                  description="We do not use any analytics or tracking services."
                />
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">
                <Database className="w-5 h-5" />
                What We Store Locally
              </h3>
              <p className="text-gray-300 mb-4">
                The following data is stored locally in your browser using Chrome's Storage Sync API:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="border border-gray-700 px-4 py-2 text-left">Data</th>
                      <th className="border border-gray-700 px-4 py-2 text-left">Purpose</th>
                      <th className="border border-gray-700 px-4 py-2 text-left">Storage Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-gray-900/50">
                      <td className="border border-gray-700 px-4 py-2">User-created rules</td>
                      <td className="border border-gray-700 px-4 py-2">To apply text transformations</td>
                      <td className="border border-gray-700 px-4 py-2">Chrome Storage Sync</td>
                    </tr>
                    <tr className="bg-gray-900/30">
                      <td className="border border-gray-700 px-4 py-2">Extension settings</td>
                      <td className="border border-gray-700 px-4 py-2">To remember your preferences</td>
                      <td className="border border-gray-700 px-4 py-2">Chrome Storage Sync</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-gray-400 text-sm mt-3 italic">
                This data syncs across your Chrome browsers if you are signed into Chrome, but is never accessible to us or any third party.
              </p>
            </div>
          </div>
        </Section>

        {/* Permissions */}
        <Section icon={Lock} title="Permissions Explained">
          <p className="text-gray-300 mb-4">ClipRefine requires the following permissions:</p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800">
                  <th className="border border-gray-700 px-4 py-2 text-left">Permission</th>
                  <th className="border border-gray-700 px-4 py-2 text-left">Why We Need It</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-900/50">
                  <td className="border border-gray-700 px-4 py-2 font-mono text-sm">storage</td>
                  <td className="border border-gray-700 px-4 py-2">To save your rules and settings</td>
                </tr>
                <tr className="bg-gray-900/30">
                  <td className="border border-gray-700 px-4 py-2 font-mono text-sm">activeTab</td>
                  <td className="border border-gray-700 px-4 py-2">To detect the current website for domain-specific rules</td>
                </tr>
                <tr className="bg-gray-900/50">
                  <td className="border border-gray-700 px-4 py-2 font-mono text-sm">clipboardWrite</td>
                  <td className="border border-gray-700 px-4 py-2">To write refined text back to your clipboard</td>
                </tr>
                <tr className="bg-gray-900/30">
                  <td className="border border-gray-700 px-4 py-2 font-mono text-sm">host_permissions (&lt;all_urls&gt;)</td>
                  <td className="border border-gray-700 px-4 py-2">To run the content script on all websites where you copy text</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* Data Processing */}
        <Section icon={Shield} title="Data Processing">
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>All text processing occurs <strong className="text-white">locally</strong> in your browser</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>No data is transmitted to external servers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>No third-party services are used for text processing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>Your clipboard content remains completely private</span>
            </li>
          </ul>
        </Section>

        {/* Third-Party Services */}
        <Section icon={Users} title="Third-Party Services">
          <p className="text-gray-300">
            This extension does not connect to any third-party services. All processing happens locally in your browser.
          </p>
        </Section>

        {/* Data Security */}
        <Section icon={Lock} title="Data Security">
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>All data is stored using Chrome's secure Storage API</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>No external database or server stores your information</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Your rules and settings are encrypted in transit when syncing across Chrome browsers</span>
            </li>
          </ul>
        </Section>

        {/* Your Rights */}
        <Section icon={Users} title="Your Rights">
          <p className="text-gray-300 mb-4">You have full control over your data:</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="font-semibold text-blue-400 mb-2">View</h4>
              <p className="text-gray-300 text-sm">Access your rules and settings through the extension options page</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="font-semibold text-red-400 mb-2">Delete</h4>
              <p className="text-gray-300 text-sm">Remove all data by uninstalling the extension or clearing extension data in Chrome settings</p>
            </div>
          </div>
        </Section>

        {/* Children's Privacy */}
        <Section title="Children's Privacy">
          <p className="text-gray-300">
            ClipRefine does not knowingly collect any information from children under 13 years of age.
          </p>
        </Section>

        {/* Changes to This Policy */}
        <Section title="Changes to This Policy">
          <p className="text-gray-300 mb-3">
            We may update this privacy policy when new features are added. Significant changes will be communicated through:
          </p>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Extension update notes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>In-app notification</span>
            </li>
          </ul>
        </Section>

        {/* Contact */}
        <Section icon={Mail} title="Contact">
          <p className="text-gray-300 mb-4">
            If you have any questions about this privacy policy, please contact us:
          </p>
          <div className="space-y-2">
            <div className="text-gray-300">
              <span className="font-semibold">Email:</span> sudongcu.work@gmail.com
            </div>
          </div>
        </Section>

        {/* Summary */}
        <Section title="Summary">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800">
                  <th className="border border-gray-700 px-4 py-2 text-left">Question</th>
                  <th className="border border-gray-700 px-4 py-2 text-left">Answer</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-900/50">
                  <td className="border border-gray-700 px-4 py-2">Do we collect your clipboard data?</td>
                  <td className="border border-gray-700 px-4 py-2 font-bold text-green-400">No</td>
                </tr>
                <tr className="bg-gray-900/30">
                  <td className="border border-gray-700 px-4 py-2">Do we track your browsing?</td>
                  <td className="border border-gray-700 px-4 py-2 font-bold text-green-400">No</td>
                </tr>
                <tr className="bg-gray-900/50">
                  <td className="border border-gray-700 px-4 py-2">Do we use analytics?</td>
                  <td className="border border-gray-700 px-4 py-2 font-bold text-green-400">No</td>
                </tr>
                <tr className="bg-gray-900/30">
                  <td className="border border-gray-700 px-4 py-2">Is your data sent to servers?</td>
                  <td className="border border-gray-700 px-4 py-2 font-bold text-green-400">No</td>
                </tr>
                <tr className="bg-gray-900/50">
                  <td className="border border-gray-700 px-4 py-2">Where is data stored?</td>
                  <td className="border border-gray-700 px-4 py-2 font-bold text-blue-400">Locally in your browser</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm italic"
        >
          <p>This privacy policy is effective as of the date stated above.</p>
        </motion.div>
      </main>
    </div>
  );
};

// Helper Components
const Section = ({ icon: Icon, title, children }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="mb-12"
  >
    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
      {Icon && <Icon className="w-6 h-6 text-blue-400" />}
      {title}
    </h2>
    <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
      {children}
    </div>
  </motion.section>
);

const InfoItem = ({ title, description }) => (
  <li className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
    <h4 className="font-semibold text-white mb-1">{title}:</h4>
    <p className="text-gray-300 text-sm">{description}</p>
  </li>
);

export default ClipRefine;
