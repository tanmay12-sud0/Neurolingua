function remarkedMailTemplate(data) {
  let unverfiedHTML = '<ul style="width:fit-content">';
  if (data.type === "Course") {
    data.unverifiedFields.forEach((field) => {
      Object.entries(field).forEach(([key, value]) => {
        unverfiedHTML += `<li style="text-align:left">${key}: ${value.data}<li/>`;
      });
    });
  } else {
    data.unverifiedFields.forEach((field) => {
      unverfiedHTML += `<li style="text-align:left">${field}<li/>`;
    });
  }
  unverfiedHTML += `</ul>`;
  let type;
  if (data.type === "Course") {
    type = "Course";
  } else {
    type = "Profile";
  }

  return `

    <table cellpadding="0" cellspacing="0" align="center">
      <tr>
        <th style="font-family: sans-serif; padding: 10px 0; background-color: #ebf8ff" width="500px" align="center" cellpading="50%">
          <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1639895026368-image-7.png" style="width: 200px" alt="Logo" />
        </th>
      </tr>
      <tr>
        <td style="display: flex; justify-content: center; padding: 20px 0px; background-color: #ebf8ff">
          <img src="./images/image-6.png" alt="" width="150px" />
        </td>
      </tr>
      <tr>
        <td style="text-align: center; background-color: #ebf8ff">
          <h3 style="margin-top: 1.5em;">Your ${type} has been reviewed.</h3>
          <p style="text-align: left;padding: 0 25px;">Please verify the following fields in your ${type}.</>
          
          ${unverfiedHTML}
        </td>
      </tr>

      <tr width="500px" style="align-items: center">
        <td
          style="
            height: fit-content;
            width: 500px;
            font-family: sans-serif;
            display: flex;
            justify-content: center;
            padding: 20px 0px;
            background-color: #ebf8ff;
          "
        >
          <a href="#" style="padding: 13px 20px; background-color: #44dd80
          ; color: black; text-decoration: none; font-weight: 600; border-radius: 20px;margin:auto">
            Login to Dashboard
          </a>
        </td>
      </tr>

      <!-- Footer  -->
      <tr>
      <td style="border-top: 2px solid black; background-color: #ffe4eb; text-align: center; padding: 1.3em">
        <h4 style="margin: 0em">Follow us on</h4>
        <div style="width:fit-content;margin-left:auto;margin-right:auto; margin-top: 0.7em; margin-bottom: 1em">
          <a href=" https://www.facebook.com/neurolingua.in" target="_blank">
            <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1639928816493-facebook.png" alt="" style="margin: 0 10px; width: 25px" />
          </a>
        
              <a href="https://www.instagram.com/neurolingua.in/" target="_blank">
                <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1639928816494-instagram.png" alt="" style="margin: 0 10px; width: 25px" />
              </a>
              <a href="https://twitter.com/neurolingua_in" target="_blank">
                <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1639928816529-twitter.png" alt="" style="margin: 0 10px; width: 25px" />
              </a>
          <a href=" https://www.linkedin.com/company/neurolingua" target="_blank">
            <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1639928816528-linkedin.png" alt="" style="margin: 0 10px; width: 25px" />
          </a>
          
          <a href="https://www.youtube.com/channel/UC8PcCNMwz5hpk5Ujj2RewaQ" target="_blank">
            <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1639928816545-youtube.png" alt="" style="margin: 0 10px; width: 25px" />
          </a>
          
        </div>
        <a href="www.neuroligua.in" style="text-decoration: none">www.neuroligua.in</a>
      </td>
    </tr>
    </table>
    `;
}

