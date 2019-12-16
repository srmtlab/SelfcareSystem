$(function () {

    //#############################################################################
    //広場画面用js ################################################################
    //#############################################################################

    //########################################################
    //swiper.js 導入
    //########################################################
    let swiper = new Swiper('.swiper-container', {
        pagination: {
            el: '.swiper-pagination',
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        initialSlide: 1,
    });

    //########################################################
    //広場画面動作プログラム
    //########################################################

    //広場画面動作
    //広場画面事前準備
    var i = 1;
    swiper.allowTouchMove = false;
    //指標抽出、画像決定
    $(".life_index_left").text(routines[0].text);
    $(".life_index_center").text(routines[1].text);
    $(".life_index_right").text(routines[2].text);
    var imgs_left = make_char_imgs(avators[0], "left");
    var imgs_center = make_char_imgs(avators[1], "center");
    var imgs_right = make_char_imgs(avators[2], "right");
    $(".char_left").attr("src", image_path(imgs_left[0]));
    $(".char_center").attr("src", image_path(imgs_center[0]));
    $(".char_right").attr("src", image_path(imgs_right[0]));
    var category_left = categories[0][Math.floor(Math.random() * categories[0].length)]
    var category_center = categories[1][Math.floor(Math.random() * categories[1].length)]
    var category_right = categories[2][Math.floor(Math.random() * categories[2].length)]
    var category_list = [category_left, category_center, category_right]
    //広場画面案内
    // FIXME: URLを変更する
    $.getJSON("/template_talking.json", function (data) {
        //導入
        $(".btn_history_start").on("click", function () {
            $(".btn_next").prop("disabled", true);
            $(".talk_history").fadeOut(1000, function () {
                $(".talk_history").css("visibility", "hidden");
                $(".talk_history").css("display", "block");
                $(".talk_history_list").html("");
                $(".btn_history_close").css("display", "inline-block");
                $(".btn_history_start").css("visibility", "hidden");
                //広場画面開始
                $(".btn_history").fadeIn(1000);
                $(".btn_next").fadeIn(1000);
                $(".talk").fadeIn(1000, function () {
                    $(".fairy").attr("src", image_path("imgs/fairy/fairy_winter1.gif"));
                    $(".talker").attr("src", image_path("imgs/fairy/fairy_winter1.png"));
                    display_talk(data[0], routines, category_list, avators);
                });
            });
        });
        //テンプレート進行
        $(".btn_next").on("click", function () {
            if (i < data.length) {
                $(".btn_next").prop("disabled", true);
                if (data[i].who != data[i - 1].who) {
                    if (data[i - 1].who < 0) {
                        $(".fairy").attr("src", image_path("imgs/fairy/fairy_winter1.png"));
                    } else if (data[i - 1].who == 0) {
                        $(".char_left").attr("src", image_path(imgs_left[0]));
                    } else if (data[i - 1].who == 1) {
                        $(".char_center").attr("src", image_path(imgs_center[0]));
                    } else if (data[i - 1].who == 2) {
                        $(".char_right").attr("src", image_path(imgs_right[0]));
                    }
                }
                if (data[i].who == -1 || data[i].who == 1) {
                    swiper.slideTo(1);
                    if (data[i].who < 0) {
                        $(".fairy").attr("src", image_path("imgs/fairy/fairy_winter1.gif"));
                        $(".talker").attr("src", image_path("imgs/fairy/fairy_winter1.png"));
                    } else if (data[i].who == 1) {
                        $(".char_center").attr("src", image_path(imgs_center[1]));
                        $(".talker").attr("src", image_path(imgs_center[0]));
                    }
                } else if (data[i].who == 0) {
                    swiper.slideTo(0);
                    $(".char_left").attr("src", image_path(imgs_left[1]));
                    $(".talker").attr("src", image_path(imgs_left[0]));
                } else if (data[i].who == 2) {
                    swiper.slideTo(2);
                    $(".char_right").attr("src", image_path(imgs_right[1]));
                    $(".talker").attr("src", image_path(imgs_right[0]));
                }
                display_talk(data[i++], routines, category_list, avators);
            } else if (i == data.length) {
                $(".btn_next").fadeOut(1000, function () {
                    $(".btn_next").text("記録画面");
                    $(".btn_next").fadeIn(1000);
                });
                $(".talk").fadeOut(1000, function () {
                    $(".talk_who").text("");
                    $(".talk_text").html("");
                    $(".talker").attr("src", image_path("imgs/other/white.png"));
                    $(".fairy").attr("src", image_path("imgs/fairy/fairy_winter1.png"));
                    $(".btn_attach_back").removeClass("is-disabled");
                    $(".btn_attach_forward").removeClass("is-disabled");
                    $(".talk").css({ "opacity": 1 });
                    $(".talk").css("visibility", "hidden");
                    $(".talk").css("display", "block");
                    swiper.allowTouchMove = true;
                });
                i += 1
            } else if (i > data.length) {
                //記録画面ボタン(Noボタン)で記録画面に遷移
                window.location.href = '/';
            }
        });

    });

    $(".btn_history").on("click", function () {
        $(".talk_history").css("visibility", "visible");
    });
    $(".btn_history_close").on("click", function () {
        $(".talk_history").css("visibility", "hidden");
    });

    $(".btn_yes").on("click", function () {
        $.ajax({
            url: '/plaza/routines',
            type: 'POST',
            data: {
                "answer": $("#name_field").val()
            }
        })
            // Ajaxリクエストが成功した時発動
            .done((data) => {

                //$(".talk_text").html(data["user_name"] + "さん" + data["text"] + "を登録しました");
            })
            // Ajaxリクエストが失敗した時発動
            .fail((data) => {

            })
            // Ajaxリクエストが成功・失敗どちらでも発動
            .always((data) => {

            });
    });


    //########################################################
    //使用関数
    //########################################################

    //会話文を表示させる & 履歴に会話文を追加
    //文字を1文字ずつ表示する
    function display_talk(data, routines, category_list, avators) {
        var talking = data.talk;
        //履歴に追加する
        if (data.who < 0) {
            $(".talk_history_list").append("<p class=\"talk_history_who\">プラザ</p>");
            $(".talk_who").text("プラザ");
        } else if (data.who == 0) {
            $(".talk_history_list").append("<p class=\"talk_history_who\">" + avators[0].name + "</p>");
            talking = replace_talk(talking, routines[0], category_list[0], avators[0]);
            $(".talk_who").text(avators[0].name);
        } else if (data.who == 1) {
            $(".talk_history_list").append("<p class=\"talk_history_who\">" + avators[1].name + "</p>");
            talking = replace_talk(talking, routines[1], category_list[1], avators[1]);
            $(".talk_who").text(avators[1].name);
        } else if (data.who == 2) {
            $(".talk_history_list").append("<p class=\"talk_history_who\">" + avators[2].name + "</p>");
            talking = replace_talk(talking, routines[2], category_list[2], avators[2]);
            $(".talk_who").text(avators[2].name);
        }
        $(".talk_history_list").append("<p>" + talking + "</p>");
        //全文字をspanタグで囲む
        $(".talk_text").css({ "opacity": 0 });
        $(".talk_text span").css({ "opacity": 0 });
        $(".talk_text").html(talking);
        $(".talk_text").children().andSelf().contents().each(function () {
            if (this.nodeType == 3) {
                $(this).replaceWith($(this).text().replace(/(\S)/g, '<span>$1</span>'));
            }
        });
        //文字を1文字ずつ表示する
        $(".talk_text").css({ "opacity": 1 });
        for (var i = 0; i <= $(".talk_text").children().size(); i++) {
            $(".talk_text").children("span:eq(" + i + ")").delay(35 * i).animate({ "opacity": 1 }, 50);
        };
        $(".btn_next").prop("disabled", false);
    }

    //表示するキャラクター画像を決定
    function make_char_imgs(arr, dir) {
        var char_icon = arr.icon;
        var char_img = [];
        if (dir == "left") {
            char_img.push("imgs/" + char_icon + "/" + char_icon + "_left1.png");
            char_img.push("imgs/" + char_icon + "/" + char_icon + "_left2.png");
            return char_img;
        } else if (dir == "center") {
            char_img.push("imgs/" + char_icon + "/" + char_icon + "1.png");
            char_img.push("imgs/" + char_icon + "/" + char_icon + "1.gif");
            return char_img;
        } else if (dir == "right") {
            char_img.push("imgs/" + char_icon + "/" + char_icon + "_right1.png");
            char_img.push("imgs/" + char_icon + "/" + char_icon + "_right2.png");
            return char_img;
        } else {
            alert("error: can\'t make imgs_url");
        }
    }

    //キャラクターの話の中で現れるname,とlife_index,をキャラの名前、指標に置換する
    function replace_talk(talk, routine, category, avator) {
        var talking = talk;
        var user_name = avator.name;
        var user_routine = routine.text;
        var user_period = routine.period;
        var user_count = routine.count;
        if (talking.indexOf("name,") != -1) {
            talking = talking.replace("name,", "「" + user_name + "」");
        }
        if (talking.indexOf("category,") != -1) {
            if (category == "health") {
                talking = talking.replace("category,", "「身体のリラックス」<br>");
            } else if (category == "mind") {
                talking = talking.replace("category,", "「感覚に働きかける<br>リラックス」");
            } else if (category == "sociality") {
                talking = talking.replace("category,", "「対人関係によるリラックス」<br>");
            } else if (category == "self_expression") {
                talking = talking.replace("category,", "「学びや精神に働きかける<br>リラックス」");
            }
        }
        if (talking.indexOf("life_index,") != -1) {
            talking = talking.replace("life_index,", "「" + user_routine + "」を<br>");
            if (user_period == 1) {
                talking = talking + "「1日に" + user_count + "回」だよ。";
            } else if (user_period == 7) {
                talking = talking + "「1週間に" + user_count + "回」だよ。";
            } else if (user_period == 30) {
                talking = talking + "「1か月に" + user_count + "回」だよ。";
            }
        }
        return talking;
    }


    //#############################################################################
    //テスト（お遊び） ############################################################
    //#############################################################################

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