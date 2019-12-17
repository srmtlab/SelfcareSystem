$(function () {

    //##################################################################################################
    //広場画面用js #####################################################################################
    //##################################################################################################

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

    //###############################################################################################
    //広場画面動作プログラム  ########################################################################
    //###############################################################################################

    //広場画面動作
    //######################################
    //広場画面事前準備
    //######################################
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
    //######################################
    //広場画面案内
    //######################################
    // FIXME: URLを変更する（神谷先輩曰く、template_talking.jsonを使うのはあまりよくない？）
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
                    display_talk(data[0], current_user.name, routines, category_list, avators);
                });
            });
        });
        //######################################
        //テンプレート進行
        //######################################
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
                if (data[i].who < 0 || data[i].who == 1) {
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
                display_talk(data[i++], current_user.name, routines, category_list, avators);
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
                //記録画面ボタン(元次へボタン)で記録画面に遷移
                //FIXME: 記録画面以外（安田の質問画面）にも遷移したい
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

    //######################################
    //入力フォームで指標頻度が決まったときに指標回数をselectに追加する
    //######################################
    $(".answer_frequency_period").change(function () {
        for (var i = 0; i < 100; i++) {
            $(".answer_frequency_count").append('<option value="' + (i + 1) + '">' + (i + 1) + '</option>');
        }
    })

    //######################################
    //Yes/Noボタンで指標入力管理
    //######################################
    $(".btn_yes").on("click", function () {
        if ($(".plaza").hasClass("answer-off")) {
            $(".btn_yes").prop("disabled", true);
            $(".btn_no").prop("disabled", true);
            $(".btn_yes").fadeOut(1000);
            $(".btn_no").fadeOut(1000, function () {
                data_yes = { "who": -1, "talk": "それじゃあどんな指標を<br>見つけたのか教えてくれないかな。" };
                display_talk(data_yes, current_user.name, routines, category_list, avators);
                $(".btn_yes").prop("disabled", false);
                $(".btn_no").prop("disabled", false);
                $(".btn_submit").prop("disabled", true);
                $(".btn_cancel").prop("disabled", true);
                $(".form").fadeIn(1000, function () {
                    $(".plaza").removeClass("answer-off");
                    $(".plaza").addClass("answer-on");
                    $(".btn_submit").prop("disabled", false);
                    $(".btn_cancel").prop("disabled", false);
                });
            });
        } else if ($(".plaza").hasClass("answer-on")) {
            $(".plaza").removeClass("answer-on");
            $(".plaza").addClass("answer-off");
            $(".btn_yes").prop("disabled", true);
            $(".btn_no").prop("disabled", true);
            $(".btn_next").prop("disabled", true);
            $(".btn_yes").fadeOut(1000);
            $(".btn_no").fadeOut(1000, function () {
                data_yes = { "who": -1, "talk": "そっか、残念...。<br>次に期待だね。" };
                display_talk(data_yes, current_user.name, routines, category_list, avators);
                $(".btn_next").fadeIn(1000, function () {
                    $(".btn_next").prop("disabled", false);
                    $(".btn_yes").prop("disabled", false);
                    $(".btn_no").prop("disabled", false);
                });
            });
            //formの入力内容を消去する
            $(".answer_text").val("");
            $(".answer_frequency_period option[value='0']").prop('selected', true);
            $(".answer_frequency_count option[value='0']").prop('selected', true);
            $(".checkbox_health").prop("checked", false);
            $(".checkbox_mind").prop("checked", false);
            $(".checkbox_sociality").prop("checked", false);
            $(".checkbox_expression").prop("checked", false);
        }
    });

    $(".btn_no").on("click", function () {
        if ($(".plaza").hasClass("answer-off")) {
            $(".btn_yes").prop("disabled", true);
            $(".btn_no").prop("disabled", true);
            $(".btn_yes").fadeOut(1000);
            $(".btn_no").fadeOut(1000, function () {
                data_no = { "who": -1, "talk": "そっか、残念...。<br>次に期待だね。" };
                display_talk(data_no, current_user.name, routines, category_list, avators);
                $(".btn_next").fadeIn(1000, function () {
                    $(".btn_next").prop("disabled", false);
                });
                $(".btn_yes").prop("disabled", false);
                $(".btn_no").prop("disabled", false);
            });
        }
        if ($(".plaza").hasClass("answer-on")) {
            $(".btn_yes").prop("disabled", true);
            $(".btn_no").prop("disabled", true);
            $(".btn_submit").prop("disabled", true);
            $(".btn_cancel").prop("disabled", true);
            $(".btn_yes").fadeOut(1000);
            $(".btn_no").fadeOut(1000, function () {
                data_no = { "who": -1, "talk": "どんな指標を見つけたのか<br>教えてくれないかな。" };
                display_talk(data_no, current_user.name, routines, category_list, avators);
                $(".form").fadeIn(1000, function () {
                    $(".btn_yes").prop("disabled", false);
                    $(".btn_no").prop("disabled", false);
                    $(".btn_submit").prop("disabled", false);
                    $(".btn_cancel").prop("disabled", false);
                });
            });
        }
    });

    $(".btn_submit").on("click", function () {
        if ($(".plaza").hasClass("answer-on")) {
            $(".btn_submit").prop("disabled", true);
            var check_text = $(".answer_text").val();
            var check_period = $(".answer_frequency_period option:selected").val();
            var check_count = $(".answer_frequency_count option:selected").val();
            var answer_period = $(".answer_frequency_period option:selected").text();
            var answer_count = $(".answer_frequency_count option:selected").text();
            var check_category = [];
            var answer_categories = [];
            var answer_category = "";
            check_category.push($(".checkbox_health").prop("checked"));
            if ($(".checkbox_health").prop("checked")) {
                answer_categories.push($(".checkbox_health").val());
            }
            check_category.push($(".checkbox_mind").prop("checked"));
            if ($(".checkbox_mind").prop("checked")) {
                answer_categories.push($(".checkbox_mind").val());
            }
            check_category.push($(".checkbox_sociality").prop("checked"));
            if ($(".checkbox_sociality").prop("checked")) {
                answer_categories.push($(".checkbox_sociality").val());
            }
            check_category.push($(".checkbox_expression").prop("checked"));
            if ($(".checkbox_expression").prop("checked")) {
                answer_categories.push($(".checkbox_expression").val());
            }
            //入力フォームが全部入力されていた時
            if (check_text != "" && check_period != 0 && check_count != 0 && check_category.indexOf(true) != -1) {
                //TODO:if(安田のオントロジーモジュールで入力内容が正しいか判定したいな)
                //FIXME: 入力が全部されていてもroutine.textがwikidata上で妥当かを判断
                $(".plaza").removeClass("answer-on");
                $(".answer_text_container").fadeOut(1000);
                $(".answer_frequency_container").fadeOut(1000);
                $(".answer_category_container").fadeOut(1000, function () {
                    data_submit = { "who": -1, "talk": "これでいいかな？" };
                    display_talk(data_submit, current_user.name, routines, category_list, avators);
                    $(".answer_routine").append("<p>生活指標：" + check_text + "</p>");
                    $(".answer_routine").append("<p>頻度：" + answer_period + ", 回数：" + answer_count + "</p>");
                    for (var i = 0; i < answer_categories.length; i++) {
                        if (i < answer_categories.length - 1) {
                            answer_category = answer_category + answer_categories[i] + ", ";
                        } else if (i == answer_categories.length - 1) {
                            answer_category = answer_category + answer_categories[i];
                        }
                        if (i == 1) {
                            answer_category = answer_category + "<br>　　　";
                        }
                    }
                    $(".answer_routine").append("<p>分類：" + answer_category + "</p>");
                    $(".answer_routine").fadeIn(1000, function () {
                        $(".plaza").addClass("answer-check");
                        $(".btn_submit").prop("disabled", false);
                    });
                });
            } else {
                data_submit = { "who": -1, "talk": "入力されてない項目があるよ。" };
                display_talk(data_submit, current_user.name, routines, category_list, avators);
                $(".btn_submit").prop("disabled", false);
            }
        }
        if ($(".plaza").hasClass("answer-check")) {
            $(".btn_submit").prop("disabled", true);
            $(".btn_cancel").prop("disabled", true);
            //指標と
            var routine_text = $(".answer_text").val();
            var answer_period = $(".answer_frequency_period option:selected").val();
            if (answer_period == 1) {
                answer_period = 1;
            } else if (answer_period == 2) {
                answer_period = 7;
            } else if (answer_period == 3) {
                answer_period = 30;
            }
            var answer_count = $(".answer_frequency_count option:selected").val();
            var answer_category = [];
            answer_category.push($(".checkbox_health").prop("checked"));
            answer_category.push($(".checkbox_mind").prop("checked"));
            answer_category.push($(".checkbox_sociality").prop("checked"));
            answer_category.push($(".checkbox_expression").prop("checked"));

            //入力指標の最終確認をした後に決定ボタン
            $.ajax({
                url: '/plaza/routines',
                type: 'POST',
                data: {
                    "routine_text": routine_text,
                    "routine_period": answer_period,
                    "routine_count": answer_count,
                    "categories": answer_category
                }
            })
                // Ajaxリクエストが成功した時発動
                .done((data) => {
                    $(".form").fadeOut(1000, function () {
                        $(".btn_submit").prop("disabled", false);
                        $(".btn_cancel").prop("disabled", false);
                        $(".answer_text").val("");
                        $(".answer_frequency_period option[value='0']").prop('selected', true);
                        $(".answer_frequency_count option[value='0']").prop('selected', true);
                        $(".checkbox_health").prop("checked", false);
                        $(".checkbox_mind").prop("checked", false);
                        $(".checkbox_sociality").prop("checked", false);
                        $(".checkbox_expression").prop("checked", false);
                        display_talk(data, current_user.name, routines, category_list, avators)
                    });
                    $(".btn_next").fadeIn(1000);
                    //$(".talk_text").html(data["user_name"] + "さん" + data["text"] + "を登録しました");
                })
                // Ajaxリクエストが失敗した時発動
                .fail((data) => {
                    console.log("データ送信、受信に失敗");
                })
                // Ajaxリクエストが成功・失敗どちらでも発動
                .always((data) => {

                });
        }
    });

    $(".btn_cancel").on("click", function () {
        if ($(".plaza").hasClass("answer-on")) {
            //指標入力フォームでキャンセルボタン
            $(".btn_yes").prop("disabled", true);
            $(".btn_no").prop("disabled", true);
            $(".btn_submit").prop("disabled", true);
            $(".btn_cancel").prop("disabled", true);
            $(".form").fadeOut(1000, function () {
                data_cancel = { "who": -1, "talk": "生活指標の登録をやめる？" };
                display_talk(data_cancel, current_user.name, routines, category_list, avators);
                $(".btn_yes").fadeIn(1000);
                $(".btn_no").fadeIn(1000, function () {
                    $(".btn_yes").prop("disabled", false);
                    $(".btn_no").prop("disabled", false);
                    $(".btn_submit").prop("disabled", false);
                    $(".btn_cancel").prop("disabled", false);
                });
            });
        }
        if ($(".plaza").hasClass("answer-check")) {
            $(".btn_submit").prop("disabled", true);
            $(".plaza").removeClass("answer-check");
            $(".plaza").addClass("answer-on");
            $(".answer_routine").fadeOut(1000, function () {
                data_submit = { "who": -1, "talk": "どんな指標を見つけたのか<br>教えてくれないかな。" };
                display_talk(data_submit, current_user.name, routines, category_list, avators);
                $(".answer_routine").html("");
                $(".answer_text_container").fadeIn(1000);
                $(".answer_frequency_container").fadeIn(1000);
                $(".answer_category_container").fadeIn(1000);
                $(".btn_submit").prop("disabled", false);
            });
        }
    });


    //####################################################################################################
    //使用関数  ##########################################################################################
    //####################################################################################################

    //######################################
    //会話文を表示させる & 履歴に会話文を追加
    //文字を1文字ずつ表示する
    //######################################
    function display_talk(data, current_user_name, routines, category_list, avators) {
        var talking = data.talk;
        //履歴に追加する
        if (data.who < 0) {
            $(".talk_history_list").append("<p class=\"talk_history_who\">プラザ</p>");
            talking = replace_talk(current_user_name, talking, 0, 0, 0);
            $(".talk_who").text("プラザ");
        } else if (data.who == 0) {
            $(".talk_history_list").append("<p class=\"talk_history_who\">" + avators[0].name + "</p>");
            talking = replace_talk(current_user_name, talking, routines[0], category_list[0], avators[0]);
            $(".talk_who").text(avators[0].name);
        } else if (data.who == 1) {
            $(".talk_history_list").append("<p class=\"talk_history_who\">" + avators[1].name + "</p>");
            talking = replace_talk(current_user_name, talking, routines[1], category_list[1], avators[1]);
            $(".talk_who").text(avators[1].name);
        } else if (data.who == 2) {
            $(".talk_history_list").append("<p class=\"talk_history_who\">" + avators[2].name + "</p>");
            talking = replace_talk(current_user_name, talking, routines[2], category_list[2], avators[2]);
            $(".talk_who").text(avators[2].name);
        }
        $(".talk_history_list").append("<p" + talking + "</p>");
        if (talking.indexOf(" class=\"talk_history_back\">") != -1) {
            talking = talking.replace(" class=\"talk_history_back\">", "");
        } else if (talking.indexOf(">") != -1) {
            talking = talking.replace(">", "");
        }
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
        if (data.who == -2) {
            //nextボタンを消して、Yes/Noボタンで返答を行うように誘導
            $(".btn_yes").prop("disabled", true);
            $(".btn_no").prop("disabled", true);
            $(".btn_next").fadeOut(1000);
            $(".btn_yes").fadeIn(1000);
            $(".btn_no").fadeIn(1000, function () {
                $(".btn_yes").prop("disabled", false);
                $(".btn_no").prop("disabled", false);
            });
        } else {
            $(".btn_next").prop("disabled", false);
        }
    }

    //######################################
    //キャラクターの話の中で現れるname,とlife_index,をキャラの名前、指標に置換する
    //######################################
    function replace_talk(current_user_name, talk, routine, category, avator) {
        var talking = talk;
        var user_name = avator.name;
        var user_routine = routine.text;
        var user_period = routine.period;
        var user_count = routine.count;
        var replace_check = false;
        if (talking.indexOf("name,") != -1) {
            talking = talking.replace("name,", "「" + user_name + "」");
        }
        if (talking.indexOf("current_user,") != -1) {
            talking = talking.replace("current_user,", "「" + current_user_name + "」");
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
            replace_check = true;
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
            replace_check = true;
        }
        if (replace_check == true) {
            return " class=\"talk_history_back\">" + talking;
        } else {
            return ">" + talking;
        }
    }

    //######################################
    //引数からキャラクターのpng+gifを生成 ###
    //######################################
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