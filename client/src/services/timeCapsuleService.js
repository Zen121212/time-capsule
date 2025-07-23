import api from "./api.js";

async function getTimeCapsules() {
  try {
    const response = await api.get("/time-capsules");
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Get time capsules error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch time capsules",
    };
  }
}

async function getPublicTimeCapsules() {
  try {
    const response = await api.get("/time-capsules-public");
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Get public time capsules error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Failed to fetch public time capsules",
    };
  }
}

async function createTimeCapsule(capsuleData) {
  try {
    const backendData = {
      title: capsuleData.title,
      message: capsuleData.message,
      reveal_date: capsuleData.revealDate,
      is_public: capsuleData.privacy === "Public",
      color: capsuleData.color,
      emoji: capsuleData.emoji,
      privacy: capsuleData.privacy.toLowerCase(),
    };

    // Include GPS coordinates if provided
    if (capsuleData.latitude && capsuleData.longitude) {
      backendData.latitude = capsuleData.latitude;
      backendData.longitude = capsuleData.longitude;
    }

    console.log("Creating time capsule:", backendData);

    const response = await api.post("/time-capsules", backendData);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Create time capsule error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create time capsule",
      errors: error.response?.data?.errors || {},
    };
  }
}

async function updateTimeCapsule(id, capsuleData) {
  try {
    const backendData = {
      title: capsuleData.title,
      message: capsuleData.message,
      location: capsuleData.location,
      reveal_date: capsuleData.revealDate,
      is_public: capsuleData.privacy === "Public",
      color: capsuleData.color,
      emoji: capsuleData.emoji,
      privacy: capsuleData.privacy.toLowerCase(),
    };

    const response = await api.put(`/time-capsules/${id}`, backendData);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Update time capsule error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update time capsule",
      errors: error.response?.data?.errors || {},
    };
  }
}

// Delete a time capsule
async function deleteTimeCapsule(id) {
  try {
    await api.delete(`/time-capsules/${id}`);
    return {
      success: true,
      message: "Time capsule deleted successfully",
    };
  } catch (error) {
    console.error("Delete time capsule error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete time capsule",
    };
  }
}

// Get a specific time capsule by ID
async function getTimeCapsule(id) {
  try {
    const response = await api.get(`/time-capsules/${id}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Get time capsule error:", error);

    let errorMessage = "Failed to fetch time capsule";

    if (error.response?.status === 401) {
      errorMessage = "You are not authenticated. Please log in again.";
    } else if (error.response?.status === 403) {
      errorMessage =
        error.response?.data?.message || "This action is unauthorized.";
    } else if (error.response?.status === 404) {
      errorMessage = "Time capsule not found.";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return {
      success: false,
      message: errorMessage,
      status: error.response?.status,
    };
  }
}

// Get a specific time capsule by unlisted token (public access)
async function getTimeCapsuleByToken(token) {
  try {
    const response = await api.get(`/time-capsules/unlisted/${token}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    let errorMessage =
      "Something went wrong while loading the time capsule. Please try again later.";

    if (error.response?.status === 404) {
      errorMessage = "Time capsule not found or the link is no longer valid.";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    return {
      success: false,
      message: errorMessage,
      status: error.response?.status,
    };
  }
}

export const timeCapsuleService = {
  getTimeCapsules,
  getPublicTimeCapsules,
  createTimeCapsule,
  updateTimeCapsule,
  deleteTimeCapsule,
  getTimeCapsule,
  getTimeCapsuleByToken,
};
