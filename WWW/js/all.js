$(document).ready(function () {

    // 前端動畫

    $(".cancel").click(function (e) {
        $(".sign-loging .box").animate({
            opacity: "0",
        }, 800, function () {
            $(".sign-loging").css("display", "none");
            $("#loginsacc-input").val("");
            $("#loginspw-input").val("");
            $("#signsacc-input").val("");
            $("#signspw-input").val("");
            $("#signscpw-input").val("");
            $(".sign-loging .box .sign").css("transform", "rotateY(-180deg)");
            $(".sign-loging .box .login").css("transform", "rotateY(0deg)");
        });
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

    $("#loging").click(function (e) {
        $(".sign-loging").css("display", "flex");
        $(".sign-loging .box").animate({
            opacity: "1",
        }, 800);
    });

    $(".chat .model_list li").click(function (e) { 
        $(".chat .model_list li").removeClass("check");
        $(this).addClass("check");
        $(".chat .change_model li").text($(".chat .model_list li.check").text());
    });

    $(".chat .change_model").click(function (e) { 
        if ($(".chat .model_list").hasClass("show")){
            $(".chat .model_list").removeClass("show");
            $(".chat .change_model i").css("transform", "rotate(0deg)");
        }else{
            $(".chat .model_list").addClass("show");
            $(".chat .change_model i").css("transform", "rotate(-180deg)");
        }
    });

    // -------------------------------------------------------------------------------------------------\\

    // 後端交互
    // model: ["phi3:14b-medium-4k-instruct-q4_K_M", "Llama3", "TAIDE"]

    async function sendmes(mes) {
        try {
            let model = $(".chat .model_list li.check").attr("data-modelName");
            const response = await $.ajax({
                type: "POST",
                url: "http://192.168.107.101:9999/",
                data: {
                    action: "ask",
                    question: mes,
                    model: model,
                }
            });
            return response["reply"];
        } catch (error) {
            console.error(error);
            return "Oops! There was an error";
        }
    }

    function formate_text(text) {
        let str = text.replace(/\\n/g, '\n');
        let arr = str.split("\n")
        let html = ``
        arr.forEach(element => {
            html += `<p>${element}</p>`
        });
        console.log(html);
        return html
    }

    function login(obj) {
        $.ajax({
            type: "POST",
            url: "http://192.168.1.108:9999/",
            data: obj,
            success: function (response) {
                if (response["success"]) {
                    Swal.fire({
                        title: "Success",
                        text: response["mes"],
                        icon: "success"
                    });
                    $(".cancel").trigger("click");
                    $(".wait").removeClass("no-show");
                    $(".login-no").addClass("no-show");
                    setTimeout(function () {
                        $(".wait").addClass("no-show");
                        $(".login-yes").removeClass("no-show");
                    }, 5000)
                } else {
                    if (response["detail"]) {
                        if (response["detail"] == "pwerr") {
                            Swal.fire({
                                title: "error",
                                text: "密碼錯誤請在試一次!",
                                icon: "error"
                            });
                        }
                    } else {
                        Swal.fire({
                            title: "error",
                            text: response["mes"],
                            icon: "error"
                        });
                    }
                    $(".cancel").trigger("click");
                }
            }, error: function (error) {
                console.log("oppos have someing error!");
                console.log(`deatil: ${error}`);
            }
        });
    }

    function sign(obj) {
        $.ajax({
            type: "POST",
            url: "http://192.168.1.108:9999/",
            data: obj,
            success: function (response) {
                if (response["success"]) {
                    Swal.fire({
                        title: "Success",
                        text: response["mes"],
                        icon: "success"
                    });
                    $("#signslogin").trigger("click");
                } else {
                    Swal.fire({
                        title: "error",
                        text: response["mes"],
                        icon: "error"
                    });
                    $(".cancel").trigger("click");
                }
            }
        });
    }

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
            let result = await sendmes(usermes);
            let formate_result = formate_text(result);
            let llama3 = `<div class="llama3_rep"><p>${formate_result}</p></div>`;
            $(".chat_log").append(llama3);
            $(".chat .chat_log").scrollTop($(".chat .chat_log")[0].scrollHeight);
        }
    });

    // 登入
    $("#loginslogin-btn").click(function (e) {
        let account = $("#loginsacc-input").val();
        let pw = $("#loginspw-input").val();
        if (account.length > 0 && pw.length >= 8) {
            $("#loginsacc-input").val("");
            $("#loginspw-input").val("");
            let obj = {
                action: "login",
                account: account,
                password: pw,
            }
            login(obj)
        } else {
            if (account.length === 0) {
                $("#loginsacc-input").css("border", "2.5px solid #db4a4a");
            }
            if (pw.length < 8) {
                $("#loginspw-input").css("border", "2.5px solid #db4a4a");
            }
        }
    });

    // 註冊
    $("#signslogin-btn").click(function (e) {
        $(".sign-loging .box>div .input input").css("border", "2.5px solid #dbdbdb");
        let account = $("#signsacc-input").val();
        let pw = $("#signspw-input").val();
        let cpw = $("#signscpw-input").val();
        if (account.length > 0 && pw.length >= 8 && cpw.length > 0 && pw == cpw) {
            $("#signsacc-input").val("");
            $("#signspw-input").val("");
            $("#signscpw-input").val("");
            let obj = {
                action: "sign",
                account: account,
                password: pw,
            }
            sign(obj)
        } else {
            if (account.length === 0) {
                $("#signsacc-input").css("border", "2.5px solid #db4a4a");
            }
            if (pw.length < 8) {
                $("#signspw-input").css("border", "2.5px solid #db4a4a");
            }
            if (cpw.length === 0 || pw !== cpw) {
                $("#signscpw-input").css("border", "2.5px solid #db4a4a");
            }
        }
    });
    console.log([
        "                   _ooOoo_",
        "                  o8888888o",
        "                  88\" . \"88",
        "                  (| -_- |)",
        "                  O\\  =  /O",
        "               ____/`---'\\____",
        "             .'  \\\\|     |//  `.",
        "            /  \\\\|||  :  |||//  \\",
        "           /  _||||| -:- |||||-  \\",
        "           |   | \\\\\\  -  /// |   |",
        "           | \\_|  ''\\---/''  |   |",
        "           \\  .-\\__  `-`  ___/-. /",
        "         ___`. .'  /--.--\\  `. . __",
        "      .\"\" '<  `.___\\_<|>_/___.'  >'\"\".",
        "     | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |",
        "     \\  \\ `-.   \\_ __\\ /__ _/   .-` /  /",
        "======`-.____`-.___\\_____/___.-`____.-'======",
        "                   `=---='",
        "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
        "===========佛祖保佑     讓我上第一志願==========="
    ].join('\n')); 
});
