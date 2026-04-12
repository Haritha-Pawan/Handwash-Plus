export const ROLES = {
    SUPER_ADMIN: 'superAdmin',
    ADMIN: 'admin',
    TEACHER: 'teacher',
    STUDENT: 'student',
    USER: 'user'
};

export const PERMISSIONS = {
    // user permissions
    CREATE_USER: 'create:user',
    READ_USER: 'read:user',
    UPDATE_USER: 'update:user',
    DELETE_USER: 'delete:user',
};

export const ROLE_PERMISSIONS = {
    [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
};

export default { ROLES, PERMISSIONS, ROLE_PERMISSIONS };
