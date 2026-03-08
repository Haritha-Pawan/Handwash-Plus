import School from './school.model.js';

export const SchoolRepository = {
    create: async (data) => {
        const school = new School(data);
        return school.save();
    },

    findAll: async () => {
        return School.find().populate('createdBy', 'name email');
    },

    findById: async (id) => {
        return School.findById(id).populate('createdBy', 'name email');
    },

    update: async (id, data) => {
        return School.findByIdAndUpdate(
            id, 
            { ...data, updatedAt: new Date() }, 
            { new: true, runValidators: true }
        );
    },

    delete: async (id) => {
        return School.findByIdAndDelete(id);
    },

    findByCity: async (city) => {
        return School.find({ city }).populate('createdBy', 'name email');
    },

    findByDistrict: async (district) => {
        return School.find({ district }).populate('createdBy', 'name email');
    }
};