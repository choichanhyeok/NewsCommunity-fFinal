history.scrollRestoration = "manual"

$(document).ready(function () {
    getList();
});

function toggleWriting() {
    let getToken = localStorage.getItem('IllllIlIII_hid');
    if (getToken == null){
        alert('작성은 로그인 후 가능합니다')
    } else {
        $("#sumbit_toggle").toggle();
        $("#input_text").val('');
        $("#input_name").val('');
        $("#input_title").val('');
    }
}

function toggleMyId(num) {
    let buildID = '#contentsbox-' + num;
    $(buildID).toggle();
}

function submitContent() {
    let newTitle = $("#input_title").val();
    let newText = $("#input_text").val();
    let data = {"post_title": newTitle, "post_content": newText};
    if (newTitle != null && newText != null) {
        $.ajax({
            type: "POST",
            url: `/api/user/supports/`,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (response) {
                window.location.reload()
            }
        });
    }
}

function editContent(contentIdx) {
    let getToken = localStorage.getItem('IllllIlIII_hid');
    let setContentsID = '#contents-' + contentIdx;
    let setUsername = '#username-' + contentIdx;
    let getUsername = $(setUsername).text();

    if(getToken==getUsername){
        if ($('.edit_btn').html() == "수정") { //수정 시작
            alert('수정을 시작합니다');
            $(setContentsID).attr("readonly", false);
            $('.edit_btn').html('저장');
        } else { //저장버튼 클릭 후
            $('.edit_btn').html('수정'); //저장 버튼 클릭 => 수정으로 글씨 변경 및 서버 전송
            $(setContentsID).attr("readonly", true);
            let contents = $(setContentsID).val();
            let data = {"post_content": contents};
            console.log(data)
            $.ajax({
                type: "PUT",
                url: `/api/user/supports/${contentIdx}`,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (response) {
                    alert('수정 완료');
                }
            });
        }
    }else{
        alert("권한이 없습니다.")
    }


}

function deleteContent(contentIdx){
    let getToken = localStorage.getItem('IllllIlIII_hid');
    let setUsername = '#username-' + contentIdx;
    let getUsername = $(setUsername).text();

    if(getToken==getUsername){

        $.ajax({
            type: "DELETE",
            url: `/api/user/supports/${contentIdx}`,
            contentType: "application/json",
            success: function (response) {
                window.location.reload()
                alert("삭제완료")
            }
        });
    }else{
        alert("권한이 없습니다.")
    }
}

function getList() {
    $.ajax({
        url: '/api/supports',
        type: 'GET',
        success: function (result) {
            $('#table_body').empty();
            for (let i = 0; i < result.length; i++) {
                let getUsername = result[i]["username"];
                let getTitle = result[i]["post_title"];
                let getContent = result[i]["post_content"];
                let idx = result[i]["id"];

                let created = result[i]["created_at"];
                let createdYYMMDD = created.slice(0, 10);
                let createdWithTime = created.slice(0, 10) + ' ' + created.slice(11, 19);

                let myhtml = `
                            <tr class="tr_title" id="open_it">
                                <th scope="row">${idx}</th>
                                <td class="name">
                                    <a onclick="toggleMyId(${idx})"> ${getTitle} </a>
                                </td>
                                <td id="username-${idx}">${getUsername}</td>
                                <td>${createdYYMMDD}</td>
                            </tr>
                            <tr id="contentsbox-${idx}" class="content_box" style="display: none;">
                                <td colspan = "4" style="background-color: lightgray; padding: 30px 50px;">
                                    <div >
                                        <div class="content_btn_div" style="display: flex; justify-items: right;">
                                            <div class="content_btn_sub_div" style="margin-left: auto; padding-bottom: 10px;">
                                                <button onclick="deleteContent(${idx})" type="button" class="submit_btn btn btn-light">게시글 삭제하기</button>
                                            </div>
                                        </div>
                                        <div class="input-group mb-3" >
                                            <span class="input-group-text" style="background-color: #f7f7f7">작성 시각</span>
                                            <span class="form-control" style="background-color: white; text-align: left;">${createdWithTime}</span>
                                        </div>
                                        <div class="input-group mb-3">
                                            <span class="input-group-text" style="background-color: #f7f7f7">작성 내용</span>
                                            <span class="form-control" style="background-color: white">
                                                <textarea id="contents-${idx}" style="border: none;height:20rem;" readonly class="form-control text_area">${getContent}</textarea>
                                            </span>
                                        </div>

                                        <div class="content_btn_div" style="display: flex; justify-items: right;">
                                            <div class="content_btn_sub_div" style="margin-left: auto;">
                                                <button onclick="editContent(${idx})" type="button" class="edit_btn btn btn-light">수정</button>
                                                <button onclick="toggleMyId(${idx})" type="button" class="submit_btn btn btn-light">닫기</button>
                                            </div>
                                        </div>


                                    </div>
                                </td>
                            </tr>;`
                $('#table_body').append(myhtml);
            }

        },
        error: function (e) {
            console.log(e);
        }
    });

}