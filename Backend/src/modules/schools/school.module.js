import schoolRoutes from './school.routes.js';

export const registerSchoolModule = (app) => {
    app.use('/api/schools', schoolRoutes);
    console.log(' School module registered');
};

export default registerSchoolModule;