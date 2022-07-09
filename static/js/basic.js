var token = localStorage.getItem('les_uid');
var id = localStorage.getItem('IllllIlIII_hid');

$(document).ready(function () {
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
	refreshToken();
	navIcon()
})

// 토큰 값 갱신
function refreshToken() {
	console.log("refresh");
	$.ajax({
		type: "GET",
		url: '/api/token/refresh',
		data: {},
		xhrFields: { withCredentials: true },
		success: function (output, status, response) {
			if (output == "success") {
				token = response.getResponseHeader("token");
				localStorage.setItem("les_uid", token)
			}
		}
	});
}

// 네비게이션 바 아이콘 생성
function navIcon() {
	let tempHtml;
	if (id || token) {
		tempHtml=`<a class="profile_icon" href="/NewsCommunity-fFinal/profile.html?user=${id}"><i class="fa-regular fa-user"></i></a>
		<a class="logout_icon"><i class="fa-solid fa-right-from-bracket"
                                               aria-hidden="true"></i></a>`
	} else {
		tempHtml=`<a class="login_icon" onclick="window.location.href = '/NewsCommunity-fFinal/login.html'">
		<i class="fa-solid fa-arrow-right-to-bracket"></i></a>`
	}
	$(".navbar>.navbar_icon").empty().append(tempHtml);
}

$(document).on("click", ".logout_icon", function signOut() {
	$.ajax({
		type: "GET",
		url: '/api/token/signout',
		data: {},
		xhrFields: { withCredentials: true },
		success: function (response) {
		}
	});
	localStorage.removeItem('les_uid');
	localStorage.removeItem('IllllIlIII_hid');
	alert('로그아웃!')
	window.location.href = "/NewsCommunity-fFinal/index.html"
});
