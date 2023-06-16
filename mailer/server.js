const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer')
const methodOverride = require('method-override')
// nodemon ./server.js localhost 3000
const Content = require('./models/emailContent')
const Email = require('./models/emails')


const app = express();

app.set('view engine', 'ejs');

const PORT = 3000;
const db = 'mongodb+srv://oleksii_ivanichok:user1234@mailer.s2u5thu.mongodb.net/mailer1?retryWrites=true&w=majority'


mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((res) => console.log('Connected to DB'))
    .catch((e) => console.log(e));

const createPath = (page) => path.resolve(__dirname, 'ejs-views', `${page}.ejs`);

app.listen(PORT, (error) => {
  error ? console.log(error) : console.log(`listening port ${PORT}`);
});

app.use(express.urlencoded({ extended: false}))

app.use(express.static('styles'));

app.use(methodOverride('_method'))

app.get('/manageEmails/:id', (req, res) => {
    Email
        .findById(req.params.id)
        .then(emails => res.render(createPath('manageEmails'), { emails }))
        .catch((error) => {
            console.log(error);
        });
});

app.delete('/manageEmails/:id', (req, res) => {
    Email
        .findByIdAndDelete(req.params.id)
        .then((result) => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log(error);
        })
});

app.get('/editEmail/:id', (req, res) => {
    Email
        .findById(req.params.id)
        .then(emails => res.render(createPath('editEmail'), { emails }))
        .catch((error) => {
            console.log(error);
        });
});

app.put('/editEmail/:id', (req, res) => {
    const { name, lastName, surname, email } = req.body;
    const { id } = req.params;
    Email
        .findByIdAndUpdate(id, {name, lastName, surname, email})
        .then(result => res.redirect('/manageEmails'))
        .catch((error) => {
            console.log(error);
        });
});

app.get('/manageEmails', (req, res) => {
    Email
        .find()
        .sort({email: 1})
        .then((emails) => res.render(createPath('manageEmails'), { emails }))
        .catch((error) => {
            console.log(error);
        })
});

app.post('/manageEmails', (req, res) => {
    const { id, name, lastName, surname, email } = req.body;
  const emails = new Email({id, name, lastName, surname, email});
  emails
      .save()
      .then((result) => res.redirect('/manageEmails'))
      .catch((error) => {
    console.log(error);
  })
});

app.post('/sendEmails', async (req, res) => {
    const {id, subject, text} = req.body;
    const emailContent = new Content({id, subject, text});

    const emails = await Email.find()

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'supersij500@gmail.com',
            pass: 'xalodbehofgkwoxl'
        }
    })


    if (emails.length) {
        emails.forEach(({email}) => {
            let mailOptions = {
                from: 'supersij500@gmail.com',
                to: email,
                subject: emailContent.subject,
                text: emailContent.text,
            }
            transporter.sendMail(mailOptions)
        })
    }
    res.render(createPath('sendEmails'))

});

app.get('/sendEmails', (req, res) => {
    Email
        .find()
        .then((emails) => res.render(createPath('sendEmails'), { emails }))
});

app.get('/', (req, res) => {
  res.redirect('/manageEmails');
});