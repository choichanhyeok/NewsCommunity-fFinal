var token = localStorage.getItem('les_uid');
var id = localStorage.getItem('IllllIlIII_hid');

$(document).ready(function () {
	var csrftoken = $('meta[name=csrf-token]').attr('content')
	$.ajaxSetup({
		beforeSend: function (xhr, settings) {
			settings.url = "https://www.chanhyeoking.com"+this.url; // have to modify
			if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
				xhr.setRequestHeader("X-CSRFToken", csrftoken);
			}
			if (token != null) xhr.setRequestHeader("Authorization", "Bearer " + token)
		},
		error: function (output, status, response) {
			if (status === 403) {
				refreshToken($.ajax(this))
			}
		}
	});
	navIcon()
})

// 토큰 값 갱신
function refreshToken(a) {
	$.ajax({
		async: false,
		type: "GET",
		url: '/api/token/refresh',
		data: {},
		xhrFields: { withCredentials: true },
		success: function (output, status, response) {
			if (output == "success") {
				token = response.getResponseHeader("token");
				localStorage.setItem("les_uid", token);
				setTimeout(a, 500);
			}
		},
		error: function () {
			localStorage.removeItem('les_uid');
			localStorage.removeItem('IllllIlIII_hid');
			alert("재로그인 해주세요!")
			window.location.href = "login.html"
		}
	});
}

// 네비게이션 바 아이콘 생성
function navIcon() {
	let tempHtml;
	if (id || token) {
		tempHtml=`
		<a class="support_icon" onclick="window.location.href = 'support.html'"><i class="fa fa-question-circle-o" aria-hidden="true"></i></a>
		<a class="profile_icon" href="profile.html?user=${id}"><i class="fa-regular fa-user"></i></a>
		<a class="logout_icon"><i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i></a>
		`
	} else {
		tempHtml=`
			<a class="support_icon" onclick="window.location.href = 'support.html'"><i class="fa fa-question-circle-o" aria-hidden="true"></i></a>
			<a class="login_icon" onclick="window.location.href = 'login.html'"><i class="fa-solid fa-arrow-right-to-bracket"></i></a>
		`
	}
	$(".navbar>.navbar_icon").empty().append(tempHtml);
}

$(document).on("click", ".logout_icon", function signOut() {
	$.ajax({
		async: false,
		type: "GET",
		url: '/api/user/signout',
		data: {},
		xhrFields: { withCredentials: true },
		success: function () {
			afterSignOut()
		}, error: function () {
			afterSignOut()
		}
	});
});

function afterSignOut() {
	localStorage.removeItem('les_uid');
	localStorage.removeItem('IllllIlIII_hid');
	alert('로그아웃!')
	window.location.href = "index.html"
}