$(document).ready(function(){
    getComments();
})

// 댓글 정렬 함수 - ye
function set_sorting_method(sorting_item) {
    let status_text = $(sorting_item).text();
    let sorting_txt = document.getElementById("sort_comments_txt");
    if (status_text == "") {
        sorting_txt.textContent = "댓글 정렬";
    } else {
        sorting_txt.textContent = status_text;
    }
    let sorting_txt_selected = document.getElementById("sort_comments_txt").textContent;
    sorting_txt_selected = sorting_txt_selected.trim();
    if (sorting_txt_selected == "오래된 순") {
        sorting_status_eng = "old"
    } else if (sorting_txt_selected == "좋아요 순") {
        sorting_status_eng = "like"
    } else if (sorting_txt_selected == "최신 순") {
        sorting_status_eng = "new"
    }
    comments_get("", now_post_id, sorting_status_eng)
}

String.replaceAll = function(search, replacement) {
    return this.split(search).join(replacement);
};

// 현재 보고 있는 뉴스의 아이디(PK)를 얻는 함수
function getNewsId() {
    let params = new URLSearchParams(document.location.search);
    let newsId = params.get("news_id");
    return newsId;
}

// 댓글 작성 함수 -hj
function postComment() {
    let content = $('#comment').val();
    let newsId = getNewsId();
    let data = {
        "content": content,
        "newsId": newsId
    }
    $.ajax({
        type: "POST",
        url: `/api/comments`,
        contentType: "application/json", // JSON 형식으로 전달함을 알리기
        data: JSON.stringify(data),
        success: function (response) {
            alert('댓글이 성공적으로 작성되었습니다.');
            window.location.reload();
        }
    });
}

