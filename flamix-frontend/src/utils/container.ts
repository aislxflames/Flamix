const url = `http://localhost:5000/api/v1/project`;

export async function createContainer(
  projectName: string,
  data: {
    name: string;
    env?: Record<string, string>;
    gitUrl?: string;
    ports?: { iPort: number; ePort?: number }[];
    domains?: string[];
  },
) {
  try {
    const res = await fetch(`${url}/${projectName}/container`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("createContainer error:", error);
    throw error;
  }
}
export async function deleteContainer(
  projectName: string,
  containerName: string,
) {
  try {
    const res = await fetch(
      `${url}/${projectName}/container/${containerName}/delete`,
      {
        method: "DELETE",
      },
    );

    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function installContainer(
  projectName: string,
  containerName: string,
) {
  try {
    const res = await fetch(
      `${url}/${projectName}/container/${containerName}/install`,
      {
        method: "POST",
      },
    );

    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function startContainer(
  projectName: string,
  containerName: string,
) {
  try {
    const res = await fetch(
      `${url}/${projectName}/container/${containerName}/start`,
      {
        method: "POST",
      },
    );

    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function stopContainer(
  projectName: string,
  containerName: string,
) {
  try {
    const res = await fetch(
      `${url}/${projectName}/container/${containerName}/stop`,
      {
        method: "POST",
      },
    );

    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (e) {
    console.error(e);
  }
}
