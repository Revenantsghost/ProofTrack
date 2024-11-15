fetch('http://localhost:3000/register', {
   method: 'POST',
   headers: {
       'Content-Type': 'application/json' // Ensure the server knows it's a JSON payload
   },
   body: JSON.stringify({user_name: "ynot", password: "password" }) // Send user_name in the request body
})
.then(response => {
   if (!response.ok) {
       throw new Error('User not found or server error');
   } else {
        console.log("OK")
   }
})
.catch(error => {
   console.error('Error fetching profile:', error);
});



fetch('http://localhost:3000/changePassword', {
   method: 'PUT',
   headers: {
       'Content-Type': 'application/json' // Ensure the server knows it's a JSON payload
   },
   body: JSON.stringify({user_name: "ynot", new_password: "pass", old_password: "password" }) 
   // Send in the request body
})
.then(response => {
    console.log('HTTP Status Code:', response.status); // Status code (200, 404, etc.)
   if (response.ok) {
       console.log('Profile updated successfully');
       return;
   } else {
       console.error('Failed to change password:', response.statusText);
       throw new Error(`HTTP Error: ${response.status}`); // Include status for debugging
   }
})
.catch(error => {
   console.error('Error fetching profile:', error.message);
});

const my_name = "T";

fetch(`http://localhost:3000/fetchProjects?user_name=${my_name}`, {
   method: 'GET',
   headers: {
       'Content-Type': 'application/json' // Ensure the server knows it's a JSON payload
   },
})
.then(response => {
   if (response.ok) {
     response.json().then(data => {
    // Since it is an array; if it is not an array then just do data.proj_id
       for (const j of data) {
         console.log(j.proj_id)
         console.log(j.proj_name)
       }
     }).catch(error => {
         console.log(response)
         console.error('Error parsing JSON:', error);
     });
   } else {
     console.log(response)
       throw new Error('User not found or server error');
   }
})
.catch(error => {
   console.error('Error fetching profile:', error);
});

// Used to reset datatable- do not use
fetch(`http://localhost:3000/hardDELETEUSER`, {
   method: 'DELETE',
   headers: {
       'Content-Type': 'application/json' // Ensure the server knows it's a JSON payload
   },
   body: JSON.stringify({user_name: "ynot" }) 
})
.then(response => {
   if (response.ok) {
        console.log("User deleted successfully")
   } else {
     console.log(response)
       throw new Error('User not found or server error');
   }
})
.catch(error => {
   console.error('Error fetching profile:', error);
});

