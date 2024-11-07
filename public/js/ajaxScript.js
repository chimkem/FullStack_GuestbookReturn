function getAjaxMessage(event) {
    event.preventDefault(); // Disable the default form behaviour
    var date = Date().toLocaleString()
    // Get information from the form
    const ajaxMessage = {
        username: $('#username').val(),
        country: $('#country').val(),
        message: $('#message').val(),
    };

    // Don't send the form if it doesn't have all the information
    if (!ajaxMessage.username || 
        !ajaxMessage.country || 
        !ajaxMessage.message) {
        return;
    };

    $.ajax({
        url: '/ajaxmessage', 
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(ajaxMessage),
        // Create the div with the given information
        success: function(data) {
            const newMessage = `
              <div>
                <p><strong>Username:</strong> ${data[0].username} // 
                <strong>Country:</strong> ${data[0].country} // 
                <strong>Message:</strong> ${data[0].message} // 
                <strong>Time:</strong> ${date}</p>
              <div>
            `;
            // Add the message to the page and reset the form
            $('#ajaxList').append(newMessage); 
            $('#ajaxForm')[0].reset();
        },
        // In case of error
        error: function(status, error) {
            console.error('Error:', status, error);
        }
    });
}