// For Teacher and course verifiaation
function verifiedMailTemplate(data) {
  let type;
  if (data.type === "Course") {
    type = "Course";
  } else {
    type = "Profile";
  }
  return `
    <table cellpadding="0" cellspacing="0" align="center">
      <tr>
        <th style="font-family: sans-serif; padding: 10px 0; background-color: #ebf8ff" width="500px" align="center" cellpading="50%">
          <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1639895026368-image-7.png" style="width: 200px" alt="Logo" />
        </th>
      </tr>
      <tr>
        <td style="display: flex; justify-content: center; padding: 20px 0px; background-color: #ebf8ff">
          <img src="./images/image-6.png" alt="" width="150px" />
        </td>
      </tr>
      <tr>
        <td style="text-align: center; background-color: #ebf8ff">
          <h3 style="margin-top: 1.5em;">Your ${type} has been verified.</h3>
         
        </td>
      </tr>
      <tr width="500px" style="align-items: center">
        <td
          style="
            height: fit-content;
            width: 500px;
            font-family: sans-serif;
            display: flex;
            justify-content: center;
            padding: 20px 0px;
            background-color: #ebf8ff;
          "
        >
          <a href="#" style="padding: 13px 20px; background-color: #44dd80
          ; color: black; text-decoration: none; font-weight: 600; border-radius: 20px;margin:auto">
            Login to Dashboard
          </a>
        </td>
      </tr>
      <!-- Footer  -->
      <tr>
      <td style="border-top: 2px solid black; background-color: #ffe4eb; text-align: center; padding: 1.3em">
        <h4 style="margin: 0em">Follow us on</h4>
        <div style="width:fit-content;margin-left:auto;margin-right:auto; margin-top: 0.7em; margin-bottom: 1em">
          <a href=" https://www.facebook.com/neurolingua.in" target="_blank">
            <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1639928816493-facebook.png" alt="" style="margin: 0 10px; width: 25px" />
          </a>
        
              <a href="https://www.instagram.com/neurolingua.in/" target="_blank">
                <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1639928816494-instagram.png" alt="" style="margin: 0 10px; width: 25px" />
              </a>
              <a href="https://twitter.com/neurolingua_in" target="_blank">
                <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1639928816529-twitter.png" alt="" style="margin: 0 10px; width: 25px" />
              </a>
          <a href=" https://www.linkedin.com/company/neurolingua" target="_blank">
            <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1639928816528-linkedin.png" alt="" style="margin: 0 10px; width: 25px" />
          </a>
          
          <a href="https://www.youtube.com/channel/UC8PcCNMwz5hpk5Ujj2RewaQ" target="_blank">
            <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1639928816545-youtube.png" alt="" style="margin: 0 10px; width: 25px" />
          </a>
          
        </div>
        <a href="www.neuroligua.in" style="text-decoration: none">www.neuroligua.in</a>
      </td>
    </tr>
    </table>
    `;
}

function sendResetPasswordCode(data) {
  return `
    
<head>
   

<style type="text/css">
    body {
        margin: 0;
        padding: 0;
        background-color: #f6f9fc;
    }

    table {
        border-spacing: 0;
    }

    td {
        padding: 0;
    }

    img {
        border: 0;
    }

    .wrapper {
        width: 100%;
        table-layout: fixed;
        background-color: #f6f9fc;
        /* padding: 10px 0 10px 0; */
    }

    .webkit {
        max-width: 600px;
        background-color: #ffffff;
    }

    .outer {
        Margin: 0 auto;
        width: 100%;
        max-width: 600px;
        border-spacing: 0;
        font-family: sans-serif;
        color: #4a4a4a;
    }

   
</style>
</head>

<body>

<center class="wrapper">
    <div class="webkit">
        <table class="outer" align="center">

            <tr>
                <td>
                    <table width="100%" style="border-spacing: 0">
                        <tr>
                            <td
                                style="padding:10px;text-align:center;background-color:#fef1ee;border-radius:0 0 0 70%;padding-bottom: 40px;">
                                <a href="${process.env.CLIENT_URL}" target="_blank">
                                    <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1644509925045-logo.png" width="250" alt="neurolingua_logo" title="Logo">
                                </a>
                                <div style="width: 50%;margin: 0 auto;">
                                    <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1644510160182-Group%2011.png" width="250" alt="neurolingua_logo" title="Logo" style="margin-top: 20px">
                                    <div style="margin-top:15px;font-weight: bold;text-align: left;    font-size: 16px;">
                                        Hey ${data.name},
                                    </div> 
                                    <div style="text-align:justify;text-align-last: center;margin-top:10px;    font-size: 16px;">
                                        That's okay, it happens! Use the code below to reset your password.
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <tr>
                <td class="mob2">
                    <table width="80%" style="border-spacing: 0;margin: 0 auto;margin-top: 20px;">
                        <tr>
                            <td>
                                <div style="text-align:center;">
                                    <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1644510160189-Group%2026.png" width="200" alt="verify_email_img">
                                </div>
                                <div
                                    style="cursor:pointer;font-size:20px;width:40%;text-align:center;color:#ffffff;background-color:#ff6766;border-radius: 15px;padding:10px 20px;margin:0 auto;margin-top: 20px;letter-spacing: 1px;">
                                    Code: <b>${data.token}</b>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>


            <tr>
                <td>
                    <table width="100%" style="border-spacing: 0;margin-top: 20px;">
                        <tr>
                            <td style="padding:20px 0 30px 0;text-align:center;">
                                <div style="width: 250px; margin: 0 auto">
                                  <a href="https://www.facebook.com/neurolingua.in" target="_blank">
                                    <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1644599749335-facebook-grey.png" style="width: 30px" />
                                  </a>
                                  <a href="https://www.instagram.com/neurolingua.in/" target="_blank">
                                    <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1644599749338-instagram-grey.png" style="width: 30px; margin: 0 25px 0 25px" />
                                  </a>
                                  <a href="https://twitter.com/neurolingua_in" target="_blank">
                                    <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1644599749339-twitter-grey.png" style="width: 30px; margin: 0 25px 0 0" />
                                  </a>
                                  <a href="https://www.linkedin.com/company/neurolingua" target="_blank">
                                    <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1644599749340-linkedin-grey.png" style="width: 30px" />
                                  </a>
                                </div>
                                <div style="color: #a2a3a2; margin-top: 10px;">
                                    Copyright 2022 @ Neurolingua All rights reserved.
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

        </table>
    </div>
</center>
</body>

</html>
  `;
}

