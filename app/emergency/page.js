"use client";
import React from "react";

const emergencyData = [
  {
    category: "Medical Emergency",
    contact: "16263",
    description: "For urgent medical help and ambulance coordination.",
  },
  {
    category: "Ambulance Service",
    contact: "199",
    description: "National ambulance helpline number.",
  },
  {
    category: "Fire Service",
    contact: "199",
    description: "Call for fire emergencies and rescue operations.",
  },
  {
    category: "Police",
    contact: "999",
    description: "National emergency number for police assistance.",
  },
  {
    category: "Women & Child Helpline",
    contact: "109",
    description: "For women and child safety issues.",
  },
  {
    category: "National Helpline",
    contact: "999",
    description: "Unified emergency helpline for police, fire, and ambulance.",
  },
];

// 🔸 Hardcoded special users
const specialUsers = [
  {
    specialUserName: "first",
    specialUserPhone: "01245678",
    role: "army",
  },
  {
    specialUserName: "mango",
    specialUserPhone: "0125467897",
    role: "medical team",
  },
  {
    specialUserName: "orange",
    specialUserPhone: "01254789555",
    role: "police",
  },
  {
    specialUserName: "Alen",
    specialUserPhone: "01465768768",
    role: "medical team",
  },
  {
    specialUserName: "shopon",
    specialUserPhone: "01115457545",
    role: "rab",
  },
];

function EmergencyContactsPage() {
  return (
    <div className="min-h-screen bg-background p-4">
      {/* Emergency Contacts Section */}
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-red-600 dark:text-red-400 mb-6">
          Emergency Contact Numbers
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {emergencyData.map((item, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-2xl shadow-md border border-red-200 dark:border-red-900 dark:bg-card"
            >
              <h2 className="text-xl font-semibold text-red-700 dark:text-red-400">
                {item.category}
              </h2>
              <p className="text-muted-foreground mt-1">{item.description}</p>
              <p className="text-2xl font-bold text-red-500 dark:text-red-400 mt-4">
                📞 {item.contact}
              </p>
            </div>
          ))}
        </div>

        {/* Hardcoded Special Users Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">
            Emergency Response Team
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialUsers.map((user, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-2xl shadow-md border border-blue-200 dark:border-blue-900 dark:bg-card hover:shadow-lg transition-shadow"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400">
                    {user.specialUserName}
                  </h3>
                  <span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                    {user.role}
                  </span>
                  <p className="text-xl font-bold text-blue-500 dark:text-blue-400 mt-2">
                    📞 {user.specialUserPhone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmergencyContactsPage;
