import React, { useEffect, useState } from "react";
import SEO from "../components/SEO";
import axios from "axios";

const getRoleTier = (role) => {
  const roleText = String(role || "").toLowerCase();
  if (roleText.includes("leader")) return "leader";
  if (roleText.includes("coordinator")) return "coordinator";
  if (roleText.includes("intern")) return "intern";
  return "member";
};

const MemberCard = ({ node }) => (
  <div className="w-full md:w-[280px] rounded-2xl border border-border bg-white px-5 py-4 shadow-sm">
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-11 h-11 rounded-full overflow-hidden border border-border bg-bg shrink-0">
        {node.profilePicture ? (
          <img src={node.profilePicture} alt={node.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-primary font-black">
            {(node.name || "?").charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-black text-text-body truncate">{node.name}</div>
        <div className="text-[11px] text-text-body/50 font-bold truncate">{node.teamRole || "Member"}</div>
      </div>
    </div>
  </div>
);

const TierRow = ({ title, nodes, showConnector = true }) => {
  if (!nodes.length) return null;
  return (
    <div className="flex flex-col items-center">
      <div className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-4">{title}</div>
      <div className="flex flex-wrap justify-center gap-4 w-full">
        {nodes.map((node) => (
          <MemberCard key={node.id} node={node} />
        ))}
      </div>
      {showConnector ? <div className="w-px h-8 bg-primary/30 my-2" /> : null}
    </div>
  );
};

const flattenTree = (nodes, acc = []) => {
  nodes.forEach((node) => {
    acc.push(node);
    if (node.children?.length) flattenTree(node.children, acc);
  });
  return acc;
};

const OurTeam = () => {
  const [data, setData] = useState({ roots: [], orphans: [], total: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/team/tree`)
      .then((res) => setData(res.data))
      .catch(() => setData({ roots: [], orphans: [], total: 0 }))
      .finally(() => setLoading(false));
  }, []);

  const allMembers = flattenTree([...(data.roots || []), ...(data.orphans || [])]);
  const uniqueMembers = Array.from(new Map(allMembers.map((member) => [member.id, member])).values());

  const leaderTier = uniqueMembers.filter((member) => getRoleTier(member.teamRole) === "leader");
  const coordinatorTier = uniqueMembers.filter((member) => getRoleTier(member.teamRole) === "coordinator");
  const memberTier = uniqueMembers.filter((member) => getRoleTier(member.teamRole) === "member");
  const internTier = uniqueMembers.filter((member) => getRoleTier(member.teamRole) === "intern");

  return (
    <div className="bg-bg min-h-screen py-24">
      <SEO title="Our Team | Humanity Calls" description="Team hierarchy and collaborators at Humanity Calls." />

      <div className="max-w-6xl mx-auto px-[5%]">
        <h1 className="text-4xl md:text-6xl font-black text-[#1a1a1a] tracking-tight">
          Our <span className="text-primary italic">Team Tree</span>
        </h1>
        <p className="mt-4 text-text-body/60 max-w-2xl">
          Binary-style hierarchy from team leaders to coordinators, members, and interns.
        </p>

        <div className="mt-10">
          {loading ? (
            <div className="py-20 text-center text-text-body/60 font-bold">Loading team...</div>
          ) : uniqueMembers.length > 0 ? (
            <div className="bg-white rounded-3xl border border-border shadow-xl p-6 md:p-10">
              <TierRow title="Team Leaders" nodes={leaderTier} />
              <TierRow title="Coordinators" nodes={coordinatorTier} />
              <TierRow title="Team Members" nodes={memberTier} />
              <TierRow title="Interns" nodes={internTier} showConnector={false} />
            </div>
          ) : (
            <div className="py-16 text-center text-text-body/60 font-bold">
              No team members found yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OurTeam;

