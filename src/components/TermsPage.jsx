import React from 'react';
import { motion } from 'framer-motion';

const TermsPage = () => {
    return (
        <div className="w-full max-w-4xl px-8 mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-invert prose-lg max-w-none pb-20"
            >
                <h1 className="text-5xl font-bold mb-2 tracking-tight">Terms of Use</h1>
                <p className="text-white/40 mb-12 font-mono text-sm">Effective Date: February 7, 2026</p>

                <div className="space-y-12 text-white/80 font-light leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                        <p>By accessing or using FastDeal ("the Platform"), you confirm that you are at least 18 years of age and possess the legal authority to enter into this agreement. These Terms constitute a legally binding agreement between you and the FastDeal development team (Karimkhan Ilyas and Karimzhan Adil). If you do not agree to these Terms, you must immediately cease all use of the Platform.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
                        <p className="mb-4">FastDeal is an AI-powered intelligence engine designed to bridge the "Intelligence Gap" in global e-commerce. The Platform provides:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong className="text-white">Real-time global price aggregation and comparison.</strong></li>
                            <li><strong className="text-white">The Trust Ledger:</strong> Automated vendor reliability scoring.</li>
                            <li><strong className="text-white">Smart Agent Searcher:</strong> AI-driven automated deal discovery (Ultra Tier).</li>
                            <li><strong className="text-white">Global logistics and fulfillment facilitation.</strong></li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts & Security</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong className="text-white">Account Responsibility:</strong> You are responsible for maintaining the confidentiality of your account credentials. Any activity occurring under your account is your sole responsibility.</li>
                            <li><strong className="text-white">Obsidian Security:</strong> While we employ advanced encryption, you agree to notify us immediately at fastdealdevelopment@gmail.com of any unauthorized access or security breach.</li>
                            <li><strong className="text-white">Prohibited Use:</strong> You may not use the Platform for any illegal purpose, to harvest data for competing services, or to circumvent the "Price Tracking" slot limits through multiple account creation.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Intellectual Property Rights</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong className="text-white">Ownership:</strong> The FastDeal name, "Intelligence Gap" methodology, obsidian-themed UI design, and the proprietary "Trust Ledger" algorithm are the exclusive intellectual property of the FastDeal development team.</li>
                            <li><strong className="text-white">License:</strong> We grant you a limited, non-exclusive, non-transferable license to access the terminal for personal, non-commercial use.</li>
                            <li><strong className="text-white">Restrictions:</strong> You may not reverse-engineer, decompile, or attempt to extract the source code of our 1.2s search engine or any backend functionality.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Marketplace Intermediary Disclaimer</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong className="text-white">Nature of Service:</strong> FastDeal acts as an intelligence intermediary. We do not own, stock, or sell the products displayed in the "Best Deals" or search results sections.</li>
                            <li><strong className="text-white">Third-Party Terms:</strong> When you purchase a product (e.g., an iPhone 17) via FastDeal, you are also entering into a contract with the third-party marketplace (Amazon, eBay, etc.). FastDeal is not responsible for vendor-side delays, product defects, or inventory inaccuracies.</li>
                            <li><strong className="text-white">Pricing Accuracy:</strong> While our goal is 99.9% price accuracy, global markets fluctuate rapidly. The final price is determined at the moment of checkout on the source marketplace.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Membership & Subscription Tiers</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong className="text-white">Free Tier:</strong> Provides basic search and one (1) price tracking slot.</li>
                            <li><strong className="text-white">Pro Tier ($15/mo):</strong> Includes global fulfillment and instant purchase features.</li>
                            <li><strong className="text-white">Ultra Tier ($40/mo):</strong> Includes the Smart Agent Searcher. Use of the Smart Agent is subject to "Fair Use" limits to prevent API saturation.</li>
                            <li><strong className="text-white">Billing:</strong> All fees are billed in advance. Failure to pay will result in account downgrading to the Free Tier.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. Limitation of Liability</h2>
                        <p className="mb-4">To the maximum extent permitted by law, FastDeal and its founders shall not be liable for:</p>
                        <ul className="list-disc pl-5 space-y-2 mb-4">
                            <li>Any indirect, incidental, or consequential damages arising from your use of the Platform.</li>
                            <li>Financial losses incurred due to price changes or "missed deals."</li>
                            <li>Issues arising from international shipping, customs seizures, or third-party logistics failures.</li>
                        </ul>
                        <p><strong className="text-white">The "Intelligence Guarantee":</strong> While we strive for "Perfect Matches," the Trust Ledger score is an AI-generated estimate and should not be viewed as an absolute guarantee of vendor behavior.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">8. Termination of Service</h2>
                        <p className="mb-4">We reserve the right to suspend or terminate your access to the FastDeal terminal without notice if:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>You violate these Terms.</li>
                            <li>You engage in "Scraper Warfare" or other activities that stress our infrastructure.</li>
                            <li>Requested by law enforcement or government agencies.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">9. Governing Law</h2>
                        <p>These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the founders operate (Kazakhstan), without regard to its conflict of law provisions.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">10. Changes to Terms</h2>
                        <p>FastDeal is a rapidly evolving project. We reserve the right to modify these Terms at any time. We will notify you of significant changes via the "Instruction" link in the top navigation bar or via email.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">11. Contact Information</h2>
                        <p className="mb-4">If you have questions regarding these Terms or wish to report a bug in the terminal:</p>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <p className="mb-2"><strong className="text-neonCyan">Email:</strong> fastdealdevelopment@gmail.com</p>
                            <p><strong className="text-neonCyan">Support:</strong> +7 771 219 92 89 | +7 778 488 4961</p>
                        </div>
                        <p className="mt-8 text-sm text-white/40 italic">By clicking "Accept" or continuing to use the FastDeal Search Terminal, you agree to these Terms of Use.</p>
                    </section>
                </div>
            </motion.div>
        </div>
    );
};

export default TermsPage;
