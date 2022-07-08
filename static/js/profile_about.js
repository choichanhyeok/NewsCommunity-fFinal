var profileUser = location.href.split("?")[1].split("=")[1];

$(document).ready(function () {
	console.log("이 profile 주인은 바로 ~~~~: " + profileUser)
	getProfile(profileUser)
});

// 프로필 업데이트
$(document).on("click", "#update_profile", function updateProfile() {
	let name = $('#input-name').val()
	let file = $('#input-pic')[0].files[0]
	let about = $("#textarea-about").val()
	let form_data = new FormData()
	form_data.append("file_give", file)
	form_data.append("name_give", name)
	form_data.append("about_give", about)
	console.log(name, file, about, form_data)

	$.ajax({
		type: "POST",
		url: "/api/user/update_profile",
		data: form_data,
		cache: false,
		contentType: false,
		processData: false,
		success: function (response) {
			if (response["result"] == "success") {
				alert(response["msg"])
				window.location.reload()
			}
		}
	});
});

// 프로필 가져오기
function getProfile(username) {
	$("#profile-pic, #nickname, #profile-info, #edit-area, #nav-icon").empty();
	$.ajax({
		type: "GET",
		url: `/api/user/profile/${username}`,
		data: {},
		success: function (response) {
			if (response['status']) {
				let status = response['status']
				let link = response['link']!="default" ? response['link'] : "/static/profile_pics/profile_placeholder.png"
				let nickname = response['profile']['nickname']
				let picName = response['profile']['profile_pic']!="default" ? response['profile']['profile_pic'] : "기본 이미지"
				let info = response['profile']['profile_info']!=null ? response['profile']['profile_info'] : ""
				let img = `<img class="is-rounded" src=${link} alt="No img"/>`
				$("#profile-pic").append(img)
				$("#nickname").append(nickname)
				$("#profile-info").append(info!="" ? info : "멋진 소개글을 작성해 보세요!")
				if (status) {
					let tempHtml = canEdit(nickname, picName, info)
					$("#edit-area").append(tempHtml)
				}
			} else {
				console.log("error");
			}
		}
	});
}

// 프로필 수정
function canEdit(nickname, picName, info) {
	return `
			<nav id="btns-me" class="level is-mobile" style="margin-top:2rem">
                <a class="button level-item has-text-centered is-sparta" aria-label="edit"
                   onclick='$("#modal-edit").addClass("is-active")'>
                    프로필 수정&nbsp;&nbsp;&nbsp;<span class="icon is-small"><i class="fa fa-pencil" aria-hidden="true"></i></span>
                </a>
            </nav>
            <div class="modal" id="modal-edit">
                <div class="modal-background" onclick='$("#modal-edit").removeClass("is-active")'></div>
                <div class="modal-content">
                    <div class="box">
                        <article class="media">
                            <div class="media-content">
                                <div class="field">
                                    <label class="label" for="input-name">이름</label>
                                    <p class="control">
                                        <input id="input-name" class="input" placeholder="홍길동"
                                               value=${nickname}>
                                    </p>
                                </div>
                                <div class="field">
                                    <label class="label" for="input-pic">프로필 사진</label>
                                    <div class="control is-expanded">
                                        <div class="file has-name field has-addons" id = 'file-with-js'>
                                            <label class="file-label control" style="width:100%">
                                                <input id="input-pic" class="file-input" type="file" accept="image/gif, image/jpeg, image/png" name="resume">
                                                <span class="file-cta"><span class="file-icon"><i
                                                        class="fa fa-upload"></i></span>
                                                    <span class="file-label">파일 선택</span>
                                                </span>
                                                <span id="file-name" class="file-name"
                                                      style="width:100%;max-width:100%">${picName}</span>
                                            </label>
                                            <p class="control">
                                                <button class="button">
                                                  <span>삭제</span>
                                                </button>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="field">
                                    <label class="label" for="textarea-about">나는 누구?</label>
                                    <p class="control"><textarea id="textarea-about" class="textarea"
                                                                 placeholder="멋진 소개글을 작성해 보세요!">${info}</textarea>
                                    </p>
                                </div>
                                <nav class="level is-mobile">
                                    <div class="level-left">
                                    </div>
                                    <div class="level-right">
                                        <div class="level-item">
                                            <a id="update_profile" class="button is-sparta">업데이트</a>
                                        </div>
                                        <div class="level-item">
                                            <a class="button is-sparta is-outlined"
                                               onclick='$("#modal-edit").removeClass("is-active")'>취소</a>
                                        </div>
                                    </div>
                                </nav>
                            </div>
                        </article>
                    </div>
                </div>
                <button class="modal-close is-large" aria-label="close"
                        onclick='$("#modal-edit").removeClass("is-active")'></button>
            </div>
	`
}

// Bind an listener to onChange event of the input
$(document).on("change", "#file-with-js>.file-label>.file-input", function changeImgNm(){
	if(this.files.length > 0){
		var fileNameContainer =
			document.querySelector(
				"#file-with-js>.file-label>.file-name"
			);
		// set the inner text of fileNameContainer
		// to the name of the file
		fileNameContainer.textContent = this.files[0].name;
	}
});

// 이미지 삭제 후 파일 이름 기존 이미지 처리
$(document).on("click", "#file-with-js>.control>.button", function makeDefaultImgNm(){
	document.getElementById("input-pic").value=null;
	console.log(document.getElementById("input-pic").value)
	var fileNameContainer =
		document.querySelector(
			"#file-with-js>.file-label>.file-name"
		);
	// set the inner text of fileNameContainer
	// to the name of the file
	fileNameContainer.textContent = '기존 이미지'
});

// 북마크 기사 가져오기
function getPosts(user_id) {
	$("#comment-box").empty()
	$.ajax({
		type: "GET",
		url: `/posts_get?user_id_give=${user_id}`,
		data: {},
		success: function (response) {
			console.log(response["msg"])
			if (response["result"] == "success") {
				let posts = response["posts"].reverse()
				for (let i = 0; i < posts.length; i++) {
					let post = posts[i]
					let temp_html = `<div class="bookmark_post box" id="${post["post_id"]}">
                                            <a href="/detail/${post["post_id"]}">${post["title"]}</a>
                                        </div>`
					$("#comment-box").append(temp_html)
				}
			}
		}
	})
}

// 프로필 탭
function toggleTab(type) {
	console.log(type)
	let $li_tab = $(`#${type}`)
	if (`${type}`=="posts") {
		$li_tab.addClass("is-active").siblings().removeClass("is-active")
		posts_get(now_user_id)
	} else if (`${type}`=="comments") {
		$li_tab.addClass("is-active").siblings().removeClass("is-active")
		comments_get(now_user_id,"")
	}
}