function verifyEmailLinkTemplate(data) {
  return `
  
<head>
   
<title>Verify Email</title>

<style type="text/css">
    body {
        margin: 0;
        padding: 0;
        background-color: #f6f9fc;
    }

    table {
        border-spacing: 0;
    }

    td {
        padding: 0;
    }

    img {
        border: 0;
    }

    .wrapper {
        width: 100%;
        table-layout: fixed;
        background-color: #f6f9fc;
        /* padding: 10px 0 10px 0; */
    }

    .webkit {
        max-width: 600px;
        background-color: #ffffff;
    }

    .outer {
        Margin: 0 auto;
        width: 100%;
        max-width: 600px;
        border-spacing: 0;
        font-family: sans-serif;
        color: #4a4a4a;
    }

    
</style>
</head>

<body>

<center class="wrapper">
    <div class="webkit">
        <table class="outer" align="center">

            <tr>
                <td>
                    <table width="100%" style="border-spacing: 0">
                        <tr>
                            <td
                                style="padding:10px;text-align:center;background-color:#fef1ee;border-radius:0 0 50% 50%;">
                                <a href="${process.env.CLIENT_URL}" target="_blank">
                                    <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1644509925045-logo.png" width="250" alt="neurolingua_logo" title="Logo">
                                </a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <tr>
                <td class="mob1">
                    <table width="80%" style="border-spacing: 0;margin: 0 auto;margin-top: 20px;">
                        <tr>
                            <td style="background-color:#ff6766;border-radius: 20px;padding:20px;">
                                <div style="color:#ffffff; text-align: center;font-size: 25px;font-weight: bold;">
                                    Verify your email</div>
                                <div style="text-align:center;margin-top:20px">
                                    <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1644510160184-Group%2023.png" width="200" alt="verify_email_img">
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <tr>
                <td class="mob2">
                    <table width="80%" style="border-spacing: 0;margin: 0 auto;margin-top: 40px;">
                        <tr>
                            <td>
                                <div style="font-weight: bold;">
                                    Hey ${data.name},
                                </div>
                                <div style="text-align:justify;text-align-last: center;margin-top:10px">
                                    You're almost ready to start learning with Neurolingua.
                                    Simply click the below button to verify your email
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <a href="${data.link}" target="_blank"
                                    style="cursor:pointer;font-size:20px;
                                    display:block; text-decoration: none;width:40%;text-align:center;color:#ffffff;background-color:#ff6766;border-radius: 15px;padding:10px 20px;margin:0 auto;margin-top: 20px">
                                    Verify your email
                                </a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>


            <tr>
                <td>
                    <table width="100%" style="border-spacing: 0;margin-top: 40px;">
                        <tr>
                            <td
                                style="padding:20px 0 30px 0;text-align:center;background-color:#fef1ee;border-radius:50% 50% 0 0;">
                                <div style="width: 250px; margin: 0 auto">
                                  <a href="https://www.facebook.com/neurolingua.in" target="_blank">
                                    <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1644599749335-facebook-grey.png" style="width: 30px" />
                                  </a>
                                  <a href="https://www.instagram.com/neurolingua.in/" target="_blank">
                                    <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1644599749338-instagram-grey.png" style="width: 30px; margin: 0 25px 0 25px" />
                                  </a>
                                  <a href="https://twitter.com/neurolingua_in" target="_blank">
                                    <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1644599749339-twitter-grey.png" style="width: 30px; margin: 0 25px 0 0" />
                                  </a>
                                  <a href="https://www.linkedin.com/company/neurolingua" target="_blank">
                                    <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1644599749340-linkedin-grey.png" style="width: 30px" />
                                  </a>
                                </div>
                                <div style="color: #a2a3a2; margin-top: 10px;">
                                    Copyright 2022 @ Neurolingua All rights reserved.
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

        </table>
    </div>
</center>
</body>

</html>
  `;
}

