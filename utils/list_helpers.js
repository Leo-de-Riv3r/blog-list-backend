function removeDuplicates(arr) {
  return [...new Set(arr)]
}


const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const initialValue = 0;
  return blogs.reduce(
    (accumulator, currentValue) => accumulator + currentValue.likes,
    initialValue
  );
};

const favoriteBlog = (blogs) => {
  let iMax = 0;

  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > blogs[iMax].likes) iMax = i;
  }

  return {
    title: blogs[iMax].title,
    author: blogs[iMax].author,
    likes: blogs[iMax].likes,
  };
};

const mostLikes = (blogs) => {
  let bloggerNames = []
  bloggerNames = blogs.map(blog => blog.author)
  bloggerNames = removeDuplicates(bloggerNames)
  let likes = []
  for (let index = 0; index < bloggerNames.length; index++) {
    likes.push(0)
  }

  for (let index = 0; index < blogs.length; index++) {
    let authorIndex =bloggerNames.findIndex(name => name === blogs[index].author)
    likes[authorIndex]+= blogs[index].likes
  }

  //record the likes arr
  const mostLikes = likes.findIndex(item => item === Math.max(...likes))

  return {
    author: bloggerNames[mostLikes],
    likes: likes[mostLikes]
  }
};

const mostBlogs = (blogs) => {
  let bloggerNames = []
  bloggerNames = blogs.map(blog => blog.author)
  bloggerNames = removeDuplicates(bloggerNames)
  let blogsNumber = []
  for (let index = 0; index < bloggerNames.length; index++) {
    blogsNumber.push(0)
  }

  for (let index = 0; index < blogs.length; index++) {
    let authorIndex =bloggerNames.findIndex(name => name === blogs[index].author)
    blogsNumber[authorIndex]++
  }

  //record the likes arr
  const maxBlogs = blogsNumber.findIndex(item => item === Math.max(...blogsNumber))

  return {
    author: bloggerNames[maxBlogs],
    blogs: blogsNumber[maxBlogs]
  }
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostLikes,
  mostBlogs
};
