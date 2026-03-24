import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Crown, Star, Gift, Users, Zap, Check, ArrowLeft, CreditCard } from 'lucide-react'
import { useAuth } from '../shared/context/AuthContext'

const PremiumUpgradePage = () => {
    const [selectedPlan, setSelectedPlan] = useState('monthly')
    const [showPayment, setShowPayment] = useState(false)
    const { user, isAuthenticated, upgradeToPremium } = useAuth()
    const navigate = useNavigate()

    // Redirect to auth if not logged in
    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />
    }

    // Redirect if already premium
    if (user?.accountType === 'Premium') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 via-neutral-50 to-accent-50">
                <div className="max-w-4xl mx-auto container-padding py-12 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-400 to-accent-500 rounded-3xl mb-6 shadow-soft">
                        <Crown className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-neutral-800 mb-4">You're Already Premium!</h1>
                    <p className="text-xl text-neutral-600 mb-8">Enjoy all the exclusive benefits of your Premium membership.</p>
                    <Link to="/profile" className="btn-primary">
                        Go to Profile
                    </Link>
                </div>
            </div>
        )
    }

    const handleUpgrade = () => {
        // Simulate payment processing
        setTimeout(() => {
            upgradeToPremium()
            alert('Congratulations! You have been upgraded to Premium!')
            navigate('/profile')
        }, 1000)
    }

    const plans = [
        {
            id: 'monthly',
            name: 'Monthly Premium',
            price: 99,
            period: 'month',
            savings: null,
            popular: false
        },
        {
            id: 'yearly',
            name: 'Yearly Premium',
            price: 999,
            period: 'year',
            savings: '2 months free',
            popular: true
        }
    ]

    const benefits = [
        {
            icon: Gift,
            title: 'Earn 2x Reward Points',
            description: 'Double points on every booking and referral'
        },
        {
            icon: Star,
            title: 'Exclusive Access',
            description: 'Early access to new venues and special events'
        },
        {
            icon: Users,
            title: 'Priority Support',
            description: 'Dedicated customer service and priority booking'
        },
        {
            icon: Zap,
            title: 'Special Discounts',
            description: 'Up to 20% off on premium venues and events'
        },
        {
            icon: Crown,
            title: 'VIP Treatment',
            description: 'Complimentary upgrades and special perks'
        }
    ]

    const features = [
        'Unlimited bookings with no fees',
        'Free cancellation up to 2 hours before',
        'Exclusive premium-only events',
        'Personal concierge service',
        'Birthday and anniversary rewards',
        'Access to private dining experiences'
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-neutral-50 to-accent-50">
            <div className="max-w-6xl mx-auto container-padding pt-24 pb-12">
                {/* Back Button */}
                <Link to="/profile" className="inline-flex items-center space-x-2 text-neutral-600 hover:text-primary-500 mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Profile</span>
                </Link>

                {!showPayment ? (
                    <>
                        {/* Header */}
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-400 to-accent-500 rounded-3xl mb-6 shadow-soft">
                                <Crown className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-5xl font-bold text-neutral-800 mb-6">Upgrade to Premium</h1>
                            <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
                                Unlock exclusive benefits, earn more rewards, and enjoy VIP treatment at Dubai's finest venues
                            </p>
                        </div>

                        {/* Benefits Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                            {benefits.map((benefit, index) => {
                                const Icon = benefit.icon
                                return (
                                    <div key={index} className="text-center group">
                                        <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-soft">
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-neutral-800 mb-2">{benefit.title}</h3>
                                        <p className="text-neutral-600">{benefit.description}</p>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Pricing Plans */}
                        <div className="bg-white rounded-3xl p-8 shadow-soft-lg border border-neutral-100 mb-12">
                            <h2 className="text-3xl font-bold text-neutral-800 text-center mb-8">Choose Your Plan</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
                                {plans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${selectedPlan === plan.id
                                            ? 'border-primary-500 bg-primary-50 shadow-soft-lg'
                                            : 'border-neutral-200 hover:border-primary-300 hover:shadow-soft'
                                            }`}
                                        onClick={() => setSelectedPlan(plan.id)}
                                    >
                                        {plan.popular && (
                                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                                <span className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-soft">
                                                    Most Popular
                                                </span>
                                            </div>
                                        )}

                                        <div className="text-center">
                                            <h3 className="text-xl font-bold text-neutral-800 mb-2">{plan.name}</h3>
                                            <div className="mb-4">
                                                <span className="text-4xl font-bold text-primary-600">AED {plan.price}</span>
                                                <span className="text-neutral-500">/{plan.period}</span>
                                            </div>
                                            {plan.savings && (
                                                <div className="bg-accent-100 text-accent-700 px-3 py-1 rounded-full text-sm font-medium">
                                                    {plan.savings}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setShowPayment(true)}
                                className="w-full btn-primary text-lg py-4 mb-6"
                            >
                                Continue to Payment
                            </button>

                            <p className="text-center text-neutral-500 text-sm">
                                Cancel anytime. No hidden fees.
                            </p>
                        </div>

                        {/* Features List */}
                        <div className="bg-white rounded-3xl p-8 shadow-soft-lg border border-neutral-100">
                            <h2 className="text-3xl font-bold text-neutral-800 text-center mb-8">What's Included</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-neutral-700">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    /* Payment Form */
                    <div className="max-w-2xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-neutral-800 mb-4">Complete Your Upgrade</h1>
                            <p className="text-neutral-600">
                                You're upgrading to {plans.find(p => p.id === selectedPlan)?.name}
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-soft-lg border border-neutral-100">
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-neutral-800 mb-4">Payment Details</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                                            Card Number
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="1234 5678 9012 3456"
                                                className="input-field pr-12"
                                            />
                                            <CreditCard className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                Expiry Date
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                CVV
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="123"
                                                className="input-field"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                                            Cardholder Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="input-field"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-neutral-50 rounded-2xl p-6 mb-6">
                                <h4 className="font-semibold text-neutral-800 mb-4">Order Summary</h4>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-neutral-600">{plans.find(p => p.id === selectedPlan)?.name}</span>
                                    <span className="font-semibold text-neutral-800">AED {plans.find(p => p.id === selectedPlan)?.price}</span>
                                </div>
                                <div className="border-t border-neutral-200 pt-2 mt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-neutral-800">Total</span>
                                        <span className="text-xl font-bold text-primary-600">AED {plans.find(p => p.id === selectedPlan)?.price}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setShowPayment(false)}
                                    className="flex-1 btn-secondary"
                                >
                                    Back
                                </button>
                                <button 
                                    onClick={handleUpgrade}
                                    className="flex-1 btn-primary"
                                >
                                    Complete Upgrade
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PremiumUpgradePage
