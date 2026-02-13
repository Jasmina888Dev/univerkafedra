import api from "./api";

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/api/auth/login", { email, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post("/api/auth/register", userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

export const studentService = {
  getAll: async () => {
    const response = await api.get("/students");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  getTop: async () => {
    const response = await api.get("/students/top");
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/students", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },
};

export const teacherService = {
  getAll: async () => {
    const response = await api.get("/teachers");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/teachers/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/teachers", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/teachers/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/teachers/${id}`);
    return response.data;
  },
};

export const subjectService = {
  getAll: async () => {
    const response = await api.get("/subjects");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/subjects/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/subjects", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/subjects/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/subjects/${id}`);
    return response.data;
  },
};

export const gradeService = {
  getAll: async () => {
    const response = await api.get("/grades");
    return response.data;
  },

  getByStudent: async (studentId) => {
    const response = await api.get(`/grades/student/${studentId}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/grades", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/grades/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/grades/${id}`);
    return response.data;
  },
};

export const studyPlanService = {
  getAll: async () => {
    const response = await api.get("/study-plans");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/study-plans/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/study-plans", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/study-plans/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/study-plans/${id}`);
    return response.data;
  },
};

export const newsService = {
  getAll: async () => {
    const response = await api.get("/news");
    return response.data;
  },

  getAllAdmin: async () => {
    const response = await api.get("/news/all");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/news/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/news", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/news/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/news/${id}`);
    return response.data;
  },
};

export const graduateService = {
  getAll: async () => {
    const response = await api.get("/graduates");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/graduates/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/graduates", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/graduates/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/graduates/${id}`);
    return response.data;
  },
};

export const statsService = {
  get: async () => {
    const response = await api.get("/stats");
    return response.data;
  },
};
