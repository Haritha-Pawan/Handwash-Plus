const ROLES = {
    SUPER_ADMIN:'super_admin',
    SCHOOL_ADMIN:'school_admin',
    TEACHER:'teacher',
    STUDENT:'student',
    STAFF:'staff'

};


const PERMISSIONS = {

    //user permissions
    CREATE_USER:'create:user',
    READ_USER:'read:user',
    UPDATE_USER:'update:user',
    DELETE_USER:'delete:user',

};

const ROLE_PERMISSIONS = {

    [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),

}

export default {ROLES, PERMISSIONS, ROLE_PERMISSIONS};
