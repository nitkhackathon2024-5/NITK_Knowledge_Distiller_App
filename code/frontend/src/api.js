const base_url = "http://localhost:5000";
export const login = async (email, password) => {
  try {
    const response = await fetch(`${base_url}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error.message);
    return {
      status: "fail",
      error: `Error : ${error.message}`,
    };
  }
};

export const signup = async (name, email, password) => {
  try {
    const response = await fetch(`${base_url}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return {
      status: "fail",
      error: `Error : ${error.message}`,
    };
  }
};

export const getAllGraphs = async (user_id) => {
  try {
    console.log("HEllo");

    const response = await fetch(`${base_url}/user/${user_id}/graphs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("World");

    const data = await response.json();
    console.log(data);

    return data;
  } catch (error) {
    console.log(error.message);
    return {
      status: "fail",
      error: `Error : ${error.message}`,
    };
  }
};

export const getAGraph = async (user_id, graph_id) => {
  try {
    const response = await fetch(
      `${base_url}/user/${user_id}/graphs/${graph_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error.message);
    return {
      status: "fail",
      error: `Error : ${error.message}`,
    };
  }
};

export const createPG = async (pgData) => {
  try {
    // console.log(pgData);
    const response = await fetch(`${base_url}/api/v1/pg`, {
      method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      body: pgData,
      credentials: "include",
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error.message);
    return {
      status: "requestFail",
      error: "Something Went Wrong.",
    };
  }
};
