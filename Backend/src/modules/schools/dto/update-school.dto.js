export class UpdateSchoolDTO {
    constructor(data) {
        const updateableFields = ['name', 'address', 'district', 'city', 'lat', 'lng'];
        
        for (const field of updateableFields) {
            if (data[field] !== undefined && data[field] !== null) {
                this[field] = data[field];
            }
        }
    }

    hasUpdates() {
        return Object.keys(this).length > 0;
    }

    getUpdateData() {
        return {
            ...this,
            updatedAt: new Date()
        };
    }
}

export default UpdateSchoolDTO;