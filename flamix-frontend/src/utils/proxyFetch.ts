const url = `${process.env.NEXT_PUBLIC_BACKEND_API}proxy`;


export async function installProxy() {
  try {
    const res = await fetch(
      `${url}/install`,
      { method: "POST" },
    );
    if (!res.ok) {
      console.error("Somthing went wrong while fetching proxy", res)
    }

    return await res.json();
  } catch (e) {
    console.error(e);
  }
}
export async function startProxy(

) {
  try {
    const res = await fetch(
      `${url}/start`,
      { method: "POST" },
    );
    if (!res.ok) {
      console.error("Somthing went wrong while fetching proxy", res)
    }

    return await res.json();
  } catch (e) {
    console.error(e);
  }
}
export async function stopProxy(

) {
  try {
    const res = await fetch(
      `${url}/stop`,
      { method: "POST" },
    );
    if (!res.ok) {
      console.error("Somthing went wrong while fetching proxy", res)
    }

    return await res.json();
  } catch (e) {
    console.error(e);
  }
}
