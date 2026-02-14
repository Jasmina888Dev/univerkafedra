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
    const response = await api.get("/api/auth/me");
    return response.data;
  },
};

export const studentService = {
  getAll: async () => {
    const response = await api.get("/api/students");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/students/${id}`);
    return response.data;
  },

  getTop: async () => {
    const response = await api.get("/api/students/top");
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/api/students", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/api/students/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/students/${id}`);
    return response.data;
  },
};

export const teacherService = {
  getAll: async () => {
    const response = await api.get("/api/teachers");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/teachers/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/api/teachers", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/api/teachers/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/teachers/${id}`);
    return response.data;
  },
};

export const subjectService = {
  getAll: async () => {
    const response = await api.get("/api/subjects");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/subjects/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/api/subjects", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/api/subjects/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/subjects/${id}`);
    return response.data;
  },
};

export const gradeService = {
  getAll: async () => {
    const response = await api.get("/api/grades");
    return response.data;
  },

  getByStudent: async (studentId) => {
    const response = await api.get(`/api/grades/student/${studentId}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/api/grades", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/api/grades/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/grades/${id}`);
    return response.data;
  },
};

export const studyPlanService = {
  getAll: async () => {
    const response = await api.get("/api/study-plans");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/study-plans/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/api/study-plans", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/api/study-plans/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/study-plans/${id}`);
    return response.data;
  },
};

export const newsService = {
  getAll: async () => {
    const response = await api.get("/api/news");
    return response.data;
  },

  getAllAdmin: async () => {
    const response = await api.get("/api/news/all");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/news/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/api/news", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/api/news/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/news/${id}`);
    return response.data;
  },
};

export const graduateService = {
  getAll: async () => {
    const response = await api.get("/api/graduates");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/graduates/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/api/graduates", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/api/graduates/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/graduates/${id}`);
    return response.data;
  },
};

export const statsService = {
  get: async () => {
    const response = await api.get("/api/stats");
    return response.data;
  },
};
