export class SchoolResponseDTO {
    constructor(school) {
        this.id = school._id || school.id;
        this.name = school.name;
        this.address = school.address;
        this.district = school.district;
        this.city = school.city;
        this.location = {
            lat: school.lat,
            lng: school.lng
        };
        this.createdBy = school.createdBy ? {
            id: school.createdBy._id || school.createdBy,
            name: school.createdBy.name
        } : null;
        this.createdAt = school.createdAt;
        this.updatedAt = school.updatedAt;
    }

    static fromArray(schools) {
        if (!Array.isArray(schools)) return [];
        return schools.map(school => new SchoolResponseDTO(school));
    }
}

export default SchoolResponseDTO;