function passwordResetSuccess(data) {
  return `
      
<head>
 
<title>Password Reset Successfully</title>

<style type="text/css">
    body {
        margin: 0;
        padding: 0;
        background-color: #f6f9fc;
    }

    table {
        border-spacing: 0;
    }

    td {
        padding: 0;
    }

    img {
        border: 0;
    }

    .wrapper {
        width: 100%;
        table-layout: fixed;
        background-color: #f6f9fc;
        /* padding: 10px 0 10px 0; */
    }

    .webkit {
        max-width: 600px;
        background-color: #ffffff;
    }

    .outer {
        Margin: 0 auto;
        width: 100%;
        max-width: 600px;
        border-spacing: 0;
        font-family: sans-serif;
        color: #4a4a4a;
    }

    /* .mob1,
    .mob2 {
        display: none;
    } */

    /* @media screen and (max-width: 600px) {

        .mob1,
        .mob2 {
            display: block;
        }

        .desk {
            display: none;
        }
    } */
</style>
</head>

<body>

<center class="wrapper">
    <div class="webkit">
        <table class="outer" align="center">

            <tr>
                <td>
                    <table width="100%" style="border-spacing: 0">
                        <tr>
                            <td
                                style="padding:10px;text-align:center;background-color:#fef1ee;border-radius:0 0 0 70%;padding-bottom: 50px;">
                                <a href="${process.env.CLIENT_URL}" target="_blank">
                                    <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1644509925045-logo.png" width="250" alt="neurolingua_logo" title="Logo">
                                </a>
                                <div style="width: 50%;margin: 0 auto;">
                                    <div
                                        style="margin-top:30px;color:#05a910; text-align: center;font-size: 25px;font-weight: bold;">
                                        Password Reset Successfully 🎉
                                    </div>
                                    <div style="margin-top:30px;font-weight: bold;text-align: left;font-size:16px">
                                        Hey ${data.name},
                                    </div>
                                    <div style="text-align:justify;text-align-last: center;margin-top:10px;font-size:16px">
                                        Your password has been reset and changed Successfully to a new one.
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <tr>
                <td class="mob2">
                    <table width="80%" style="border-spacing: 0;margin: 0 auto;margin-top: 20px;">
                        <tr>
                            <td>
                                <div style="text-align:center;">
                                    <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1644510230305-Group%2027.png" width="200" alt="verify_email_img">
                                </div>
                                <a href="${process.env.CLIENT_URL}" target="_blank"                                    style="cursor:pointer;font-size:20px;width:40%;text-align:center;color:#ffffff;background-color:#ff6766;border-radius: 15px;padding:10px 20px;margin:0 auto;margin-top: 20px;display:block;text-decoration:none">
                                    Visit your Dashboard
                                </a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>


            <tr>
                <td>
                    <table width="100%" style="border-spacing: 0;margin-top: 20px;">
                        <tr>
                            <td style="padding:20px 0 30px 0;text-align:center;">
                            <div style="width: 250px; margin: 0 auto">
                            <a href="https://www.facebook.com/neurolingua.in" target="_blank">
                              <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1644599749335-facebook-grey.png" style="width: 30px" />
                            </a>
                            <a href="https://www.instagram.com/neurolingua.in/" target="_blank">
                              <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1644599749338-instagram-grey.png" style="width: 30px; margin: 0 25px 0 25px" />
                            </a>
                            <a href="https://twitter.com/neurolingua_in" target="_blank">
                              <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1644599749339-twitter-grey.png" style="width: 30px; margin: 0 25px 0 0" />
                            </a>
                            <a href="https://www.linkedin.com/company/neurolingua" target="_blank">
                              <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1644599749340-linkedin-grey.png" style="width: 30px" />
                            </a>
                          </div>
                                <div style="color: #a2a3a2; margin-top: 10px;">
                                    Copyright 2022 @ Neurolingua All rights reserved.
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

        </table>
    </div>
</center>
</body>

</html>
  `
}

