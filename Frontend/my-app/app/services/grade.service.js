import api from "../lib/axios";

export const getGrades = async (schoolId) => {
  const { data } = await api.get("/grades", {
    params: schoolId ? { schoolId } : {},
  });
  return data;
};

export const getGradeById = async (gradeId, schoolId) => {
  const { data } = await api.get(`/grades/${gradeId}`, {
    params: schoolId ? { schoolId } : {},
  });
  return data;
};

export const createGrades = async (payload, schoolId) => {
  const { data } = await api.post("/grades", payload, {
    params: schoolId ? { schoolId } : {},
  });
  return data;
};

export const updateGrade = async (gradeId, payload, schoolId) => {
  const { data } = await api.patch(`/grades/${gradeId}`, payload, {
    params: schoolId ? { schoolId } : {},
  });
  return data;
};

export const deactivateGrade = async (gradeId, schoolId) => {
  const { data } = await api.patch(
    `/grades/${gradeId}/deactivate`,
    {},
    {
      params: schoolId ? { schoolId } : {},
    }
  );
  return data;
};

export const distributeBottles = async (gradeId, payload, schoolId) => {
  const { data } = await api.post(
    `/grades/${gradeId}/distribute-bottles`,
    payload,
    {
      params: schoolId ? { schoolId } : {},
    }
  );
  return data;
};

export const getSanitizerReport = async (schoolId) => {
  const { data } = await api.get("/grades/sanitizer-check", {
    params: schoolId ? { schoolId } : {},
  });
  return data;
};