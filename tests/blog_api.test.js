const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const config = require('../utils/config')
const helper = require('./test_helper')
const initialBlogs = helper.initialBlogs

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(initialBlogs.length);
});

test("a specific note is within the returned noted", async () => {
  const response = await api.get("/api/blogs");

  const contents = response.body.map((res) => res.title);
  expect(contents).toContain("Browser can execute only Javascript");
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "ACDC",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201) 
    .expect("Content-Type", /application\/json/);

  const res = await helper.blogsInDb()

  expect(res).toHaveLength(initialBlogs.length + 1);
  
  const contents = res.map((r) => r.title);
  expect(contents).toContain("ACDC");
});

test('blank blog is not allowed', async () => {
  const newBlog = {
    
  }

  await api
  .post("/api/blogs")
  .send(newBlog)
  .expect(500)

  const res = await helper.blogsInDb()
  expect(res).toHaveLength(initialBlogs.length)
})


test('first blog can be viewed', async () => {
  const blogsAtStart = helper.blogsInDb()
  const blogToView = blogsAtStart[0]

  const blogObtained = await api
  .get(`/api/blogs/${blogToView.id}`)
  .expect(200)
  .expect('Content-Type', /application\/json/)

  const processedBlog = JSON.parse(JSON.stringify(blogToView))

  expect(blogObtained.body).toEqual(processedBlog)
})

afterAll(() => {
  mongoose.connection.close();
});
