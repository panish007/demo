const post = () => {

    $('#editPost').on('submit', (e) => {
        e.preventDefault();
        let id = $('#postId').val();
        let name = $('#name').val();
        let mobileNo = $('#mobileNo').val();

        $.ajax({
            url: '/dashboard/edits',
            method: 'POST',
            data: {
                id: id,
                name: name,
                mobileNo: mobileNo
            },
            success: function (response) {
                alert("successfully updated")
                window.location.href = "/dashboard";
            },
            error: function (xhr, status, error) {
                // Handle the error and display it in a <pre> tag
                console.error("Error:", error);

                try {
                    const jsonError = JSON.parse(xhr.responseText);
                    $('#error-message').text(JSON.stringify(jsonError.msg, null, 2));
                } catch (e) {
                    // If parsing fails, display the original error message
                    $('#error-message').text(JSON.stringify({ error: error }, null, 2));
                }
            }
        });
    });
}

$(document).ready(function () {
    post();

});