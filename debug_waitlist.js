const scriptURL = 'https://script.google.com/macros/s/AKfycbysnXX_-IiZY2xTSmmP-ZDOk1eGCDNV3awrK4zxnJ-zdi9kFWAqr5jIrpApv2udE8B-OA/exec';
const formData = new FormData();
formData.append('action', 'register');
formData.append('email', 'test_debug_script@example.com');
formData.append('firstName', 'Debug User');
formData.append('userType', 'Tech Enthusiast');

console.log(`Checking ${scriptURL}...`);

fetch(scriptURL, {
    method: 'POST',
    body: formData,
    redirect: 'follow'
})
    .then(response => {
        console.log(`Status: ${response.status}`);
        return response.text();
    })
    .then(text => {
        console.log('Response Body Preview:', text.substring(0, 500));
    })
    .catch(err => console.error(err));
