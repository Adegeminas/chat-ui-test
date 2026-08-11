const DELAY = 350;

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

module.exports = async (req, res, next) => {
  console.log('new request');

  await sleep(DELAY);

  if (req.method === 'POST' && req.path === '/login') {
    if (req.body?.login === 'username' && req.body?.password === 'password') {
      return res.status(200).json({ token: 'valid-token' });
    }

    return res.status(401).json({ message: 'Неверный логин или пароль' });
  }

  next();
};
