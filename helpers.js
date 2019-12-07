const nodemailer = require('nodemailer');
const keys = require('./keys');

module.exports = {
  mailToClient: (products, clientEmail, total, orderId) => {
  
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

    let html = 
      `<h1 style="color: midnightblue;">Muchas gracias por su compra de Violeta Bazar!</h1>
      <p style="color: midnightblue;">Favor de comentar su dirección a la cual quiere recibir el pedido</p>
      <p style="color: midnightblue; text-decoration: underline;">Resumen de su pedido con Número <strong>${orderId}</strong> </p>
      
      ${products.map(item => {
        return (
          `<div style="background-color: midnightblue; width: 300px;">
            <h3 style="color: white; position: relative; margin-left: 0px;">${item.quantity}x ${item.name}</h3>
          </div>`
        )
      })}

      <h3 style="border: 2px solid midnightblue; color: midnightblue; width: 300px;">Precio total: s./${total}</h3>`;

    let mailOptions = {
      from: 'VioletaBazarDeco@gmail.com',
      to: clientEmail,
      subject: `Su pedido de Violeta Bazar con número ${orderId}`,
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
  },
  mailToCompany: (products, clientEmail, total, orderId) => {

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

    let html = 
    `<h1 style="color: midnightblue;">Hay un nuevo pedido de ${clientEmail}</h1>
    <p style="color: midnightblue; text-decoration: underline;">Resumen del pedido con Número <strong>${orderId}</strong></p>
    
    ${products.map(item => {
      return (
        `<div style="background-color: midnightblue; width: 300px;">
          <h3 style="color: white; position: relative; margin-left: 0px;">${item.quantity}x ${item.name}</h3>
        </div>`
      )
    })}

    <h3 style="border: 2px solid midnightblue; color: midnightblue; width: 300px;">Precio total: s./${total}</h3>`;

    let mailOptions = {
      from: `${clientEmail}`,
      to: 'VioletaBazarDeco@gmail.com',
      subject: `Hay un nuevo pedido con número ${orderId}`,
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