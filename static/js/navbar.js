$(document).ready(function () {
	navIcon()
	console.log("navbar")
});


function navIcon() {
	let id = localStorage.getItem('IllllIlIII_hid')
	let tempHtml;
	if (id) {
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
	localStorage.removeItem('les_uid');
	localStorage.removeItem('IllllIlIII_hid');
	alert('로그아웃!')
	window.location.href = "/NewsCommunity-fFinal/index.html"
});