import { FaTimes } from 'react-icons/fa';

export default function PrivacyPolicy({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4">
      <div className="w-full max-w-4xl bg-bg-darker rounded-lg border border-white/10 p-4 sm:p-6 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Privacy Policy</h1>
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
              Welcome to GamerLinks ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience while using our service. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our GamerLinks application and services.
            </p>
            <p className="mb-4 leading-relaxed">
              By accessing or using GamerLinks, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with our policies and practices, do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">2. Information We Collect</h2>
            
            <h3 className="text-lg font-semibold mb-3 mt-4">2.1 Information You Provide</h3>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li><strong>Account Information:</strong> When you create an account, we collect your email address, username, display name, and authentication credentials (handled securely through Firebase Authentication).</li>
              <li><strong>Profile Information:</strong> You may choose to provide profile data including bio, avatar images, badges, and custom theme preferences.</li>
              <li><strong>Content Information:</strong> Links to your social media platforms, streaming services, gaming profiles, and content events (streams, videos, tournaments).</li>
              <li><strong>Communication Data:</strong> If you contact us, we may collect information you provide in those communications.</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 mt-4">2.2 Automatically Collected Information</h3>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li><strong>Usage Data:</strong> We collect information about how you interact with our services, including pages visited, features used, and time spent on the application.</li>
              <li><strong>Device Information:</strong> Information about your device, including device type, operating system, browser type, and unique device identifiers.</li>
              <li><strong>Log Data:</strong> Our servers automatically record information, including your IP address, access times, and error logs.</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 mt-4">2.3 Third-Party Services</h3>
            <p className="mb-4 leading-relaxed">
              We use Firebase (Google Cloud Platform) for authentication, database services, and cloud storage. Firebase may collect certain information as outlined in their privacy policy. We also use Firebase Analytics to understand usage patterns and improve our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">3. How We Use Your Information</h2>
            <p className="mb-4 leading-relaxed">We use the collected information for various purposes:</p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>To provide, maintain, and improve our services</li>
              <li>To authenticate and manage your account</li>
              <li>To display your profile and content to other users</li>
              <li>To process and respond to your requests</li>
              <li>To send you administrative information, including updates to our policies</li>
              <li>To monitor and analyze usage patterns and trends</li>
              <li>To detect, prevent, and address technical issues and security threats</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">4. Data Storage and Security</h2>
            <p className="mb-4 leading-relaxed">
              Your data is stored securely using Firebase's infrastructure, which provides industry-standard security measures including encryption in transit and at rest. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <p className="mb-4 leading-relaxed">
              However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">5. Data Sharing and Disclosure</h2>
            <p className="mb-4 leading-relaxed">We do not sell your personal information. We may share your information in the following circumstances:</p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li><strong>Public Profile Information:</strong> Your username, display name, bio, avatar, links, and content are publicly visible to anyone who accesses your profile URL.</li>
              <li><strong>Service Providers:</strong> We may share information with third-party service providers (including Firebase/Google) who perform services on our behalf, subject to confidentiality obligations.</li>
              <li><strong>Legal Requirements:</strong> We may disclose your information if required by law or in response to valid legal requests.</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
              <li><strong>With Your Consent:</strong> We may share your information for any other purpose with your explicit consent.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">6. Your Rights and Choices</h2>
            
            <h3 className="text-lg font-semibold mb-3 mt-4">6.1 Access and Update</h3>
            <p className="mb-4 leading-relaxed">
              You can access and update most of your profile information directly through the Settings page in the application. You may update your display name, bio, avatar, links, and preferences at any time.
            </p>

            <h3 className="text-lg font-semibold mb-3 mt-4">6.2 Data Deletion</h3>
            <p className="mb-4 leading-relaxed">
              You have the right to request deletion of your account and personal data. To request account deletion, please contact us using the contact information provided below. Upon verification, we will delete your account and associated data, subject to legal retention requirements.
            </p>

            <h3 className="text-lg font-semibold mb-3 mt-4">6.3 GDPR Rights (EU Users)</h3>
            <p className="mb-4 leading-relaxed">
              If you are located in the European Economic Area (EEA), you have the following rights under the General Data Protection Regulation (GDPR):
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>Right to access your personal data</li>
              <li>Right to rectify inaccurate data</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Right to withdraw consent</li>
            </ul>
            <p className="mb-4 leading-relaxed">
              To exercise these rights, please contact us using the information provided below.
            </p>

            <h3 className="text-lg font-semibold mb-3 mt-4">6.4 CCPA Rights (California Users)</h3>
            <p className="mb-4 leading-relaxed">
              If you are a California resident, you have the following rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>Right to know what personal information is collected, used, shared, or sold</li>
              <li>Right to delete personal information</li>
              <li>Right to opt-out of the sale of personal information (we do not sell personal information)</li>
              <li>Right to non-discrimination for exercising your privacy rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">7. Children's Privacy</h2>
            <p className="mb-4 leading-relaxed">
              Our service is not intended for children under the age of 13 (or the applicable age of consent in your jurisdiction). We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately. If we discover that we have collected information from a child, we will delete that information promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">8. International Data Transfers</h2>
            <p className="mb-4 leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country. By using our services, you consent to the transfer of your information to these countries. We take appropriate safeguards to ensure your information is protected in accordance with this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">9. Data Retention</h2>
            <p className="mb-4 leading-relaxed">
              We retain your personal information for as long as your account is active or as needed to provide you services. If you delete your account, we will delete or anonymize your personal information, except where we are required to retain it for legal, regulatory, or business purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">10. Changes to This Privacy Policy</h2>
            <p className="mb-4 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-theme-primary">11. Contact Information</h2>
            <p className="mb-4 leading-relaxed">
              If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
            </p>
            <div className="bg-black/30 rounded-md p-4 border border-white/10">
              <p className="mb-2"><strong>Email:</strong> gamerlinkscontact@gmail.com</p>
              <p className="mb-2"><strong>Subject Line:</strong> Privacy Policy Inquiry</p>
              <p className="text-sm text-white/70">
                Please include your username and a description of your request. We will respond to your inquiry within 30 days.
              </p>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}

