import { useState } from "react";
import { useLoaderData, Link } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import Wrapper from "../../assets/wrappers/JobsContainer";
import day from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import ChatWindow from "../components/ChatWindow";
day.extend(advancedFormat);

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/clinics/my-applications");
    // Also fetch current clinic user
    const { data: userData } = await customFetch.get("/clinics/current-user");
    return { applications: data.applications, currentUser: userData.user };
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return { applications: [], currentUser: null };
  }
};

const Candidates = () => {
  const { applications: initialApps, currentUser } = useLoaderData();
  const [applications, setApplications] = useState(initialApps);
  const [activeChat, setActiveChat] = useState(null); // application _id of the open chat

  const updateStatus = async (appId, status) => {
    try {
      const { data } = await customFetch.patch(
        `/clinics/applications/${appId}/status`,
        { status }
      );
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? data.application : a))
      );
      toast.success(`Application ${status} successfully`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  if (applications.length === 0) {
    return (
      <Wrapper>
        <h2>No candidates found yet...</h2>
      </Wrapper>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-color)]">Applications Received</h1>
      </div>

      <div className="bg-[var(--background-secondary-color)] rounded-2xl shadow-sm border border-[var(--border-color)] overflow-hidden">
        <table className="min-w-full divide-y divide-[var(--border-color)]">
          <thead className="bg-[var(--background-color)]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary-color)] uppercase tracking-wider">Candidate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary-color)] uppercase tracking-wider">Job Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary-color)] uppercase tracking-wider">Applied Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary-color)] uppercase tracking-wider">Compatibility</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary-color)] uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary-color)] uppercase tracking-wider">CV</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary-color)] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {applications.map((app) => (
              <tr key={app._id} className="hover:bg-[var(--background-secondary-color)]">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-[var(--text-color)]">
                        {app.healthCareProfessional?.name} {app.healthCareProfessional?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {app.healthCareProfessional?.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[var(--text-color)]">
                    {app.job?.position}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[var(--text-color)]">
                    {day(app.createdAt).format("MMM Do, YYYY")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {app.compatibilityScore || 0}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      app.status === "applied"
                        ? "bg-yellow-100 text-yellow-800"
                        : app.status === "accepted"
                        ? "bg-green-100 text-green-800"
                        : app.status === "viewed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {app.healthCareProfessional?.activeCV === "uploaded" ? (
                    app.healthCareProfessional?.curriculumVitae ? (
                      <a
                        href={app.healthCareProfessional?.curriculumVitae}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200"
                      >
                        View PDF
                      </a>
                    ) : (
                      <span className="text-gray-400">PDF Missing</span>
                    )
                  ) : (
                    <Link
                      to={`/dashboard/generated-cv/${app.healthCareProfessional?._id}`}
                      state={{ profile: app.healthCareProfessional }}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200"
                    >
                      View Generated CV
                    </Link>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2 flex-wrap">
                    {app.status !== "accepted" && (
                      <button
                        onClick={() => updateStatus(app._id, "accepted")}
                        className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition"
                      >
                        Accept
                      </button>
                    )}
                    {app.status !== "rejected" && (
                      <button
                        onClick={() => updateStatus(app._id, "rejected")}
                        className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition"
                      >
                        Reject
                      </button>
                    )}
                    {app.status !== "viewed" && app.status === "applied" && (
                      <button
                        onClick={() => updateStatus(app._id, "viewed")}
                        className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                      >
                        Mark Viewed
                      </button>
                    )}
                    <button
                      onClick={() =>
                        setActiveChat(activeChat === app._id ? null : app._id)
                      }
                      className="px-3 py-1 text-xs font-semibold rounded-full bg-[var(--primary-100)] text-[var(--primary-700)] hover:bg-[var(--primary-200)] transition"
                    >
                      {activeChat === app._id ? "Close Chat" : "Message"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chat Window — renders below the table for the selected candidate */}
      {activeChat && (() => {
        const app = applications.find((a) => a._id === activeChat);
        if (!app) return null;
        return (
          <div className="mt-6 flex justify-center">
            <ChatWindow
              jobId={app.job?._id}
              currentUser={currentUser}
              recipientUser={{ ...app.healthCareProfessional, role: "healthcareprofessional" }}
            />
          </div>
        );
      })()}
    </div>
  );
};

export default Candidates;
