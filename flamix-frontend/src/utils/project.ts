const url = `http://localhost:5000/api/v1/project`;

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

export async function fetchAllProjects() {
  try {
    const res = await fetch(`http://localhost:5000/api/v1/projects`);

    const data = await res.json();
    return data;
  } catch (e) { }
}
