const express = require('express');
let app = express();

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use('/healthz', (req, res) => {res.status(204).send()});

app.use('/callback/github', (req, res) => {
  let allowedBranch = ['develop', 'feedback'];
  let repository = req.body.repository.name
  , commits = req.body.commits
  , ref = req.body.ref;
  const title = '*Backend* ('+repository+'): _['+ref.substring(ref.lastIndexOf('/') + 1)+']_ pushed '+process.env.SUPERVISOR+'\n';
  const message_commited = 'Commited:\n- ' + commits.filter(v => v.author.name == 'hihebark').map(v => v.message).join('\n- ');
  if (allowedBranch.includes(ref.substring(ref.lastIndexOf('/') + 1))) {
    const axios = require('axios');
    axios.post(
      process.env.ME_CHANNEL,
      { text: title+message_commited, type: 'mrkdwn' }
    ).then((response) => {
      if (response.data == 'ok')
        console.log('[!] Message sent...');
      else console.log('[!] Message not sent...');
    }).catch((err) => {
      console.log(err);
    });
  }
  return res.status(200).send({});
});

app.listen(process.env.PORT, () => {
  console.log('[*] App running and listening: '+process.env.PORT+' ...');
});
