$(document).ready(function () {

    async function sendmes(mes) {
        try {
            const response = await $.ajax({
                type: "POST",
                url: "http://192.168.1.108:9999/",
                data: {
                    action: "ask",
                    question: mes,
                }
            });
            return response["reply"];
        } catch (error) {
            console.error(error);
            return "Oops! There was an error";
        }
    }

    function signloginajax(obj) {
        $.ajax({
            type: "POST",
            url: "http://192.168.1.108:9999/",
            data: obj,
            success: function (response) {
                console.log(response);
            }, error: function (error) {
                console.log("oppos have someing error");
            }
        });
    }

    $("#test").click(function (e) {
        $(".sign-loging .box .sign").css("transform", "rotateY(180deg)");
        $(".sign-loging .box .login").css("transform", "rotateY(0deg)");
    });

    $("#user_input").keydown(function (e) {
        if (e.key == "enter" || e.keyCode == 13) {
            $("#send").trigger("click");
        }
    });

    $("#send").click(async function (e) {
        let usermes = $("#user_input").val();
        if (usermes.length > 0 && $(".user_mes").length === $(".llama3_rep").length) {
            if ($(".chat_log").hasClass("nothing_log")) {
                $(".chat_log").removeClass("nothing_log");
            }
            $("#user_input").val("");
            let user = `<div class="user_mes"><p>${usermes}</p></div>`;
            $(".chat_log").append(user);
            $(".chat .chat_log").scrollTop($(".chat .chat_log")[0].scrollHeight);
            // let result = await sendmes(usermes);
            let llama3 = `<div class="llama3_rep"><p>Server is down</p></div>`;
            setTimeout(() => {
                $(".chat_log").append(llama3);
                $(".chat .chat_log").scrollTop($(".chat .chat_log")[0].scrollHeight);
            }, 800);
        }
    });

    $(".sign-loging").click(function (e) {
        if (e.target === this) {
            $(".sign-loging .box").animate({
                opacity: "0",
            }, 1500, function () {
                $(".sign-loging").css("display", "none");
            });
        }
    });

    $("#loginssign").click(function (e) {
        $(".sign-loging .box .sign").css("transform", "rotateY(0deg)");
        $(".sign-loging .box .login").css("transform", "rotateY(180deg)");
    });

    $("#signslogin").click(function (e) {
        $(".sign-loging .box .sign").css("transform", "rotateY(-180deg)");
        $(".sign-loging .box .login").css("transform", "rotateY(0deg)");
    });

    $(".sign-loging .box>div .input input").focusout(function () {
        $(this).css("border", "2.5px solid #dbdbdb");
    });

    $("#loginslogin-btn").click(function (e) {
        let account = $("#loginsacc-input").val();
        let pw = $("#loginspw-input").val();
        if (account.length > 0 && pw.length > 8) {
            let obj = {
                action: "login",
                account: account,
                password: pw,
            }
            signloginajax(obj)
        } else {
            account.length === 0 && $("#loginsacc-input").css("border", "2.5px solid #db4a4a");
            pw.length < 8 && $("#loginspw-input").css("border", "2.5px solid #db4a4a");
        }
    });

    $("#signslogin-btn").click(function (e) {
        $(".sign-loging .box>div .input input").css("border", "2.5px solid #dbdbdb");
        let account = $("#signsacc-input").val();
        let pw = $("#signspw-input").val();
        let cpw = $("#signscpw-input").val();
        if (account.length > 0 && pw.length > 8 && cpw.length > 0 && pw == cpw) {
            let obj = {
                action: "sign",
                account: account,
                password: pw,
            }
            signloginajax(obj)
        } else {
            account.length === 0 && $("#signsacc-input").css("border", "2.5px solid #db4a4a");
            pw.length < 8 && $("#signspw-input").css("border", "2.5px solid #db4a4a");
            (cpw.length === 0 || pw !== cpw) && $("#signscpw-input").css("border", "2.5px solid #db4a4a");
        }
    });

    $("#loging").click(function (e) {
        $(".sign-loging").css("display", "flex");
        $(".sign-loging .box").animate({
            opacity: "1",
        }, 1500);
    });
});