"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    serviceType: "Service 1",
    description: "",
  });

  const [dashboard, setDashboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(`${API}/api/dashboard`);

      setDashboard(res.data.dashboardData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDashboard();

    const socket = io(API as string);

    socket.on("leadAssigned", () => {
      fetchDashboard();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(`${API}/api/leads/create`, formData);

      alert("Lead Created Successfully");

      setFormData({
        name: "",
        phone: "",
        city: "",
        serviceType: "Service 1",
        description: "",
      });

      fetchDashboard();
    } catch (error: any) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-8">
        Mini Lead Distribution System
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-6 rounded-xl mb-10 space-y-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 rounded bg-zinc-800"
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-3 rounded bg-zinc-800"
          required
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="w-full p-3 rounded bg-zinc-800"
          required
        />

        <select
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          className="w-full p-3 rounded bg-zinc-800"
        >
          <option>Service 1</option>
          <option>Service 2</option>
          <option>Service 3</option>
        </select>

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 rounded bg-zinc-800"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-white text-black px-6 py-3 rounded font-bold"
        >
          {loading ? "Submitting..." : "Create Lead"}
        </button>
      </form>

      <div className="grid md:grid-cols-2 gap-6">
        {dashboard.map((provider) => (
          <div
            key={provider.providerId}
            className="bg-zinc-900 p-5 rounded-xl"
          >
            <h2 className="text-2xl font-bold mb-3">
              {provider.providerName}
            </h2>

            <p>Monthly Quota: {provider.monthlyQuota}</p>
            <p>Used Quota: {provider.usedQuota}</p>
            <p>Remaining Quota: {provider.remainingQuota}</p>
            <p>Leads Received: {provider.leadsReceived}</p>

            <div className="mt-4">
              <h3 className="font-bold mb-2">Assigned Leads</h3>

              {provider.assignedLeads.length === 0 ? (
                <p>No Leads</p>
              ) : (
                provider.assignedLeads.map((lead: any) => (
                  <div
                    key={lead._id}
                    className="bg-zinc-800 p-3 rounded mb-2"
                  >
                    <p>
                      <strong>Name:</strong>{" "}
                      {lead.leadId.name}
                    </p>

                    <p>
                      <strong>Phone:</strong>{" "}
                      {lead.leadId.phone}
                    </p>

                    <p>
                      <strong>Service:</strong>{" "}
                      {lead.leadId.serviceType}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}