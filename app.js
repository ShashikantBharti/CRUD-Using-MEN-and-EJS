const cookieParser = require('cookie-parser');
const express = require('express');
const userModel = require('./models/user');
const postModel = require('./models/post');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Custom Middlewares
const isLoggedIn = (req, res, next) => {
  if (!req.cookies.token) {
    return res.status(400).render('restricted');
  }
  const decodedToken = jwt.verify(
    req.cookies.token,
    'ThisIsSecretKeyToProvideAccessToken'
  );
  req.user = decodedToken;
  next();
};

// Home Routes

app.get('/', async (req, res) => {
  const posts = await postModel.find().populate('user');
  res.render('index', { posts });
});

// User Routes
app.get('/user/profile', isLoggedIn, async (req, res) => {
  const posts = await postModel.find({ user: req.user.id }).populate('user');
  res.render('profile', { posts });
});

app.get('/user/register', (req, res) => {
  res.render('register');
});

app.post('/user/register', async (req, res) => {
  // Get data
  const { username, email, password, name, age } = req.body;

  // Check if data is not empty
  if (
    [username, email, password, name, age].some((field) =>
      typeof field === 'string' ? field.trim() === '' : !field
    )
  )
    return res.status(400).send({ message: 'All fields are requried!' });

  // Check if user already exists or not
  const user = await userModel.findOne({ email });
  if (user) return res.status(409).send({ message: 'User already exists' });

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);

  // If not, create a new user and save it to the database
  const newUser = await userModel.create({
    username,
    email,
    password: hashedPassword,
    name,
    age,
  });

  // Return a success message
  res.status(201).send({ message: 'User created successfully', user: newUser });
});

app.get('/user/login', (req, res) => {
  res.render('login');
});

app.post('/user/login', async (req, res) => {
  // get credentials
  const { username, email, password } = req.body;

  // check if data is provided
  if (!username && !email)
    return res.status(400).send({ message: 'Please provide login details!' });

  // check if user is registered or not
  const user = await userModel.findOne({ $or: [{ email }, { username }] });

  if (!user) return res.status(404).send({ message: 'User does not exists' });

  // match password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid)
    return res.status(400).send({ message: 'Username or password is wrong!' });

  // set token
  const token = jwt.sign(
    { username: username || email, id: user._id },
    'ThisIsSecretKeyToProvideAccessToken'
  );
  res.cookie('token', token);
  // send response
  res.status(200).redirect('/user/profile');
});

app.post('/user/logout', isLoggedIn, (req, res) => {
  res.clearCookie('token', '');
  res.redirect('/user/login');
});

// Post Routes
app.post('/user/post', isLoggedIn, async (req, res) => {
  // Get Post Data
  const { postdata } = req.body;
  // Save in database
  const createdPost = await postModel.create({
    content: postdata,
    user: req.user.id,
  });
  const user = await userModel.findOne({ _id: req.user.id });
  user.posts.push(createdPost._id);
  user.save();
  if (!createdPost) {
    return res.status(500).send({ message: 'Something went wrong!' });
  }
  // return response
  console.log('Post Created');
  res.status(201).redirect('/user/profile');
});

app.get('/post/like/:id', isLoggedIn, async (req, res) => {
  // Get id of post
  const postId = req.params.id;
  const userId = req.user.id;
  // Fetch post data from db
  const post = await postModel.findOne({ _id: postId });
  // Check if liked then unline or like
  if (post.likes.includes(userId)) {
    // Unline
    post.likes.splice(post.likes.indexOf(userId), 1);
  } else {
    // Like
    post.likes.push(userId);
  }
  // save
  post.save();
  // send response
  res.redirect('/user/profile');
});

app.get('/post/edit/:id', isLoggedIn, async (req, res) => {
  // Get id
  const id = req.params.id;
  // fetch post data
  const post = await postModel.findOne({ _id: id }).populate('user');
  if (!post) {
    return res.status(404).send({ message: 'Post not found!' });
  }
  // render edit view
  res.render('edit', { post });
});

app.post('/post/update/:id', isLoggedIn, async (req, res) => {
  const { postdata } = req.body;
  const post = await postModel.findOne({ _id: req.params.id });
  post.content = postdata;
  post.save();
  res.redirect('/user/profile');
});

// Universal Routes
app.use((req, res, next) => {
  res.status(404).render('404');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
