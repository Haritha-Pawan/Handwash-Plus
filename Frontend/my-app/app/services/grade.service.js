import api from "../lib/axios";
import { getAuthUser } from "../lib/auth";

function buildSchoolParams() {
  const user = getAuthUser();

  if (user?.role === "superAdmin") {
    const schoolId = user?.schoolId || user?.school || null;
    if (schoolId) {
      return { schoolId };
    }
  }

  return {};
}

export const getGrades = async () => {
  const { data } = await api.get("/grades/", {
    params: buildSchoolParams(),
  });
  return data;
};

export const getGradeById = async (gradeId) => {
  const { data } = await api.get(`/grades/${gradeId}`, {
    params: buildSchoolParams(),
  });
  return data;
};

export const createGrades = async (payload) => {
  const { data } = await api.post("/grades/", payload, {
    params: buildSchoolParams(),
  });
  return data;
};

export const createIndividualGrade = async (payload) => {
  const { data } = await api.post("/grades/individual", payload, {
    params: buildSchoolParams(),
  });
  return data;
};

export const updateGrade = async (gradeId, payload) => {
  const { data } = await api.patch(`/grades/${gradeId}`, payload, {
    params: buildSchoolParams(),
  });
  return data;
};

export const deactivateGrade = async (gradeId) => {
  const { data } = await api.patch(
    `/grades/${gradeId}/deactivate`,
    {},
    {
      params: buildSchoolParams(),
    }
  );
  return data;
};

export const checkSanitizerAndAlert = async () => {
  const { data } = await api.get("/grades/sanitizer-check", {
    params: buildSchoolParams(),
  });
  return data;
};

export const distributeBottles = async (gradeId, payload) => {
  const { data } = await api.post(
    `/grades/${gradeId}/distribute-bottles`,
    payload,
    {
      params: buildSchoolParams(),
    }
  );
  return data;
};