"use client";

import { useState } from "react";
import { runScript } from "~/lib/scripts/services";

export const actions = [
  {
    label: "Reload Surveys",
    path: "reinitialize-surveys",
    script: "reloadAPISurveys",
  },
  {
    label: "Reload Locales",
    path: "reinitialize-locales",
    script: "reloadAPILocales",
  },
  {
    label: "Reload Entities",
    path: "reinitialize-entities",
    script: "reloadAPIEntities",
  },
];

export const AdminAPI = () => (
  <div>
    <h2>API</h2>
    <ul>
      {actions.map((action) => (
        <li key={action.label}>
          <Action {...action} />
        </li>
      ))}
    </ul>
  </div>
);

const Action = ({ label, path, script }) => {
  const [loading, setLoading] = useState(false);
  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await runScript({ id: script, scriptArgs: {} });
    setLoading(false);
  };
  return (
    <a role="button" href="#" aria-busy={loading} onClick={handleClick}>
      {label}
    </a>
  );
};
export default AdminAPI;
