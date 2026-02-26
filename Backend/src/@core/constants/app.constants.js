//roles.constants.js
const ROLES = {
    SUPER_ADMIN: 'super_admin',
    SCHOOL_ADMIN: 'school_admin',
    TEACHER: 'teacher',
};

//permissions.constants.js
const PERMISSIONS = {
    SCHOOL: {
        VIEW_OWN: 'school:view_own',
        UPDATE_OWN: 'school:update_own',
    },
    DISPENSER: {
        VIEW_OWN: 'dispenser:view',
        UPDATE_OWN: 'dispenser:update_own',
    },
    INVENTORY: {
        VIEW: 'inventory:view',
        REQUEST: 'inventory:request',
    },
    REPORTS: {
        VIEW: 'reports:view',
        GENERATE: 'reports:generate',
    },
};