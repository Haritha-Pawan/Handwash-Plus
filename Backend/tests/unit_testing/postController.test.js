// src/tests/unit/postController.test.js

import { createPost } from '../../modules/post/post.controller';

describe('Post Controller', () => {

  test('should return 400 if title is missing', async () => {

    const req = {
      body: {
        title: "",
        content: "Test content"
      },
      user: { id: "123" }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await createPost(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

});