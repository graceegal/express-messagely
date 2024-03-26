"use strict";


async function registerUser(evt) {
  evt.preventDefault();

  const username = $("#username").val();
  const password = $("#password").val();
  const first_name = $("#fname").val();
  const last_name = $("#lname").val();
  const phone = $("#phone").val();

  const response = await fetch('http://localhost:3000/auth/register', {
    method: "POST",
    body: JSON.stringify({ username, password, first_name, last_name, phone }),
    headers: {
      "content-type": "application/json"
    }
  });

  const _token = await response.json();
  console.log("_token", _token);
}


$("#register-form").on("submit", registerUser);