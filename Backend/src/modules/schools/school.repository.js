import School from './school.model.js';

export const SchoolRepository = {
    create: async (data) => {
        const school = new School(data);
        return school.save();
    },

    findAll: async () => {
        return School.find()
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
    },

    findById: async (id) => {
        return School.findById(id)
            .populate('createdBy', 'name email');
    },

    update: async (id, data) => {
        return School.findByIdAndUpdate(
            id,
            { ...data, updatedAt: new Date() },
            {
                returnDocument: 'after',
                runValidators: true
            }
        ).populate('createdBy', 'name email');
    },

    delete: async (id) => {
        return School.findByIdAndDelete(id);
    },

    findByCity: async (city) => {
        return School.find({ city })
            .populate('createdBy', 'name email')
            .sort({ name: 1 });
    },

    findByDistrict: async (district) => {
        return School.find({ district })
            .populate('createdBy', 'name email')
            .sort({ name: 1 });
    },

    findPaginated: async (skip, limit) => {
        return School.find()
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
    },

    count: async () => {
        return School.countDocuments();
    },

    search: async (query) => {
        return School.find({
            name: { $regex: query, $options: 'i' }
        })
        .populate('createdBy', 'name email')
        .limit(20);
    },

    getDistrictStats: async () => {
        return School.aggregate([
            {
                $group: {
                    _id: '$district',
                    count: { $sum: 1 },
                    schools: { $push: '$name' }
                }
            },
            {
                $project: {
                    district: '$_id',
                    count: 1,
                    schools: 1,
                    _id: 0
                }
            },
            { $sort: { district: 1 } }
        ]);
    }
};