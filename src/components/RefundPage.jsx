import React from 'react';
import { motion } from 'framer-motion';

const RefundPage = () => {
    return (
        <div className="w-full max-w-4xl px-8 mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-invert prose-lg max-w-none pb-20"
            >
                <h1 className="text-5xl font-bold mb-2 tracking-tight">Refund and Cancellation Policy</h1>
                <p className="text-white/40 mb-12 font-mono text-sm">Effective Date: February 7, 2026</p>

                <div className="space-y-12 text-white/80 font-light leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Subscription Services (Pro & Ultra Plans)</h2>
                        <p className="mb-4">FastDeal offers digital subscription services designed to provide advanced market intelligence and global fulfillment capabilities.</p>

                        <h3 className="text-lg font-bold text-neonCyan mb-2">A. 7-Day Performance Guarantee</h3>
                        <p className="mb-4">We offer a 7-day money-back guarantee for first-time subscribers of the Pro ($15/mo) and Ultra ($40/mo) plans. If the FastDeal terminal does not successfully identify a price gap or fulfill its "1.2s Intelligent Scan" promise within your first week, you are eligible for a full refund of your subscription fee.</p>

                        <h3 className="text-lg font-bold text-neonCyan mb-2">B. Renewal and Cancellation</h3>
                        <p className="mb-4"><strong className="text-white">Cancellation:</strong> You may cancel your subscription at any time via the "Settings" sidebar or the "My Account" terminal. Cancellation will stop future billing, but you will retain access to your Pro or Ultra features until the end of the current billing cycle.</p>
                        <p className="mb-4"><strong className="text-white">Partial Refunds:</strong> We do not offer prorated or partial refunds for mid-month cancellations. Upon cancellation, your account will revert to the Free Tier at the start of the next billing period.</p>

                        <h3 className="text-lg font-bold text-neonCyan mb-2">C. The "Smart Agent" Clause (Ultra Plan)</h3>
                        <p>Refunds for the Ultra Plan will not be issued based on the "results" of the Smart Agent Searcher (e.g., if the AI could not find a specific discount for a rare item). The Ultra fee covers the access to the AI technology and the computational power required for 24/7 monitoring, not a guaranteed purchase price.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Global Product Purchases & Fulfillment</h2>
                        <p className="mb-4">FastDeal facilitates purchases from third-party global marketplaces (Amazon, eBay, AliExpress, etc.). Because we act as an intermediary logistics agent, the following rules apply:</p>

                        <h3 className="text-lg font-bold text-neonCyan mb-2">A. Marketplace Returns</h3>
                        <p className="mb-2">When you purchase a product through the FastDeal terminal, you are subject to the Return Policy of the original vendor (e.g., Amazon DE or eBay).</p>
                        <ul className="list-disc pl-5 space-y-2 mb-4">
                            <li><strong className="text-white">FastDeal Role:</strong> We will assist you in initiating the return with the vendor and providing the necessary documentation.</li>
                            <li><strong className="text-white">Refund Timing:</strong> FastDeal will issue your refund only after the original marketplace has confirmed the return and refunded the payment to our secure gateway.</li>
                        </ul>

                        <h3 className="text-lg font-bold text-neonCyan mb-2">B. Logistics and Shipping Fees</h3>
                        <ul className="list-disc pl-5 space-y-2 mb-4">
                            <li><strong className="text-white">Non-Refundable Costs:</strong> International shipping fees, customs duties, and import taxes paid to third-party carriers are generally non-refundable once the item has left the country of origin.</li>
                            <li><strong className="text-white">Lost or Damaged Items:</strong> If an item is lost or damaged during the global fulfillment process managed by FastDeal, we will issue a full refund (including shipping) or a free replacement, provided the claim is filed within 48 hours of the delivery date.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Non-Refundable Items & Services</h2>
                        <p className="mb-4">The following cannot be refunded under any circumstances:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong className="text-white">Customs/Import Duties:</strong> These are government-mandated fees and are out of FastDeal’s control.</li>
                            <li><strong className="text-white">Digital Credits:</strong> Any "FastDeal Credits" or promotional balances applied to an account.</li>
                            <li><strong className="text-white">Completed "Instant Purchases":</strong> Once an order is placed on a global marketplace via the Pro/Ultra "Instant Purchase" feature, it cannot be canceled if the vendor has already initiated the shipping process.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Refund Request Process</h2>
                        <p className="mb-4">To initiate a refund, please follow the protocol below:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong className="text-white">Submit a Request:</strong> Navigate to "My Orders" and select the "Request Intelligence Audit/Refund" button on the specific item.</li>
                            <li><strong className="text-white">Review:</strong> Our team (led by Karimkhan Ilyas and Karimzhan Adil) will review the transaction logs to verify the "Trust Ledger" status and marketplace response.</li>
                            <li><strong className="text-white">Approval:</strong> You will receive a notification within 2–4 business days regarding your refund status.</li>
                            <li><strong className="text-white">Credit:</strong> Approved refunds are credited back to the original payment method. Depending on your bank, this may take 5–10 business days to appear in your account.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Chargebacks and Disputes</h2>
                        <p>We encourage users to contact our support team before initiating a chargeback with their bank. Unauthorized chargebacks will result in the immediate permanent suspension of your FastDeal account and the forfeiture of any active "Price Tracking" slots.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Contact Information</h2>
                        <p className="mb-4">For all refund-related inquiries:</p>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <p className="mb-2"><strong className="text-neonCyan">Support Email:</strong> fastdealdevelopment@gmail.com</p>
                            <p><strong className="text-neonCyan">Technical Support:</strong> +7 771 219 92 89 | +7 778 488 4961</p>
                        </div>
                    </section>
                </div>
            </motion.div>
        </div>
    );
};

export default RefundPage;
