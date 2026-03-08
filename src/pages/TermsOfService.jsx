import { FaTimes } from 'react-icons/fa';

export default function TermsOfService({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4">
      <div className="w-full max-w-4xl bg-bg-darker rounded-lg border border-white/10 p-4 sm:p-6 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Terms of Service</h1>
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
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">1. Acceptance of Terms</h2>
            <p className="mb-4 leading-relaxed">
              By accessing or using GamerLinks ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these Terms, you may not access the Service.
            </p>
            <p className="mb-4 leading-relaxed">
              These Terms apply to all users of the Service, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">2. Description of Service</h2>
            <p className="mb-4 leading-relaxed">
              GamerLinks is a platform that allows users to create and share their gaming profiles, including links to their social media accounts, streaming platforms, and gaming content. Users can customize their profiles, manage links, and showcase their gaming identity.
            </p>
            <p className="mb-4 leading-relaxed">
              We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time, with or without notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">3. User Accounts</h2>
            
            <h3 className="text-lg font-semibold mb-3 mt-4">3.1 Account Creation</h3>
            <p className="mb-4 leading-relaxed">
              To use certain features of the Service, you must create an account. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password and identification</li>
              <li>Accept all responsibility for activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 mt-4">3.2 Account Responsibility</h3>
            <p className="mb-4 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized access or use of your account.
            </p>

            <h3 className="text-lg font-semibold mb-3 mt-4">3.3 Account Termination</h3>
            <p className="mb-4 leading-relaxed">
              We reserve the right to suspend or terminate your account at any time for violation of these Terms, fraudulent activity, or any other reason we deem necessary to protect the integrity of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">4. User Content</h2>
            
            <h3 className="text-lg font-semibold mb-3 mt-4">4.1 Content Ownership</h3>
            <p className="mb-4 leading-relaxed">
              You retain ownership of all content you post, upload, or submit to the Service ("User Content"), including but not limited to profile information, bios, links, images, and any other materials.
            </p>

            <h3 className="text-lg font-semibold mb-3 mt-4">4.2 Content License</h3>
            <p className="mb-4 leading-relaxed">
              By posting User Content on the Service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, distribute, and display your User Content solely for the purpose of operating and providing the Service. This license terminates when you delete your User Content or account, except for content that has been shared with others or cached.
            </p>

            <h3 className="text-lg font-semibold mb-3 mt-4">4.3 Content Standards</h3>
            <p className="mb-4 leading-relaxed">
              You agree not to post, upload, or transmit User Content that:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>Violates any applicable law or regulation</li>
              <li>Infringes upon the rights of others, including intellectual property rights</li>
              <li>Contains false, misleading, or deceptive information</li>
              <li>Is harassing, threatening, abusive, or defamatory</li>
              <li>Contains obscene, pornographic, or otherwise offensive material</li>
              <li>Contains viruses, malware, or other harmful code</li>
              <li>Violates privacy rights of others</li>
              <li>Promotes illegal activities</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 mt-4">4.4 Content Moderation</h3>
            <p className="mb-4 leading-relaxed">
              We reserve the right, but not the obligation, to review, edit, or remove any User Content that we determine, in our sole discretion, violates these Terms or is otherwise objectionable. We may suspend or terminate accounts that repeatedly violate these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">5. Prohibited Uses</h2>
            <p className="mb-4 leading-relaxed">You agree not to use the Service:</p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
              <li>To upload or transmit viruses or any other type of malicious code</li>
              <li>To collect or track the personal information of others</li>
              <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
              <li>For any obscene or immoral purpose</li>
              <li>To interfere with or circumvent the security features of the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">6. Intellectual Property Rights</h2>
            <p className="mb-4 leading-relaxed">
              The Service and its original content, features, and functionality are owned by GamerLinks and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p className="mb-4 leading-relaxed">
              You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Service without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">7. Third-Party Services and Links</h2>
            <p className="mb-4 leading-relaxed">
              The Service uses Firebase (Google Cloud Platform) for authentication, database, storage, and analytics. Your use of Firebase services is subject to Google's Terms of Service and Privacy Policy.
            </p>
            <p className="mb-4 leading-relaxed">
              The Service may contain links to third-party websites or services that are not owned or controlled by GamerLinks. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
            </p>
            <p className="mb-4 leading-relaxed">
              You acknowledge and agree that GamerLinks shall not be responsible or liable for any damage or loss caused by or in connection with the use of any third-party content, goods, or services available through the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">8. Disclaimers</h2>
            <p className="mb-4 leading-relaxed">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE.
            </p>
            <p className="mb-4 leading-relaxed">
              We do not warrant that the Service will be uninterrupted, timely, secure, or error-free, that defects will be corrected, or that the Service or the server that makes it available is free of viruses or other harmful components.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">9. Limitation of Liability</h2>
            <p className="mb-4 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL GAMERLINKS, ITS AFFILIATES, AGENTS, DIRECTORS, EMPLOYEES, SUPPLIERS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO THE USE OF, OR INABILITY TO USE, THE SERVICE.
            </p>
            <p className="mb-4 leading-relaxed">
              Our total liability to you for all claims arising out of or relating to the use of or inability to use the Service shall not exceed the amount you paid us, if any, for accessing the Service in the 12 months prior to the action giving rise to the liability.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">10. Indemnification</h2>
            <p className="mb-4 leading-relaxed">
              You agree to defend, indemnify, and hold harmless GamerLinks and its affiliates, officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including without limitation reasonable legal and accounting fees, arising out of or in any way connected with your access to or use of the Service, your User Content, or your violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">11. App Store Compliance</h2>
            <p className="mb-4 leading-relaxed">
              If you access the Service through a mobile application available on app stores (including but not limited to Apple App Store and Google Play Store), the following additional terms apply:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>These Terms are between you and GamerLinks, not the app store</li>
              <li>The app store has no responsibility for the Service or content</li>
              <li>Your use of the app must comply with the applicable app store's terms and conditions</li>
              <li>In the event of any failure of the app to conform to any applicable warranty, you may notify the app store, and the app store may refund the purchase price (if applicable)</li>
              <li>The app store and its subsidiaries are third-party beneficiaries of these Terms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">12. Termination</h2>
            <p className="mb-4 leading-relaxed">
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, for any reason, including without limitation if you breach these Terms.
            </p>
            <p className="mb-4 leading-relaxed">
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or contact us to request account deletion.
            </p>
            <p className="mb-4 leading-relaxed">
              All provisions of these Terms which by their nature should survive termination shall survive termination, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">13. Governing Law and Dispute Resolution</h2>
            <p className="mb-4 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which GamerLinks operates, without regard to its conflict of law provisions.
            </p>
            <p className="mb-4 leading-relaxed">
              Any disputes arising out of or relating to these Terms or the Service shall be resolved through binding arbitration, except where prohibited by law. You agree to waive any right to a jury trial.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">14. Changes to Terms</h2>
            <p className="mb-4 leading-relaxed">
              We reserve the right to modify or replace these Terms at any time at our sole discretion. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
            </p>
            <p className="mb-4 leading-relaxed">
              By continuing to access or use the Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you must stop using the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">15. Contact Information</h2>
            <p className="mb-4 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-black/30 rounded-md p-4 border border-white/10">
              <p className="mb-2"><strong>Email:</strong> gamerlinkscontact@gmail.com</p>
              <p className="mb-2"><strong>Subject Line:</strong> Terms of Service Inquiry</p>
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