function emailVerifiedSuccess(data) {
  return `
  
<head>
    
<title>Email Verified</title>

<style type="text/css">
    body {
        margin: 0;
        padding: 0;
        background-color: #f6f9fc;
    }

    table {
        border-spacing: 0;
    }

    td {
        padding: 0;
    }

    img {
        border: 0;
    }

    .wrapper {
        width: 100%;
        table-layout: fixed;
        background-color: #f6f9fc;
        /* padding: 10px 0 10px 0; */
    }

    .webkit {
        max-width: 600px;
        background-color: #ffffff;
    }

    .outer {
        Margin: 0 auto;
        width: 100%;
        max-width: 600px;
        border-spacing: 0;
        font-family: sans-serif;
        color: #4a4a4a;
    }

    
</style>
</head>

<body>

<center class="wrapper">
    <div class="webkit">
        <table class="outer" align="center">

            <tr>
                <td>
                    <table width="100%" style="border-spacing: 0">
                        <tr>
                            <td
                                style="padding:10px;text-align:center;background-color:#fef1ee;border-radius:0 0 50% 50%;">
                                <a href="${process.env.CLIENT_URL}" target="_blank">
                                    <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1644509925045-logo.png" width="250" alt="neurolingua_logo" title="Logo">
                                </a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <tr>
                <td class="mob1">
                    <table width="80%" style="border-spacing: 0;margin: 0 auto;margin-top: 20px;">
                        <tr>
                            <td style="background-color:#fef1ee;border-radius: 20px;padding:20px;">
                                <div style="color:#05a910; text-align: center;font-size: 25px;font-weight: bold;">
                                    Email verified successfully
                                </div>
                                <div style="text-align:center;margin-top:20px">
                                    <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1644510160185-Group%2024.png" width="200" alt="verify_email_img">
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <tr>
                <td class="mob2">
                    <table width="80%" style="border-spacing: 0;margin: 0 auto;margin-top: 40px;">
                        <tr>
                            <td>
                                <div style="font-weight: bold;">
                                    Hey ${data.name},
                                </div>
                                <div style="text-align:justify;text-align-last: center;margin-top:10px">
                                    Woww, Thanks for registering with Neurolingua. Congratulations your Email has been verfied Successfully.
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <a href="${process.env.CLIENT_URL}"
                                    style="cursor:pointer;font-size:20px;width:40%;text-align:center;color:#ffffff;display: block;text-decoration: none;
                                    background-color:#ff6766;border-radius: 15px;padding:10px 20px;margin:0 auto;margin-top: 20px">
                                    Go to you Dashboard
                                </a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

          
            <tr>
                <td>
                    <table width="100%" style="border-spacing: 0;margin-top: 40px;">
                        <tr>
                            <td
                                style="padding:20px 0 30px 0;text-align:center;background-color:#fef1ee;border-radius:50% 50% 0 0;">
                                <div style="width: 250px; margin: 0 auto">
                                  <a href="https://www.facebook.com/neurolingua.in" target="_blank">
                                    <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1644599749335-facebook-grey.png" style="width: 30px" />
                                  </a>
                                  <a href="https://www.instagram.com/neurolingua.in/" target="_blank">
                                    <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1644599749338-instagram-grey.png" style="width: 30px; margin: 0 25px 0 25px" />
                                  </a>
                                  <a href="https://twitter.com/neurolingua_in" target="_blank">
                                    <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1644599749339-twitter-grey.png" style="width: 30px; margin: 0 25px 0 0" />
                                  </a>
                                  <a href="https://www.linkedin.com/company/neurolingua" target="_blank">
                                    <img src="https://profileimagedata.s3.ap-south-1.amazonaws.com/1644599749340-linkedin-grey.png" style="width: 30px" />
                                  </a>
                                </div>
                                <div style="color: #a2a3a2; margin-top: 10px;">
                                    Copyright 2022 @ Neurolingua All rights reserved.
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

        </table>
    </div>
</center>
</body>

</html>
`;
}

module.exports = {
  remarkedMailTemplate,
  verifiedMailTemplate,
  sendResetPasswordCode,
  verifyEmailLinkTemplate,
  passwordResetSuccess,
  emailVerifiedSuccess,
};
