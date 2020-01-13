$(function () {


    //#############################################################################
    //テスト（お遊び） ############################################################
    //#############################################################################

    //進むボタンで入力フォームやYes/Noボタンが出たり消える
    /*
    $(".btn_attach_forward").on("click", function () {
        if (!$(".btn_attach_forward").hasClass("is-disabled")) {
            if ($(".plaza").hasClass("form2-off")) {
                $(".plaza").removeClass("form2-off");
                $(".plaza").addClass("form2-on");
                $(".answer").css("visibility", "visible");
                $(".btn_yes").css("visibility", "visible");
                $(".btn_no").css("visibility", "visible");
                $(".talk").css("visibility", "visible");

                $(".btn_history").addClass("forward_on");
                if (!$(".btn_history").hasClass("back_on")) {
                    $(".btn_history").css("visibility", "hidden");
                }

            } else {
                $(".plaza").removeClass("form2-on");
                $(".plaza").addClass("form2-off");
                $(".answer").css("visibility", "hidden");
                $(".btn_yes").css("visibility", "hidden");
                $(".btn_no").css("visibility", "hidden");
                $(".talk").css("visibility", "hidden");

                $(".btn_history").removeClass("forward_on");
                if (!$(".btn_history").hasClass("back_on")) {
                    $(".btn_history").css("visibility", "visible");
                }

            }
        }
    });
    */

	/*
	//image_pathの使い方
	$(".test").attr("src", image_path("imgs/bear/bear1.png"));

	//getJSONの使い方 (public/hoge.json)
	$.getJSON('/test.json', function (data) {
		alert(data[0].test_name);
	});
	*/

    //テストボタンクリックで戻る進むボタンのON/OFF切り替え
	/*
	$(".test_btn").on("click", function () {
		if ($(".test_btn").hasClass("attach_prog_off")) {
			$(".test_btn").removeClass("attach_prog_off");
			$(".test_btn").addClass("attach_prog_on");
			$(".btn_attach_forward").removeClass("is-disabled");
		} else {
			$(".test_btn").removeClass("attach_prog_on");
			$(".test_btn").addClass("attach_prog_off");
			$(".attach_prog").val(0);
			$(".btn_attach_back").addClass("is-disabled");
			$(".btn_attach_forward").addClass("is-disabled");
		}
	});
	*/
    //戻る・進むボタンで進行度が変化
	/*
	$(".btn_attach_back").on("click", function () {
		if ($(".btn_attach_back").hasClass("is-disabled") == false) {
			if ($(".attach_prog").val() > 0) {
				if ($(".attach_prog").val() == 100) {
					$(".btn_attach_forward").removeClass("is-disabled");
				}
				$(".attach_prog").val($(".attach_prog").val() - 10);
				if ($(".attach_prog").val() == 0) {
					$(".btn_attach_back").addClass("is-disabled");
				}
			}
		}
	});
	$(".btn_attach_forward").on("click", function () {
		if ($(".btn_attach_forward").hasClass("is-disabled") == false) {
			if ($(".attach_prog").val() < $(".attach_prog").attr("max")) {
				if ($(".attach_prog").val() == 0) {
					$(".btn_attach_back").removeClass("is-disabled");
				}
				$(".attach_prog").val($(".attach_prog").val() + 10);
				if ($(".attach_prog").val() == 100) {
					$(".btn_attach_forward").addClass("is-disabled");
				}
			}
		}
    });
    */

});
