import User from './user.model.js';

export class UserRepository {
  async create(userData) {
    const user = new User(userData);
    return user.save();
  }

  async findByEmail(email, includePassword = false) {
    let query = User.findOne({ email });

    if (includePassword) {
      query = query.select('+password +refreshToken');
    }

    return query.exec();
  }

  async findById(id, includePassword = false) {
    let query = User.findById(id);

    if (includePassword) {
      query = query.select('+password +refreshToken');
    }

    return query.exec();
  }

  async update(id, updateData) {
    return User.findByIdAndUpdate(
      id,
      updateData,
      { returnDocument: 'after', runValidators: true }
    ).exec();
  }

  async updateRefreshToken(userId, refreshToken) {
    return User.findByIdAndUpdate(
      userId,
      { refreshToken },
      { returnDocument: 'after' }
    ).select('+refreshToken').exec();
  }

  async findBySchool(schoolId, role = null) {
    const query = { schoolId };
    if (role) query.role = role;

    return User.find(query).exec();
  }

  async blockUser(userId) {
    return User.findByIdAndUpdate(
      userId,
      { isBlocked: true },
      { returnDocument: 'after' }
    ).exec();
  }

  async unblockUser(userId) {
    return User.findByIdAndUpdate(
      userId,
      { isBlocked: false },
      { returnDocument: 'after' }
    ).exec();
  }
}