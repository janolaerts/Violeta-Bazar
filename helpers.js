const nodemailer = require('nodemailer');
const keys = require('./keys');

module.exports = {
  mailToClient: (products, clientEmail, total) => {
  
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'mail.google.com',
      auth: {
        user: 'VioletaBazarDeco@gmail.com',
        pass: keys.gmail.pass
      },
      secure: false,
      tls: {
        rejectUnauthorized: false
      }
    });

    let html = `
      <h1 style="color: midnightblue;">Muchas gracias por su compra de Violeta Bazar!</h1>
      <p style="color: midnightblue;">Favor de comentar su dirección a la cual quiere recibir el pedido</p>
      <p style="color: midnightblue;">Resumen de su pedido: </p>
      
      ${products.map(item => {
        return (
          `<div style="background-color: midnightblue;">
            <h3 style="color: white;">${item.quantity}x</h3>
            <img src="${item.img}" style="width: 100px;">
            <h3 style="color: white;">${item.name.replace('-', ' ')}</h3>
          </div>`
        )
      })}

      <h3 style="border: 2px solid midnightblue; color: midnightblue; position: relative; margin-right: 0px;">Precio total: s./${total}</h3>
    `;
  
    let mailOptions = {
      from: 'VioletaBazarDeco@gmail.com',
      to: clientEmail,
      subject: 'Pedido de Violeta Bazar',
      html: html
    };
  
    transporter.sendMail(mailOptions, (err, info) => {
      if(err) {
        console.log(err);
      }
      else {
        console.log(`Email sent: ${info.response}`);
      }
    })
  }
}