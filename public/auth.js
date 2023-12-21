const register = () => {
    $('#registerForm').on('submit', (e) => {
        e.preventDefault();
        let name = $('#name').val();
        let email = $('#email').val();
        let mobileNo = $('#mobileNo').val();
        let password = $('#password').val();
        let confirmPassword = $('#confirmPassword').val();

        $('#registerbtn').prop('disabled', true);
        $.ajax({
            url: '/register',
            method: 'POST',
            data: {
                name, email, password, mobileNo, confirmPassword
            },
            success: function (response) {
                
                if(response.flag === 1){
                    $('#registerbtn').prop('disabled', false);
                    toastr.success(response.msg);
                    setTimeout(function () {
                        window.location.href = '/dashboard';
                    }, 1000);
                }else if(response.flag === 0){
                    $('#registerbtn').prop('disabled', false);
                    toastr.error(response.msg);
                }
            },

        });

    });
}


$(document).ready(function () {
    register();

});