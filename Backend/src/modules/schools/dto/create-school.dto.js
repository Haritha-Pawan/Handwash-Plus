export class CreateSchoolDTO {
    constructor(data) {
        this.name = data.name;
        this.address = data.address;
        this.district = data.district;
        this.city = data.city;
        this.lat = data.lat;
        this.lng = data.lng;
        this.createdBy = data.createdBy;
    }

    validate() {
        const required = ['name', 'address', 'district', 'city', 'lat', 'lng'];
        const missing = required.filter(field => !this[field]);
        
        if (missing.length > 0) {
            throw new Error(`Missing required fields: ${missing.join(', ')}`);
        }
        return true;
    }
}

export default CreateSchoolDTO;