import { FaTimes } from 'react-icons/fa';

export default function CookiePolicy({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4">
      <div className="w-full max-w-4xl bg-bg-darker rounded-lg border border-white/10 p-4 sm:p-6 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Cookie Policy</h1>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <p className="text-white/60 text-sm mb-6">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="space-y-6 text-white/90">
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">1. Introduction</h2>
            <p className="mb-4 leading-relaxed">
              This Cookie Policy explains what cookies are, how GamerLinks uses cookies and similar technologies on our Service, and what choices you have regarding cookies.
            </p>
            <p className="mb-4 leading-relaxed">
              By using GamerLinks, you consent to the use of cookies in accordance with this Cookie Policy. If you do not agree to our use of cookies, you should set your browser settings accordingly or not use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">2. What Are Cookies?</h2>
            <p className="mb-4 leading-relaxed">
              Cookies are small text files that are placed on your device (computer, tablet, or mobile) when you visit a website. Cookies are widely used to make websites work more efficiently and to provide information to website owners.
            </p>
            <p className="mb-4 leading-relaxed">
              Cookies allow a website to recognize your device, store information about your preferences or past actions, and help us understand how you interact with our Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">3. How We Use Cookies</h2>
            <p className="mb-4 leading-relaxed">We use cookies and similar tracking technologies for the following purposes:</p>
            
            <h3 className="text-lg font-semibold mb-3 mt-4">3.1 Essential Cookies</h3>
            <p className="mb-4 leading-relaxed">
              These cookies are strictly necessary to provide you with services available through our Service and to enable you to use certain features. Without these cookies, services you have asked for cannot be provided.
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li><strong>Authentication:</strong> To keep you logged in and maintain your session</li>
              <li><strong>Security:</strong> To prevent fraud and protect the Service</li>
              <li><strong>Preferences:</strong> To remember your settings and preferences (such as theme selection)</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 mt-4">3.2 Analytics Cookies</h3>
            <p className="mb-4 leading-relaxed">
              These cookies help us understand how visitors interact with our Service by collecting and reporting information anonymously. We use Firebase Analytics for this purpose.
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>To understand how users navigate and use our Service</li>
              <li>To identify areas for improvement</li>
              <li>To measure the effectiveness of features and content</li>
              <li>To generate usage statistics</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 mt-4">3.3 Functional Cookies</h3>
            <p className="mb-4 leading-relaxed">
              These cookies enable the Service to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>To remember your preferences and settings</li>
              <li>To provide personalized content</li>
              <li>To remember information you've entered</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">4. Third-Party Cookies</h2>
            <p className="mb-4 leading-relaxed">
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the Service, deliver advertisements, and for other purposes.
            </p>
            
            <h3 className="text-lg font-semibold mb-3 mt-4">4.1 Firebase/Google Cookies</h3>
            <p className="mb-4 leading-relaxed">
              Our Service uses Firebase (owned by Google) for authentication, database services, storage, and analytics. Firebase may use cookies and similar technologies as described in Google's Privacy Policy and Cookie Policy.
            </p>
            <p className="mb-4 leading-relaxed">
              For more information about how Google uses cookies, please visit: <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer" className="text-theme-primary hover:underline">Google Cookie Policy</a>
            </p>

            <h3 className="text-lg font-semibold mb-3 mt-4">4.2 Analytics Services</h3>
            <p className="mb-4 leading-relaxed">
              We use Firebase Analytics to help us understand how users interact with our Service. These services may use cookies to collect information about your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">5. Types of Cookies We Use</h2>
            
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left p-3">Cookie Type</th>
                    <th className="text-left p-3">Purpose</th>
                    <th className="text-left p-3">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="p-3 font-medium">Session Cookies</td>
                    <td className="p-3">Maintain your login session</td>
                    <td className="p-3">Session (until browser closes)</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-3 font-medium">Authentication Cookies</td>
                    <td className="p-3">Identify you as logged in user</td>
                    <td className="p-3">Persistent (varies)</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-3 font-medium">Preference Cookies</td>
                    <td className="p-3">Remember your settings and theme</td>
                    <td className="p-3">Persistent (up to 1 year)</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-3 font-medium">Analytics Cookies</td>
                    <td className="p-3">Track usage and improve service</td>
                    <td className="p-3">Persistent (varies)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">6. Local Storage and Similar Technologies</h2>
            <p className="mb-4 leading-relaxed">
              In addition to cookies, we may use other similar technologies such as:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li><strong>Local Storage:</strong> To store your preferences and settings on your device</li>
              <li><strong>Session Storage:</strong> To maintain temporary data during your session</li>
              <li><strong>IndexedDB:</strong> For storing larger amounts of structured data</li>
            </ul>
            <p className="mb-4 leading-relaxed">
              These technologies work similarly to cookies and are subject to the same privacy considerations.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">7. Your Cookie Choices</h2>
            <p className="mb-4 leading-relaxed">
              Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may impact your ability to use certain features of our Service.
            </p>

            <h3 className="text-lg font-semibold mb-3 mt-4">7.1 Browser Settings</h3>
            <p className="mb-4 leading-relaxed">
              You can set your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
            </p>
            <p className="mb-4 leading-relaxed">
              For instructions on how to manage cookies in popular browsers:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-theme-primary hover:underline">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" className="text-theme-primary hover:underline">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-theme-primary hover:underline">Safari</a></li>
              <li><a href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="text-theme-primary hover:underline">Microsoft Edge</a></li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 mt-4">7.2 Opt-Out of Analytics</h3>
            <p className="mb-4 leading-relaxed">
              To opt out of Firebase Analytics, you can:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>Use your browser's "Do Not Track" setting</li>
              <li>Disable JavaScript in your browser (though this will affect Service functionality)</li>
              <li>Use browser extensions that block analytics</li>
            </ul>
            <p className="mb-4 leading-relaxed">
              Note: Opting out does not affect essential cookies necessary for the Service to function.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">8. GDPR and Cookie Consent</h2>
            <p className="mb-4 leading-relaxed">
              If you are located in the European Economic Area (EEA), we comply with the General Data Protection Regulation (GDPR) regarding cookie consent. Under GDPR:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>We only use essential cookies without your explicit consent (as they are necessary for the Service to function)</li>
              <li>For non-essential cookies (such as analytics), we seek your consent</li>
              <li>You can withdraw your consent at any time</li>
              <li>You have the right to be informed about cookies we use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">9. Cookie Retention</h2>
            <p className="mb-4 leading-relaxed">
              The length of time cookies remain on your device depends on whether they are "persistent" or "session" cookies:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li><strong>Session Cookies:</strong> Temporary cookies that are deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until you delete them</li>
            </ul>
            <p className="mb-4 leading-relaxed">
              We retain cookies only for as long as necessary to fulfill the purposes outlined in this Cookie Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">10. Updates to This Cookie Policy</h2>
            <p className="mb-4 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Cookie Policy on this page and updating the "Last updated" date.
            </p>
            <p className="mb-4 leading-relaxed">
              You are advised to review this Cookie Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">11. Contact Information</h2>
            <p className="mb-4 leading-relaxed">
              If you have any questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <div className="bg-black/30 rounded-md p-4 border border-white/10">
              <p className="mb-2"><strong>Email:</strong> gamerlinkscontact@gmail.com</p>
              <p className="mb-2"><strong>Subject Line:</strong> Cookie Policy Inquiry</p>
              <p className="text-sm text-white/70">
                Please include your username and a description of your question or concern.
              </p>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}

