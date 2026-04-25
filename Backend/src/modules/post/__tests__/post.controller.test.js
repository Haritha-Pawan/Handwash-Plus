/**
 * Unit Tests: Post Controller
 * Tests all post-related endpoints using mocked Post model and ImageKit service.
 */

import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// ─── Mock Post model ──────────────────────────────────────────────────────────

jest.unstable_mockModule('../post.model.js', () => ({
  default: {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    deleteOne: jest.fn(),
  },
}));

// ─── Mock ImageKit Config ─────────────────────────────────────────────────────

jest.unstable_mockModule('../../../config/imagekitConfig.js', () => ({
  default: {
    upload: jest.fn(),
  },
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const samplePost = {
  _id: 'post123',
  title: 'Test Post',
  content: 'Initial content',
  author: 'user123',
  imageUrl: 'http://image.url',
  save: jest.fn(),
  deleteOne: jest.fn(),
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('Post Controller — Unit Tests', () => {
  let createPost, getMyPosts, getAllPosts, updatePost, deletePost;
  let Post, imagekit;

  beforeEach(async () => {
    const postControllerModule = await import('../post.controller.js');
    createPost = postControllerModule.createPost;
    getMyPosts = postControllerModule.getMyPosts;
    getAllPosts = postControllerModule.getAllPosts;
    updatePost = postControllerModule.updatePost;
    deletePost = postControllerModule.deletePost;

    const postModelModule = await import('../post.model.js');
    Post = postModelModule.default;

    const imagekitModule = await import('../../../config/imagekitConfig.js');
    imagekit = imagekitModule.default;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ── createPost ──────────────────────────────────────────────────────────────

  describe('createPost()', () => {
    it('should create a post without image and return 201', async () => {
      Post.create.mockResolvedValue(samplePost);
      const req = {
        body: { title: 'Test Post', content: 'Initial content' },
        user: { id: 'user123' },
      };
      const res = mockRes();

      await createPost(req, res);

      expect(Post.create).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Test Post',
        author: 'user123'
      }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(samplePost);
    });

    it('should create a post with image and return 201', async () => {
      imagekit.upload.mockResolvedValue({ url: 'http://new-image.url' });
      Post.create.mockResolvedValue({ ...samplePost, imageUrl: 'http://new-image.url' });
      
      const req = {
        body: { title: 'Test Post', content: 'Initial content' },
        user: { id: 'user123' },
        file: { buffer: Buffer.from('fake-image') }
      };
      const res = mockRes();

      await createPost(req, res);

      expect(imagekit.upload).toHaveBeenCalled();
      expect(Post.create).toHaveBeenCalledWith(expect.objectContaining({
        imageUrl: 'http://new-image.url'
      }));
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return 401 if user is not authenticated', async () => {
      const req = { body: {}, user: null };
      const res = mockRes();

      await createPost(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should return 500 on database error', async () => {
      Post.create.mockRejectedValue(new Error('DB Fail'));
      const req = { body: { title: 'X' }, user: { id: 'u' } };
      const res = mockRes();

      await createPost(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ── getMyPosts ──────────────────────────────────────────────────────────────

  describe('getMyPosts()', () => {
    it('should return user posts with status 200', async () => {
      const mockFind = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([samplePost])
      };
      Post.find.mockReturnValue(mockFind);

      const req = { user: { id: 'user123' } };
      const res = mockRes();

      await getMyPosts(req, res);

      expect(Post.find).toHaveBeenCalledWith({ author: 'user123' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([samplePost]);
    });
  });

  // ── getAllPosts ─────────────────────────────────────────────────────────────

  describe('getAllPosts()', () => {
    it('should return all posts', async () => {
      const mockFind = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([samplePost])
      };
      Post.find.mockReturnValue(mockFind);

      const req = {};
      const res = mockRes();

      await getAllPosts(req, res);

      expect(res.json).toHaveBeenCalledWith([samplePost]);
    });
  });

  // ── updatePost ──────────────────────────────────────────────────────────────

  describe('updatePost()', () => {
    it('should update post content successfully', async () => {
      const mockPost = { ...samplePost, author: 'user123' };
      Post.findById.mockResolvedValue(mockPost);
      
      const req = {
        params: { id: 'post123' },
        user: { id: 'user123' },
        body: { content: 'Updated content' }
      };
      const res = mockRes();

      await updatePost(req, res);

      expect(mockPost.content).toBe('Updated content');
      expect(mockPost.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    it('should return 403 if user is not the author', async () => {
      const mockPost = { ...samplePost, author: 'otherUser' };
      Post.findById.mockResolvedValue(mockPost);
      
      const req = {
        params: { id: 'post123' },
        user: { id: 'user123' },
        body: { title: 'Stealing Post' }
      };
      const res = mockRes();

      await updatePost(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should return 404 if post not found', async () => {
      Post.findById.mockResolvedValue(null);
      const req = { params: { id: 'none' }, body: {} };
      const res = mockRes();

      await updatePost(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  // ── deletePost ──────────────────────────────────────────────────────────────

  describe('deletePost()', () => {
    it('should delete post successfully', async () => {
      const mockPost = { ...samplePost, author: 'user123' };
      Post.findById.mockResolvedValue(mockPost);
      
      const req = { params: { id: 'post123' }, user: { id: 'user123' } };
      const res = mockRes();

      await deletePost(req, res);

      expect(mockPost.deleteOne).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: "Post deleted successfully" });
    });

    it('should return 403 if unauthorized', async () => {
      const mockPost = { ...samplePost, author: 'admin' };
      Post.findById.mockResolvedValue(mockPost);
      
      const req = { params: { id: 'post123' }, user: { id: 'user123' } };
      const res = mockRes();

      await deletePost(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
});
