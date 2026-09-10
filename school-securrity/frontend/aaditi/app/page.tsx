"use client";

import { useState } from "react";

export default function Home() {
  const [aiMessage, setAiMessage] = useState("");

  const analyzeSecurity = () => {
    setAiMessage(
      "AI Analysis: Security activity is normal. 24 visitors have been recorded today, with 1 incident requiring review."
    );
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 bg-slate-950 text-white lg:block">
        <div className="border-b border-slate-800 p-6">
          <h1 className="text-xl font-bold">🏫 SecureSchool</h1>
          <p className="mt-1 text-sm text-slate-400">
            Security Administration
          </p>
        </div>

        <nav className="p-4">
          <a className="mb-2 block rounded-lg bg-blue-600 px-4 py-3 font-medium">
            📊 Dashboard
          </a>

          <a className="mb-2 block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800">
            👨‍🎓 Students
          </a>

          <a className="mb-2 block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800">
            👨‍🏫 Staff
          </a>

          <a className="mb-2 block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800">
            👥 Visitors
          </a>

          <a className="mb-2 block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800">
            🚪 Entry / Exit
          </a>

          <a className="mb-2 block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800">
            🚨 Incidents
          </a>

          <a className="mb-2 block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800">
            🤖 AI Security
          </a>
        </nav>

        <div className="absolute bottom-0 w-full border-t border-slate-800 p-4">
          <div className="rounded-lg bg-slate-900 p-3">
            <p className="text-sm font-semibold">🔐 System Status</p>
            <p className="mt-1 text-xs text-green-400">
              ● All systems operational
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <section className="lg:ml-64">
        {/* Header */}
        <header className="flex items-center justify-between border-b bg-white px-6 py-5 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold">Security Dashboard</h2>
            <p className="text-sm text-slate-500">
              Welcome back, Administrator
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="font-semibold">Aaditi</p>
              <p className="text-xs text-slate-500">Security Admin</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
              A
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Security Banner */}
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-white shadow-lg">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-sm text-blue-100">TODAY'S SECURITY STATUS</p>
                <h3 className="mt-1 text-2xl font-bold">
                  School is Secure ✅
                </h3>
                <p className="mt-2 text-sm text-blue-100">
                  No critical threats detected in the last 24 hours.
                </p>
              </div>

              <button
                onClick={analyzeSecurity}
                className="rounded-lg bg-white px-5 py-3 font-semibold text-blue-700 shadow hover:bg-blue-50"
              >
                🤖 Analyze with AI
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Students Present"
              value="842"
              subtitle="+12 from yesterday"
              icon="👨‍🎓"
            />

            <StatCard
              title="Staff Present"
              value="76"
              subtitle="98% attendance"
              icon="👨‍🏫"
            />

            <StatCard
              title="Visitors Today"
              value="24"
              subtitle="3 currently inside"
              icon="👥"
            />

            <StatCard
              title="Security Incidents"
              value="5"
              subtitle="1 requires review"
              icon="🚨"
            />
          </div>

          {/* Main Grid */}
          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            {/* Recent Incidents */}
            <div className="rounded-2xl bg-white p-6 shadow-sm xl:col-span-2">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Recent Incidents</h3>
                  <p className="text-sm text-slate-500">
                    Latest security events
                  </p>
                </div>

                <button className="text-sm font-semibold text-blue-600">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                <Incident
                  title="Unauthorized Entry Attempt"
                  location="Main Gate"
                  time="10:42 AM"
                  severity="HIGH"
                />

                <Incident
                  title="Unverified Visitor"
                  location="Science Block"
                  time="09:25 AM"
                  severity="MEDIUM"
                />

                <Incident
                  title="Missing Exit Record"
                  location="North Gate"
                  time="08:50 AM"
                  severity="LOW"
                />

                <Incident
                  title="Visitor ID Verification"
                  location="Reception"
                  time="08:20 AM"
                  severity="LOW"
                />
              </div>
            </div>

            {/* AI Assistant */}
            <div className="rounded-2xl bg-slate-950 p-6 text-white shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl">
                  🤖
                </div>

                <div>
                  <h3 className="font-bold">GenAI Security Assistant</h3>
                  <p className="text-xs text-slate-400">
                    AI-powered security analysis
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-sm leading-6 text-slate-300">
                  I can analyze incidents, summarize security logs, identify
                  unusual activity, and provide recommendations.
                </p>
              </div>

              <button
                onClick={analyzeSecurity}
                className="mt-4 w-full rounded-lg bg-blue-600 py-3 font-semibold hover:bg-blue-500"
              >
                Analyze Today's Activity
              </button>

              {aiMessage && (
                <div className="mt-4 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
                  <p className="text-sm leading-6 text-blue-100">
                    {aiMessage}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold">Quick Actions</h3>
            <p className="mb-5 text-sm text-slate-500">
              Frequently used security operations
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <QuickAction icon="👥" title="Register Visitor" />
              <QuickAction icon="🚪" title="Record Entry / Exit" />
              <QuickAction icon="🚨" title="Report Incident" />
              <QuickAction icon="🤖" title="AI Analysis" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

function Incident({
  title,
  location,
  time,
  severity,
}: {
  title: string;
  location: string;
  time: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
}) {
  const severityClass =
    severity === "HIGH"
      ? "bg-red-100 text-red-700"
      : severity === "MEDIUM"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700";

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-xs text-slate-500">
          {location} • {time}
        </p>
      </div>

      <span
        className={`rounded-full px-3 py-1 text-xs font-bold ${severityClass}`}
      >
        {severity}
      </span>
    </div>
  );
}

function QuickAction({
  icon,
  title,
}: {
  icon: string;
  title: string;
}) {
  return (
    <button className="rounded-xl border border-slate-200 p-5 text-left transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md">
      <div className="text-2xl">{icon}</div>
      <p className="mt-3 font-semibold">{title}</p>
      <p className="mt-1 text-xs text-slate-500">
        Open security module
      </p>
    </button>
  );
}