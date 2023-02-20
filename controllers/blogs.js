const Blog = require("../models/blog");
const blogsRouter = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;
  const token = getTokenFrom(request)  
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const user = await User.findById(decodedToken.id);

  if (body.title && body.url) {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      likes: body.likes || 0,
      url: body.url,
      user: user._id,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.json(savedBlog);
  } else {
    response.status(400).json({ error: "Content missing" }).end();
  }
});

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(blogs);
});

blogsRouter.get("/:id", async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (blog) {
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

blogsRouter.delete("/:id", async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: "token missing or invalid" });
  }

  const loggedUser = await User.findById(decodedToken.id);

  if (blog.user.username == loggedUser.username) {
    await Blog.findByIdAndRemove(req.params.id);
  } else {
    res.status(400).json({ error: "You're trying to remove a blog created by another user" }).end();
  }
  res.status(204).end();
});

blogsRouter.put("/:id", async (req, res, next) => {
  const body = req.body;

  const blog = {
    title: body.title,
    author: body.author,
    likes: body.likes,
    url: body.url,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
    ṇew: true,
  });
  res.json(updatedBlog);
});

module.exports = blogsRouter;