// 댓글 작성 시간 단위
function time2str(date) {
    let today = new Date()
    let time = (today - date) / 1000 / 60  // 분

    if (time < 60) {
        return parseInt(time) + "분 전"
    }
    time = time / 60  // 시간
    if (time < 24) {
        return parseInt(time) + "시간 전"
    }
    time = time / 24
    if (time < 7) {
        return parseInt(time) + "일 전"
    }
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

// 좋아요 갯수 단위
function num2str(count) {
    if (count > 10000) {
        return parseInt(count / 1000) + "K"
    }
    if (count > 500) {
        return parseInt(count / 100) / 10 + "K"
    }
    if (count == 0) {
        return ""
    }
    return count
}

// 댓글 리스팅
function getComments() {
    let newsId = getNewsId();
    $("#comment-box").empty()
    $.ajax({
        type: "GET",
        url: `/api/user/comments/${newsId}`,
        success: function (response) {
            for (let i=0; i<response.length; i++) {
                let comment = response[i];
                let commentId = comment.commentId;
                let createdAt = comment.createdAt;
                let time = time2str(createdAt);
                let content = comment.content;
                let username = comment.user.username;
                addHTML(commentId, time, content, username);
            }
        }
    })
}

function addHTML(commentId, time, content, username) {
    let tempHtml = `<div class="box" id="${comment["_id"]}">
                        <article class="media">
                            <div class="media-left">
                                <a class="image is-64x64" href="/profile/${comment['user_id']}">
                                    <img class="is-rounded" src="/static/profile_pics/profile_placeholder"
                                         alt="Image">
                                </a>
                            </div>
                            <div class="media-content">
                                <div class="content">
                                    <div class="level">
                                        <p class="level-left">
                                            <strong style="font-weight: bold">닉네임</strong>
                                            &nbsp;<small style="font-size: 0.9rem">@${username}</small>
                                            &nbsp;&nbsp;<small style="font-size: 0.9rem">${time}</small>
                                        </p>
                                        <small id="modalBtn" class="level-right">수정</small>
                                        <small onclick="deleteConfirm(${commentId})" class="level-right">삭제</small>
                                    </div>
                                    <div class="comment">${content}</div>
                                </div>
                                <nav class="level is-mobile">
                                    <div class="level-left">
                                        <a class="level-item like_icon" aria-label="like" onclick="toggle_like('${comment['_id']}')">
                                                                                    <span class="icon is-small"><i class="fa ${icon}"
                                                                                                                   aria-hidden="true"></i></span>&nbsp;<span class="like-num">${count}</span>
                                        </a>
                                    </div>
                                </nav>
                            </div>
                        </article>
                   </div>
                   <div id="testModal" class="modal" tabindex="-1">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">댓글 수정하기</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                        <textarea id="modifiedContent" class="modalTextArea" placeholder="${content}"></textarea>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">닫기</button>
                                    <button type="button" class="btn btn-primary" onclick="editComment(${commentId})">수정완료</button>
                                </div>
                            </div>
                        </div>
                    </div>`;
    $("#comment-box").append(tempHtml);
}

// 댓글 수정 시 모달 띄우기
$('#modalBtn').click(function(e){
    e.preventDefault();
    $('#testModal').modal("show");
})

// 댓글 수정 함수
function editComment(commentId) {
    let content = $('#modifiedContent').val();
    let data = {
        "content": content
    }

    $.ajax({
        type: "PUT",
        url: `/api/comments/${commentId}`,
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (response) {
            alert('댓글을 수정했습니다.');
            window.location.reload();
        }
    });
}

// 댓글을 삭제하기 전 한 번 더 물어보게 하기 위한 자바스크립트 내장 confirm 함수 사용
function deleteConfirm(commentId) {
    if (confirm('정말로 삭제하시겠습니까?')) {
        deleteComment(commentId)  // 확인 누르면 댓글 삭제
    } else {
        return false  // 취소 누르면 아무런 일도 일어나지 않음
    }
}

// 댓글 삭제 함수
function deleteComment(commentId) {
    $.ajax({
        type: "DELETE",
        url: `/api/comments/${commentId}`,
        success: function (response) {
            alert('댓글 삭제에 성공하였습니다.');
            window.location.reload();
        }
    });
}

// 북마크 여부 확인
function bookmarked(post_id) {
    $("#bookmark").empty()
    $.ajax({
        type: "GET",
        url: `/bookmarked?post_id_give=${post_id}`,
        data: {},
        success: function (response) {
            if (response["result"] == "success") {
                let bookmark_by_me = response["bookmark_by_me"]
                let icon = bookmark_by_me ? "fa-bookmark" : "fa-bookmark-o"
                let temp_html = `<div id="${post_id}" class="bookmark">
                                    <a class="level-item is-sparta" aria-label="bookmark"
                                           onclick="toggle_bookmark(${post_id})">
                                                    <span class="icon is-small"><i class="icon_ fa fa-solid ${icon}"
                                                                                   aria-hidden="true"></i></span>
                                    </a>
                                  </div>`
                $("#bookmark").append(temp_html)
            }
        }
    })
}

// 좋아요, 좋아요 취소
function toggle_like(comment_id) {
    let $a_like = $(`#${comment_id} a[aria-label='like']`)
    let $i_like = $(`#${comment_id} a[aria-label='like']`).find("i")
    if ($i_like.hasClass("fa-heart")) {
        $.ajax({
            type: "POST",
            url: "/like_update",
            data: {
                comment_id_give: comment_id,
                action_give: "unlike"
            },
            success: function (response) {
                $i_like.addClass("fa-heart-o").removeClass("fa-heart")
                $a_like.find("span.like-num").text(num2str(response["count"]))
            }
        })
    } else {
        $.ajax({
            type: "POST",
            url: "/like_update",
            data: {
                comment_id_give: comment_id,
                action_give: "like"
            },
            success: function (response) {
                $i_like.addClass("fa-heart").removeClass("fa-heart-o")
                $a_like.find("span.like-num").text(num2str(response["count"]))
            }
        })

    }
}

// 북마크, 북마크 취소
function toggle_bookmark(post_id) {
    let $i_bookmark = $(`#${post_id} a[aria-label='bookmark']`).find("i")
    if ($i_bookmark.hasClass("fa-bookmark")) {
        $.ajax({
            type: "POST",
            url: "/bookmark",
            data: {
                post_id_give: post_id,
                action_give: "unbookmark"
            },
            success: function (response) {
                $i_bookmark.addClass("fa-bookmark-o").removeClass("fa-bookmark")
            }
        })
    } else {
        $.ajax({
            type: "POST",
            url: "/bookmark",
            data: {
                post_id_give: post_id,
                action_give: "bookmark"
            },
            success: function (response) {
                $i_bookmark.addClass("fa-bookmark").removeClass("fa-bookmark-o")
            }
        })

    }
}