var id = localStorage.getItem('IllllIlIII_hid');
var token = localStorage.getItem('les_uid');

$(document).ready(function () {
	if (token != null) {
		alert("로그아웃을 먼저 해주세요!")
		window.location.replace("index.html")
	}
	var csrftoken = $('meta[name=csrf-token]').attr('content')
	$.ajaxSetup({
		beforeSend: function (xhr, settings) {
			settings.url = "http://localhost:4993"+this.url; // have to modify
			if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
				xhr.setRequestHeader("X-CSRFToken", csrftoken);
			}
			xhr.setRequestHeader("Authorization", "Bearer " + token);
		}
	});
})

// 회원가입 버튼, 취소 버튼 전환
function toggleSignUp() {
	$("#double_ck").toggleClass("is-hidden")
	$("#undertext_id").toggleClass("is-hidden")
	$("#undertext_pw").toggleClass("is-hidden")
	$("#login-signup").toggleClass("is-hidden")
	$("#signin_up_btn").toggleClass("is-hidden")
	$("#sign_up_nav").toggleClass("is-hidden")
	$("#pw_ch2").toggleClass("is-hidden")
}

// 아이디 양식 확인
function isNickname(asValue) {
	var regExp = /^(?=.*[a-zA-Z])[-a-zA-Z0-9_.]{2,10}$/;
	return regExp.test(asValue);
}

// 비밀번호 양식 확인
function isPassword(asValue) {
	var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
	return regExp.test(asValue);
}

// 아이디 중복 확인
function checkDuplication() {
	let username = $("#input_id").val()
	if (username == "") {
		$("#undertext_id").text("아이디를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
		$("#input_id").focus()
		return;
	}
	if (!isNickname(username)) {
		$("#undertext_id").text("아이디의 형식을 확인해주세요. 영문과 숫자, 일부 특수문자(._-) 사용 가능. 2-10자 길이").removeClass("is-safe").addClass("is-danger")
		$("#input_id").focus()
		return;
	}
	$("#undertext_id").addClass("is-loading")

	$.ajax({
		type: "POST",
		url: "/api/signup/checkdup",
		data: {
			"username": username
		},
		success: function (response) {
			if (response["exists"]) {
				$("#undertext_id").text("이미 존재하는 아이디입니다.").removeClass("is-safe").addClass("is-danger")
				$("#input_id").focus()
			} else {
				$("#undertext_id").text("사용할 수 있는 아이디입니다.").removeClass("is-danger").addClass("is-success")
			}
			$("#undertext_id").removeClass("is-loading")
		}
	});
}

// 회원가입
function signUp() {
	let username = $("#input_id").val()
	let password = $("#input_pw").val()
	let password2 = $("#input_pw2").val()
	if ($("#undertext_id").hasClass("is-danger")) {
		alert("아이디를 다시 확인해주세요.")
		return;
	} else if (!$("#undertext_id").hasClass("is-success")) {
		alert("아이디 중복확인을 해주세요.")
		return;
	}

	if (password == "") {
		$("#undertext_pw").text("비밀번호를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
		$("#input_pw").focus()
		return;
	} else if (!isPassword(password)) {
		$("#undertext_pw").text("비밀번호의 형식을 확인해주세요. 영문과 숫자 필수 포함, 특수문자(!@#$%^&*) 사용가능 8-20자").removeClass("is-safe").addClass("is-danger")
		$("#input_pw").focus()
		return
	} else {
		$("#undertext_pw").text("사용할 수 있는 비밀번호입니다.").removeClass("is-danger").addClass("is-success")
	}
	if (password2 == "") {
		$("#undertext_pw2").text("비밀번호를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
		$("#input_pw2").focus()
		return;
	} else if (password2 != password) {
		$("#undertext_pw2").text("비밀번호가 일치하지 않습니다.").removeClass("is-safe").addClass("is-danger")
		$("#input_pw2").focus()
		return;
	} else {
		$("#undertext_pw2").text("비밀번호가 일치합니다.").removeClass("is-danger").addClass("is-success")
	}
	$.ajax({
		type: "POST",
		url: "/api/signup",
		data: {
			username: username,
			password: password
		},
		success: function () {
			alert("회원가입을 축하드립니다!")
			window.location.replace("login.html")
		}
	});
}

// 로그인
function signIn() {
	let username = $("#input_id").val()
	let password = $("#input_pw").val()

	if (username == "") {
		$("#undertext_id_loginpage").text("아이디를 입력해주세요.")
		$("#input_id").focus()
		return;
	} else {
		$("#undertext_id_loginpage").text("")
	}
	if (password == "") {
		$("#undertext_pw_loginpage").text("비밀번호를 입력해주세요.")
		$("#input_pw").focus()
		return;
	} else {
		$("#undertext_pw_loginpage").text("")
	}
	$.ajax({
		type: "POST",
		url: "/api/login",
		data: {
			username: username,
			password: password
		},
		xhrFields: { withCredentials: true },
		success: function (output,status,response) {

			console.log("test")
			if (output == "success") {
				token = response.getResponseHeader("token");
				id = atob(response.getResponseHeader("username"));
				localStorage.setItem("les_uid",token)
				localStorage.setItem("IllllIlIII_hid",id)
				window.location.replace("./index.html")
				alert("login success")
			} else {
				alert("error")
			}
		}
	});
}
