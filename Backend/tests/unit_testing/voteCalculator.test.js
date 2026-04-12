// tests/voteCalculator.test.js
// tests/unit/postController.test.js

const { createPost } = require('../../controllers/postController');

describe('Post Controller', () => {
  test('should create post (basic test)', async () => {
    const req = {
      body: {
        title: "Test",
        content: "Hello"
      },
      user: { id: "123" }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await createPost(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });
});