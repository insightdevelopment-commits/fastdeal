import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPage = () => {
    return (
        <div className="w-full max-w-4xl px-8 mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-invert prose-lg max-w-none pb-20"
            >
                <h1 className="text-5xl font-bold mb-2 tracking-tight">Privacy Policy</h1>
                <p className="text-white/40 mb-12 font-mono text-sm">Effective Date: February 7, 2026 | Last Updated: February 7, 2026</p>

                <div className="space-y-12 text-white/80 font-light leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                        <p>FastDeal is committed to bridging the "Intelligence Gap" in global commerce while maintaining the highest standards of data privacy. We operate as an automated agent to help you find, track, and purchase products across international marketplaces. This policy explains our data practices when you use our web terminal, mobile application, or logistics services.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Data We Collect</h2>
                        <p className="mb-4">To provide a "1.2s Intelligent Scan" and global fulfillment, we collect the following categories of data:</p>

                        <h3 className="text-lg font-bold text-neonCyan mb-2">A. Information You Provide</h3>
                        <ul className="list-disc pl-5 space-y-2 mb-4">
                            <li><strong className="text-white">Account Information:</strong> Name, email address, and encrypted password.</li>
                            <li><strong className="text-white">Transaction Details:</strong> Shipping address and payment metadata (processed through secure third-party gateways).</li>
                            <li><strong className="text-white">Search Preferences:</strong> Queries entered into the "What do you want to purchase?" bar to improve AI relevance.</li>
                        </ul>

                        <h3 className="text-lg font-bold text-neonCyan mb-2">B. Information Collected Automatically</h3>
                        <ul className="list-disc pl-5 space-y-2 mb-4">
                            <li><strong className="text-white">Log Data:</strong> IP address, browser type, and device identifiers.</li>
                            <li><strong className="text-white">Tracking Data:</strong> Real-time price tracking history for items in your "Active Slots."</li>
                            <li><strong className="text-white">Telemetry:</strong> Interaction data (e.g., hover patterns on "Best Deals" blocks) to optimize our UI/UX.</li>
                        </ul>

                        <h3 className="text-lg font-bold text-neonCyan mb-2">C. Information from Third Parties</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong className="text-white">Marketplace Data:</strong> Publicly available price and review data harvested from global platforms (Amazon, eBay, etc.) via our API bridges.</li>
                            <li><strong className="text-white">Trust Ledger Data:</strong> Seller reliability scores pulled from independent verification sources.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Data</h2>
                        <p className="mb-4">We process your information under the legal bases of Contractual Necessity and Legitimate Interest:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong className="text-white">Global Arbitrage:</strong> To calculate the "True Cost" (Price + Shipping + Tax) specific to your location.</li>
                            <li><strong className="text-white">The Trust Ledger:</strong> To filter out untrusted vendors and protect you from fraudulent listings.</li>
                            <li><strong className="text-white">Price Monitoring:</strong> To send automated alerts when a "Perfect Match" hits your target price.</li>
                            <li><strong className="text-white">Logistics Optimization:</strong> To coordinate international shipping through our fulfillment partners.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Data Sharing & Disclosure</h2>
                        <p className="mb-4">We do not sell your personal data. We only share information with:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong className="text-white">Fulfillment Partners:</strong> Shipping carriers required to deliver your "My Orders" items.</li>
                            <li><strong className="text-white">Security Providers:</strong> Tools used to detect and block malicious bots or fraudulent checkout attempts.</li>
                            <li><strong className="text-white">Legal Authorities:</strong> Only when required by law to comply with valid legal processes.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. The "Intelligence" & Scraping Clause</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>FastDeal utilizes automated scrapers and APIs to harvest publicly available market data.</li>
                            <li>We do not scrape private user profiles or password-protected content.</li>
                            <li>We respect robots.txt protocols and implement rate-limiting to minimize impact on source marketplaces.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights (GDPR/CCPA Compliance)</h2>
                        <p className="mb-4">Regardless of your location, FastDeal provides the following "Privacy Terminal" rights:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong className="text-white">Right to Access:</strong> View all data stored in your "My Account" settings.</li>
                            <li><strong className="text-white">Right to Erasure:</strong> Request the permanent deletion of your search history and account.</li>
                            <li><strong className="text-white">Right to Portability:</strong> Export your "Favorites" list in a machine-readable JSON format.</li>
                            <li><strong className="text-white">Opt-Out:</strong> Disable "Smart Agent Searcher" tracking at any time via the Settings sidebar.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. Data Security</h2>
                        <p className="mb-4">We utilize an Obsidian-Grade Security framework:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong className="text-white">Encryption:</strong> AES-256 encryption for all data at rest (MongoDB) and TLS 1.3 for data in transit.</li>
                            <li><strong className="text-white">Anonymization:</strong> Search queries are anonymized before being used to train our global "Best Deals" algorithm.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">8. International Transfers</h2>
                        <p>Since FastDeal is a global marketplace, your data may be processed in servers located outside your home country. We use Standard Contractual Clauses (SCCs) to ensure your data receives the same level of protection worldwide.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">9. Contact Information</h2>
                        <p className="mb-4">For privacy inquiries or to exercise your data rights, contact our Data Protection Officer:</p>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <p className="mb-2"><strong className="text-neonCyan">Email:</strong> fastdealdevelopment@gmail.com</p>
                            <p className="mb-2"><strong className="text-neonCyan">Development Leads:</strong> Karimkhan Ilyas & Karimzhan Adil</p>
                            <p><strong className="text-neonCyan">Phone:</strong> +7 771 219 92 89 | +7 778 488 4961</p>
                        </div>
                        <p className="mt-8 text-sm text-white/40 italic">Note: By using the FastDeal terminal, you acknowledge that you have read and understood this Privacy Policy.</p>
                    </section>
                </div>
            </motion.div>
        </div>
    );
};

export default PrivacyPage;
