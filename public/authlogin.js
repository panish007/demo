const login = () => {
    $('#myForm').on('submit', (e) => {
        e.preventDefault();
        let email = $('#email').val();
        let password = $('#password').val();

      
        $('#loginbtn').prop('disabled', true);

        $.ajax({
            url: '/login',
            method: 'POST',
            dataType: 'json',
            data: {
                email, password
            },
            success: function (response) {
               
                if (response.flag === 1) {
                    toastr.success(response.msg);
                    $('#loginbtn').prop('disabled', false);
                    setTimeout(function () {
                        window.location.href = '/dashboard';
                    }, 1000);
                } else if (response.flag === 0) {
                    toastr.error(response.msg);
                    $('#loginbtn').prop('disabled', false);

                }
            },
        });
    });
}

$(document).ready(function () {
    login();
});
