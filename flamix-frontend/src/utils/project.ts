const url = `${process.env.NEXT_PUBLIC_BACKEND_API}project`;

export async function createProject(projectName: string) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectName: projectName }),
    });

    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function deleteProject(projectName: string) {
  try {
    const res = await fetch(`${url}/${projectName}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function fetchAllProjects() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}projects`);

    const data = await res.json();
    return data;
  } catch (e) { }
}

export async function getProject(projectName: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}project/${projectName}`,
    );

    const data = await res.json();
    return data;
  } catch (e) { }
}
