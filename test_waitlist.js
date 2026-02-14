const scriptURL = 'https://script.google.com/macros/s/AKfycbxD6i2C4mofH4EQIC4fIXW8da7oPPgh8ToQUSS8P4_eh6sAmsqsRX8uTIArUDPowHoP/exec';
const formData = new FormData();
formData.append('email', 'test_verification@example.com');

console.log(`Sending POST request to ${scriptURL}...`);

fetch(scriptURL, {
    method: 'POST',
    body: formData,
})
    .then(response => {
        console.log(`Response Status: ${response.status}`);
        console.log(`Response Type: ${response.type}`);
        console.log(`Redirected: ${response.redirected}`);
        return response.text();
    })
    .then(text => {
        console.log('Response Body Preview:', text.substring(0, 500));
    })
    .catch(error => {
        console.error('Error:', error);
    });
