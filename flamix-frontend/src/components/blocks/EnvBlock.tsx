"use client";

import { useEffect, useState } from "react";
import { getContainer, updateContainer } from "@/utils/container";
import EnvKeyValue from "../env/EnvKeyValue";

interface IEnvBlockProps {
  projectName: string;
  containerName: string;
}

export default function EnvBlock({
  projectName,
  containerName,
}: IEnvBlockProps) {
  const [envData, setEnvData] = useState({ env: {} });
  const [container, setContainer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const res = await getContainer(projectName, containerName);

      // API returns: { success: true, container: {...} }
      setContainer(res.container);
      setLoading(false);
    }

    fetchData();
  }, [projectName, containerName]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <EnvKeyValue
        initialEnv={container.env || {}}
        onChange={(value) => {
          setEnvData(value);
          updateContainer(projectName, containerName, value);
        }}
      />
    </div>
  );
}
