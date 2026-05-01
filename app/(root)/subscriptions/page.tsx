'use client';

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function SubscriptionsPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: [
        "1 book upload per month",
        "5 minutes session duration",
        "2 sessions per month",
        "Text chat only",
      ],
      cta: "Current Plan",
      ctaVariant: "outline" as const,
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "/month",
      description: "Great for book enthusiasts",
      features: [
        "10 book uploads per month",
        "30 minutes session duration",
        "20 sessions per month",
        "Voice & text chat",
        "Priority support",
      ],
      cta: "Upgrade Now",
      ctaVariant: "default" as const,
      featured: true,
    },
    {
      name: "Premium",
      price: "$19.99",
      period: "/month",
      description: "For power users",
      features: [
        "Unlimited book uploads",
        "60 minutes session duration",
        "Unlimited sessions",
        "Voice & text chat",
        "Custom book personas",
        "Advanced analytics",
      ],
      cta: "Upgrade Now",
      ctaVariant: "default" as const,
    },
  ];

  return (
    <div className="container wrapper py-10">
      <div className="flex flex-col items-center text-center mb-16">
        <h1 className="text-4xl font-bold font-serif mb-4">Choose Your Plan</h1>
        <p className="text-muted-foreground max-w-2xl">
          Upgrade to unlock more books, longer sessions, and advanced features.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-lg border p-8 flex flex-col transition-all ${
              plan.featured
                ? "border-[#212a3b] bg-[#f3e4c7] scale-105"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold font-serif mb-2">{plan.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-gray-600">{plan.period}</span>}
              </div>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              variant={plan.ctaVariant}
              className="w-full"
              disabled={plan.cta === "Current Plan"}
            >
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <p className="text-sm text-gray-700">
          💡 <strong>Note:</strong> Billing integration is coming soon. For now, features are available to all users.
        </p>
      </div>
    </div>
  );
}
